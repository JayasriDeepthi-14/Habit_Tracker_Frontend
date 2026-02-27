import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

export default function Dashboard() {

  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [todayLogs, setTodayLogs] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const loadData = async () => {
    const h = await api.get("/habits");
    setHabits(h.data);

    const s = await api.get("/streak");
    setStreak(s.data.streak);

    const logs = await api.get("/habits/logs");
    const filtered = logs.data.filter(l => l.date === today);
    setTodayLogs(filtered);
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
      alert("Already marked today");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">

        {/* Streak Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-600">
            Current Streak
          </h2>
          <p className="text-4xl font-extrabold mt-2 text-gray-800">
            {streak} Days
          </p>
        </div>

        {/* Today's Habits */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Today's Habits
          </h2>

          <div className="space-y-4">
            {habits.map(h => {

              const alreadyMarked = todayLogs.some(
                l => l.habit_id === h.id
              );

              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {h.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {h.category} • {h.priority}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      disabled={alreadyMarked}
                      onClick={() => track(h.id, "completed")}
                      className={`px-3 py-1 rounded-md ${
                        alreadyMarked
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      Completed
                    </button>

                    <button
                      disabled={alreadyMarked}
                      onClick={() => track(h.id, "skipped")}
                      className={`px-3 py-1 rounded-md ${
                        alreadyMarked
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      Skipped
                    </button>

                    <button
                      disabled={alreadyMarked}
                      onClick={() => track(h.id, "missed")}
                      className={`px-3 py-1 rounded-md ${
                        alreadyMarked
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      Missed
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}