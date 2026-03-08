import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {

  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [todayLogs, setTodayLogs] = useState([]);
  const [weekly, setWeekly] = useState([]);

  const loadData = async () => {
    try {

      const habitsRes = await api.get("/habits");
      setHabits(habitsRes.data);

      const streakRes = await api.get("/streak");
      setStreak(streakRes.data.streak);

      const logsRes = await api.get("/habits/logs");

      const today = new Date().toISOString().split("T")[0];

      const filtered = logsRes.data.filter(l => {
        const logDate = new Date(l.date).toISOString().split("T")[0];
        return logDate === today;
      });

      setTodayLogs(filtered);

      const reportRes = await api.get("/reports");
      setWeekly(reportRes.data.weekly);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const track = async (id) => {
    try {
      await api.post("/habits/track", {
        habit_id: id,
        status: "completed"
      });

      loadData();

    } catch {
      console.log("Already marked");
    }
  };

  const completed = todayLogs.length;
  const remaining = habits.length - completed;

  const completionPercent =
    habits.length === 0
      ? 0
      : Math.round((completed / habits.length) * 100);

  const chartData = {
    labels: weekly.map(w => w.date),
    datasets: [
      {
        label: "Completed Habits",
        data: weekly.map(w => w.count),
        backgroundColor: "#8b5cf6"
      }
    ]
  };

  return (
    <div className="p-6 space-y-10">

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Today's Progress</h3>
          <p className="text-3xl font-bold">{completionPercent}%</p>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl shadow">
          <h3>🔥 Current Streak</h3>
          <p className="text-3xl font-bold">{streak} Days</p>
        </div>

        <div className="bg-violet-500 text-white p-6 rounded-xl shadow">
          <h3>Total Habits</h3>
          <p className="text-3xl font-bold">{habits.length}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h3>Completed Today</h3>
          <p className="text-3xl font-bold">{completed}</p>
        </div>

      </div>

      {/* Motivation */}
      <div className="bg-yellow-100 p-5 rounded-xl">
        {remaining === 0
          ? "🎉 Amazing! All habits completed today!"
          : `🔥 Keep going! ${remaining} habits left today.`}
      </div>

      {/* Weekly Graph */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Weekly Activity
        </h2>

        {weekly.length > 0 && (
          <Bar data={chartData} />
        )}
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
                  <p className="font-semibold">{h.title}</p>
                  <p className="text-sm text-gray-500">
                    {h.category}
                  </p>
                </div>

                <button
                  disabled={alreadyMarked}
                  onClick={() => track(h.id)}
                  className={`px-4 py-2 rounded-lg text-white ${
                    alreadyMarked
                      ? "bg-green-600"
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

      {/* Completed Today */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Completed Today
        </h2>

        <div className="space-y-3">

          {todayLogs.map(log => {

            const habit = habits.find(
              h => h.id === log.habit_id
            );

            if (!habit) return null;

            return (
              <div
                key={log.id}
                className="bg-green-100 p-3 rounded"
              >
                ✔ {habit.title}
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}