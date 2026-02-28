import { useEffect, useState } from "react";
import api from "../services/api";

export default function Streak() {

  const [streak, setStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {

    const load = async () => {
      const s = await api.get("/streak");
      setStreak(s.data.streak);

      const l = await api.get("/streak/leaderboard");
      setLeaderboard(l.data);
    };

    load();

  }, []);

  return (
    <>

      <div className="p-6">

        {/* Current Streak */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">
            🔥 Current Streak
          </h2>
          <p className="text-5xl font-extrabold mt-3">
            {streak} Days
          </p>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🏆 Leaderboard
          </h2>

          <div className="space-y-3">

            {leaderboard.map((user, index) => (
              <div
                key={index}
                className="flex justify-between bg-gray-100 p-4 rounded-lg"
              >
                <span className="font-medium">
                  {index + 1}. {user.name}
                </span>

                <span className="text-primary font-bold">
                  🔥 {user.streak}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </>
  );
}