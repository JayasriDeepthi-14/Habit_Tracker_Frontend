import { useEffect, useState } from "react";
import api from "../services/api";

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

  return (
    <>
    
      <div className="p-6 space-y-8">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">

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

        {/* Category Breakdown */}
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
    </>
  );
}