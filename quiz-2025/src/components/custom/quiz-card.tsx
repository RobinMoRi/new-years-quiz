import { Tables } from "@/database.types";
import { useQuizStore } from "@/stores/quiz-store";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const QuizCard = ({
  onSubmit,
}: {
  onSubmit: (score: number, answer: Tables<"answers">) => void;
}) => {
  const { question, answers } = useQuizStore();
  const [currAnswer, setAnswer] = useState<Tables<"answers">>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.5);
    }, 500);

    const answered = window.localStorage.getItem("answered");
    if (answered) {
      const ans: {
        question: Tables<"questions">;
        answer: Tables<"answers">;
      }[] = JSON.parse(answered);
      const entry = ans.find((el) => el.question.id === question?.id);
      if (entry) {
        setAnswer(entry.answer);
      }
    }

    return () => clearInterval(interval);
  }, []);

  const onSetAnswer = (answer: Tables<"answers">) => {
    if (!answer) {
      return;
    }
    setAnswer(answer);
    let score = 0;
    if (answer.correct) {
      // Update user with score
      score = Math.round((120 / (time + 1)) * 100); // Shouldn't take more than 2 min to answer a question
    }
    onSubmit(score, answer);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{question?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {answers.map((ans) => {
            return (
              <Button
                variant={ans.id === currAnswer?.id ? "secondary" : "default"}
                key={ans.id}
                onClick={() => onSetAnswer(ans)}
                disabled={!!currAnswer}
              >
                {ans.title}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
