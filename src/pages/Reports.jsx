import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {

  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/reports");
      setData(res.data);
    };
    load();
  }, []);

  if (!data) return <div>Loading...</div>;

  const chartData = {
    labels: data.weekly.map(day => day.date),
    datasets: [
      {
        label: "Habits Completed",
        data: data.weekly.map(day => day.count),
        backgroundColor: "#7c3aed"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return (
    <div className="space-y-8">

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-blue-500 text-white p-6 rounded-xl">
          <h3>Total Habits</h3>
          <p className="text-3xl font-bold">
            {data.totalHabits}
          </p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl">
          <h3>Total Completed</h3>
          <p className="text-3xl font-bold">
            {data.totalCompleted}
          </p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl">
          <h3>Completion %</h3>
          <p className="text-3xl font-bold">
            {data.completionPercentage}%
          </p>
        </div>

      </div>

      {/* Weekly Data */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Last 7 Days
        </h2>

        <div className="space-y-3">

          {data.weekly.map(day => (

            <div
              key={day.date}
              className="flex justify-between bg-gray-100 p-3 rounded"
            >

              <span>{day.date}</span>

              <span className="font-semibold">
                {day.count} Completed
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Categories */}
      <div>

        <h2 className="text-xl font-semibold mb-4">
          Category Breakdown
        </h2>

        <div className="space-y-3">

          {Object.keys(data.categories).map(cat => (

            <div
              key={cat}
              className="flex justify-between bg-gray-100 p-3 rounded"
            >

              <span>{cat}</span>

              <span className="font-semibold">
                {data.categories[cat]}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}