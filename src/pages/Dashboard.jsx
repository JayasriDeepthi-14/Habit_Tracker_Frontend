import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {

  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [todayLogs, setTodayLogs] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const loadData = async () => {
  try {
    const h = await api.get("/habits");
    setHabits(h.data);

    const s = await api.get("/streak");
    setStreak(s.data.streak);

    const logs = await api.get("/habits/logs");

    const todayDate = new Date().toISOString().split("T")[0];

    const filteredLogs = logs.data.filter(l => {
      const logDate = new Date(l.date).toISOString().split("T")[0];
      return logDate === todayDate;
    });

    setTodayLogs(filteredLogs);

  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    loadData();
  }, []);

  const track = async (id, status) => {
    try {
      await api.post("/habits/track", {
        habit_id: id,
        status
      });

      await loadData();

    } catch (err) {
      console.log("Already marked today");
    }
  };

  const completionPercent =
    habits.length === 0
      ? 0
      : Math.round((todayLogs.length / habits.length) * 100);

  return (
    <div className="p-6 space-y-8">

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-gray-500">Today's Progress</h3>
          <p className="text-3xl font-bold">
            {completionPercent}%
          </p>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl">
          <h3>🔥 Current Streak</h3>
          <p className="text-3xl font-bold">
            {streak} Days
          </p>
        </div>

        <div className="text-primary text-white p-6 rounded-xl">
          <h3>Total Habits</h3>
          <p className="text-3xl font-bold">
            {habits.length}
          </p>
        </div>

      </div>

      {/* Today's Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          Today's Tasks
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          {habits.map(h => {

            const alreadyMarked = todayLogs.some(
              l => l.habit_id === h.id
            );

            return (
              <div
                key={h.id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {h.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {h.category}
                  </p>
                </div>

                <button
                  disabled={alreadyMarked}
                  onClick={() => track(h.id, "completed")}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    alreadyMarked
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {alreadyMarked ? "Completed" : "Mark"}
                </button>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}