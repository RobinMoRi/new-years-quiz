import { useQuizStore } from "@/stores/quiz-store";
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StatsCard = () => {
  const { user, users, scores } = useQuizStore();

  const getScoreByUserId = (userId: number) => {
    return (
      scores
        .filter((el) => el.user_id === userId)
        .reduce((total, el) => total + el?.score, 0) || 0
    );
  };

  const sortedUsers = users.sort((a, b) => {
    const scoreA = scores
      .filter((el) => el.user_id === a.id)
      .reduce((total, el) => total + el?.score, 0);
    const scoreB = scores
      .filter((el) => el.user_id === b.id)
      .reduce((total, el) => total + el?.score, 0);

    if (!scoreA && !scoreB) return 0;
    if (!scoreA) return 1;
    if (!scoreB) return -1;
    return scoreB - scoreA;
  });

  const firstThree = sortedUsers.slice(0, 3);
  const [first, second, third] = firstThree;
  const reorderTopPlace = [second, first, third];
  const rest = sortedUsers.slice(3);

  return (
    <Card className="w-full opacity-90">
      <CardHeader className="text-center text-xl mb-6">
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4 mb-6 justify-center">
          {reorderTopPlace.map((el, idx) => {
            let place = 1;
            if (idx === 0) place = 2;
            if (idx === 2) place = 3;

            const size = place === 1 ? 80 : 60;
            const color =
              place === 1 ? "#FFC000" : place === 2 ? "#c4c4c4" : "#CD7F32";
            return (
              <div
                key={el?.id}
                className="flex flex-col gap-2 items-center justify-end"
              >
                <div
                  style={{
                    width: size,
                    height: size,
                    borderColor: el?.id === user?.id ? color : "gray",
                  }}
                  className="rounded-full w-10 h-10 shrink-0 border-2 relative flex items-center justify-center"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${el?.name}`}
                  />
                  {place === 1 ? (
                    <Crown
                      className="absolute top-[-40px]"
                      color={color}
                      size={32}
                    />
                  ) : null}
                </div>
                <div className="flex flex-col items-center">
                  <div className="font-bold">
                    {el?.name} {el?.id === user?.id ? "(you)" : ""}
                  </div>
                  <div style={{ color: color }}>{getScoreByUserId(el?.id)}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {rest.map((el, idx) => {
            return (
              <div key={el?.id} className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center w-3 font-extrabold">
                  {idx + 4}
                </div>
                <div className="flex flex-row justify-between w-full bg-tertiary p-2 py-6 rounded-lg text-white font-bold">
                  <div className="flex flex-row gap-2 items-center">
                    <img
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${el?.name}`}
                      width={24}
                    />
                    {el?.name} {el?.id === user?.id ? "(you)" : ""}
                  </div>
                  <div> {getScoreByUserId(el?.id)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
