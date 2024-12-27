import { Tables } from "@/database.types";
import { useQuizStore } from "@/stores/quiz-store";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

const QuizCard = ({
  onSubmit,
}: {
  onSubmit: (score: number, answer: Tables<"answers">) => void;
}) => {
  const { question, answers, user, scores } = useQuizStore();
  const [answerId, setAnswerId] = useState<number>();
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
    const interval = setInterval(() => {
      setTime((prev) => prev + 0.5);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const score = scores.find(
      (el) => el.question_id === question?.id && el.user_id === user?.id
    );

    if (score) {
      setAnswerId(score.answer_id);
    }
  }, [scores]);

  const onSetAnswer = (answer: Tables<"answers">) => {
    if (!answer) {
      return;
    }
    setAnswerId(answer.id);
    let score = 0;
    if (answer.correct) {
      // Update user with score
      score = Math.round((180 / (time + 1)) * 100); // Shouldn't take more than 2 min to answer a question
    }
    onSubmit(score, answer);
  };

  return (
    <Card className="w-full  relative  border-slate-950">
      <CardHeader className="p-0 rounded-t-xl overflow-hidden">
        <div className="relative">
          <Badge className="absolute bottom-4 left-4" variant="secondary">
            {question?.month}
          </Badge>

          {question && question.image_url ? (
            <img src={question.image_url} />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-md mb-2 text-slate-400">{question?.category}</div>
        <div className="text-lg mb-4">{question?.title}</div>
        <div className="grid grid-cols-1 gap-2">
          {answers.map((ans) => {
            return (
              <Button
                variant={ans.id === answerId ? "default" : "secondary"}
                className="rounded-xl py-6"
                key={ans.id}
                onClick={() => onSetAnswer(ans)}
                disabled={!!answerId}
              >
                {ans.title}
              </Button>
            );
          })}
        </div>
      </CardContent>
      <div className="w-full flex absolute top-[-32px] justify-center">
        <div className="flex flex-row gap-2 bg-card p-1 rounded-t-md items-center">
          <img
            src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user?.name}`}
            width={24}
          />
          <span className="text-sm">{user?.name}</span>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;
