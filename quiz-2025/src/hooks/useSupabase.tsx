import { supabase } from "@/utils/supabase";

import { Tables } from "@/database.types";
import { QuizStepState, useQuizStore } from "@/stores/quiz-store";
import { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useEffect } from "react";

const getNextState = (
  state: Tables<"quizstate"> | null,
  question: Tables<"questions"> | null
) => {
  if (!state || !question) return;
  const MAX_QUESTIONS = 12;

  const currQuestion = question.id;
  const currState = state.current_state;

  let current_state = 0;

  if (currQuestion && currQuestion < MAX_QUESTIONS) {
    if (currState === QuizStepState.INIT) {
      current_state = QuizStepState.QUESTION;
    } else if (currState === QuizStepState.QUESTION) {
      current_state = QuizStepState.STATISTIC;
    } else if (currState === QuizStepState.STATISTIC) {
      current_state = QuizStepState.QUESTION;
    }
  } else {
    current_state = QuizStepState.END;
  }

  let question_id = currQuestion;
  if (current_state === QuizStepState.STATISTIC) {
    // pre-fetch question when seeing statistics
    question_id += 1;
    if (question_id > MAX_QUESTIONS) {
      question_id = 12;
    }
  }

  return { current_state, question_id };
};

const useSupabase = () => {
  const quizcard = useQuizStore();

  const getCurrentState = async () => {
    const { data } = await supabase.from("quizstate").select().eq("id", 2);
    return data?.[0];
  };

  const getCurrentQuestion = async (question_id: number) => {
    const { data } = await supabase
      .from("questions")
      .select()
      .eq("id", question_id);
    return data?.[0];
  };

  const getCurrentAnswers = async (question_id: number) => {
    const { data } = await supabase
      .from("answers")
      .select("*")
      .eq("question", question_id);

    return data?.sort(() => 0.5 - Math.random());
  };

  const addUser = async (name: string) => {
    const { data } = await supabase
      .from("users")
      .insert({ name, score: 0 })
      .select();
    const user = data?.[0];
    quizcard.setUser(user);
    if (user) {
      quizcard.updateUsers(user);
    }
    return user;
  };

  const addScore = async (
    questionId: number,
    answerId: number,
    score: number
  ) => {
    const userId = quizcard.user?.id;
    if (!userId) return;

    await supabase
      .from("scores")
      .insert({
        score: score,
        user_id: userId,
        question_id: questionId,
        answer_id: answerId,
      })
      .select();
  };

  const getUser = async (user_id: number) => {
    const { data } = await supabase.from("users").select("*").eq("id", user_id);
    const user = data?.[0];
    quizcard.setUser(user);
  };

  const getUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    quizcard.setUsers(data || []);
  };

  const getScores = async () => {
    const { data } = await supabase.from("scores").select("*");
    quizcard.setScores(data || []);
  };

  const resetQuiz = async () => {
    await supabase
      .from("quizstate")
      .update({ question_id: 1, current_state: QuizStepState.INIT })
      .eq("id", 2);

    // reset scores
    const updates = quizcard.users.map((user) => user.id);
    for (const user of updates) {
      await supabase.from("scores").delete().eq("user_id", user);
    }
  };

  useEffect(() => {
    const questionId = quizcard.state?.question_id;

    getCurrentQuestion(questionId || 1).then((question) => {
      quizcard.setQuestion(question);
    });

    getCurrentAnswers(questionId || 1).then((answers) => {
      quizcard.setAnswers(answers || []);
    });

    if (quizcard.state?.current_state === QuizStepState.INIT) {
      window.localStorage.setItem("answered", JSON.stringify([]));
    }

    getUsers();
    getScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizcard.state]);

  useEffect(() => {
    getCurrentState().then(quizcard.setState);
    getUsers();
    getScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStateUpdate = (
    payload: RealtimePostgresUpdatePayload<Tables<"quizstate">>
  ) => {
    quizcard.setState(payload.new);
  };

  const onUsersUpdate = () => {
    getUsers();
  };

  const onScoresUpdate = () => {
    getScores();
  };

  const handleUpdateQuizState = async () => {
    const nextState = getNextState(quizcard.state, quizcard.question);
    await supabase
      .from("quizstate")
      .update({ ...nextState })
      .eq("id", 2);
  };

  // Listen to db updates
  supabase
    .channel("quiz")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "quizstate" },
      onStateUpdate
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "users" },
      onUsersUpdate
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "users" },
      onUsersUpdate
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "scores" },
      onScoresUpdate
    )
    .subscribe();

  return {
    handleUpdateQuizState,
    resetQuiz,
    addUser,
    getUser,
    addScore,
  };
};

export default useSupabase;
