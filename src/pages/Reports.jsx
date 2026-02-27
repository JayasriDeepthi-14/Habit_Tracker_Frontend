import { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/habits/logs")
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-6">Loading reports...</div>
      </>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <>
        <Header />
        <div className="p-6 text-gray-500">
          No tracking data available yet.
        </div>
      </>
    );
  }

  // 🔹 Calculate Status Counts
  const completed = logs.filter(l => l.status === "completed").length;
  const skipped = logs.filter(l => l.status === "skipped").length;
  const missed = logs.filter(l => l.status === "missed").length;

  const total = logs.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  // 🔹 Weekly Calculation
  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    dayjs().subtract(i, "day").format("YYYY-MM-DD")
  ).reverse();

  const weeklyData = last7Days.map(date =>
    logs.filter(
      l => dayjs(l.date).format("YYYY-MM-DD") === date &&
           l.status === "completed"
    ).length
  );

  const barData = {
    labels: last7Days.map(d => dayjs(d).format("ddd")),
    datasets: [
      {
        label: "Completed Habits",
        data: weeklyData,
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Skipped", "Missed"],
    datasets: [
      {
        data: [completed, skipped, missed],
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(234,179,8,0.7)",
          "rgba(239,68,68,0.7)",
        ],
      },
    ],
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          📊 Reports & Analytics
        </h2>

        {/* Completion Percentage */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3">
            Completion Rate
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className="bg-blue-600 h-6 rounded-full text-white text-sm flex items-center justify-center"
              style={{ width: `${percentage}%` }}
            >
              {percentage}%
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Weekly Completed Habits
          </h3>
          <Bar data={barData} />
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            Habit Status Distribution
          </h3>
          <Pie data={pieData} />
        </div>

      </div>
    </>
  );
}