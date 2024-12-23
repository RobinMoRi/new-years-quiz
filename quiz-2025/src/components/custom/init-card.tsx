import { useQuizStore } from "@/stores/quiz-store";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription } from "../ui/card";

const InitCard = () => {
  const { users, user } = useQuizStore();
  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <img
          src="https://www.shutterstock.com/shutterstock/videos/3609066267/thumb/10.jpg?ip=x480"
          alt="ny-2025"
        />
        <CardDescription className="p-4">
          <div className="text-xl font-semibold">
            Robin's 2025 New Years Quiz
          </div>
          <div>
            12 questions, one for each month, about the year that has passed.
          </div>
          <div className="text-lg my-2">Waiting users...</div>
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
