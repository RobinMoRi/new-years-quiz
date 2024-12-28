import { useQuizStore } from "@/stores/quiz-store";
import { useSearchParams } from "react-router";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription } from "../ui/card";

const InitCard = () => {
  const { users, user } = useQuizStore();
  const [searchParams] = useSearchParams();

  const isAdmin = searchParams.get("admin") === "true";

  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <img
          src="https://www.shutterstock.com/shutterstock/videos/3609066267/thumb/10.jpg?ip=x480"
          alt="ny-2025"
          className="w-full"
        />
        <CardDescription className="p-4 text-primary-foreground">
          <div className="text-xl font-semibold">
            Robin's 2025 New Years Quiz
          </div>
          <div>
            A fun 12-question quiz, with one question for each month, to see how
            much you remember about the past year!
          </div>
          {isAdmin ? (
            <div className="flex justify-center">
              <img src="/qr.svg" width={150} />
            </div>
          ) : null}
          <div className="my-2 text-slate-400">Lobby</div>
          <div className="max-w-1/2 flex gap-2 flex-wrap">
            {users.map((usr) => {
              return (
                <Badge
                  key={usr.id}
                  variant={usr.id === user?.id ? "default" : "outline"}
                >
                  <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${usr?.name}`}
                    width={24}
                  />
                  {usr.name}
                </Badge>
              );
            })}
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default InitCard;
