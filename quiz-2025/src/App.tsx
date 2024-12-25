import { useSearchParams } from "react-router";
import "./App.css";
import QuizCard from "./components/custom/quiz-card";

import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect } from "react";
import { z } from "zod";
import InitCard from "./components/custom/init-card";
import StatsCard from "./components/custom/stats-card";
import { UserCard, UserForm } from "./components/custom/user-card";
import { Button } from "./components/ui/button";
import { Tables } from "./database.types";
import useSupabase from "./hooks/useSupabase";
import { QuizStepState, useQuizStore } from "./stores/quiz-store";

function App() {
  const [searchParams] = useSearchParams();
  const quizStore = useQuizStore();
  const isAdmin = searchParams.get("admin") === "true";
  const supabase = useSupabase();

  useEffect(() => {
    const userId = window.localStorage.getItem("user");
    if (userId) {
      supabase.getUser(Number(userId));
    }

    const answered = window.localStorage.getItem("answered");
    if (!answered) {
      window.localStorage.setItem("answered", JSON.stringify([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitUser = async (data: z.infer<typeof UserForm>) => {
    const username = data.name;
    const user = await supabase.addUser(username);
    window.localStorage.setItem("user", String(user?.id));
  };

  const onSubmitAnswer = async (score: number, answer: Tables<"answers">) => {
    supabase.addScore(answer.question, answer.id, score);
  };

  let card = <InitCard />;
  if (!isAdmin && !quizStore.user) {
    card = <UserCard onSubmit={onSubmitUser} />;
  } else if (quizStore.state?.current_state === QuizStepState.QUESTION) {
    card = <QuizCard onSubmit={onSubmitAnswer} />;
  } else if (
    quizStore.state?.current_state === QuizStepState.STATISTIC ||
    quizStore.state?.current_state === QuizStepState.END
  ) {
    card = <StatsCard />;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full sm:w-96 flex flex-col items-center p-2">
        {card}
        {isAdmin ? (
          <div className="mt-6 flex flex-col md:flex-row gap-2 w-full">
            <Button
              variant="outline"
              className="w-full rounded-2xl py-6"
              disabled={quizStore.state?.current_state === QuizStepState.INIT}
              onClick={supabase.resetQuiz}
            >
              Reset
            </Button>
            <Button
              disabled={quizStore.state?.current_state === QuizStepState.END}
              className="w-full rounded-2xl py-6"
              onClick={supabase.handleUpdateQuizState}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </ThemeProvider>
  );
}

export default App;
