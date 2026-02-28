import { useEffect, useState } from "react";
import api from "../services/api";

export default function Me() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/user/stats");
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <>

      <div className="p-6 max-w-3xl mx-auto">

        <div className="bg-white shadow-lg rounded-xl p-8">

          <div className="text-center mb-6">

            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
              {stats.name.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {stats.name}
            </h2>

            <p className="text-gray-500">
              {stats.email}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-semibold">
                {new Date(stats.joined).toDateString()}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Total Completed</p>
              <p className="font-semibold">
                {stats.totalCompleted}
              </p>
            </div>

          </div>

          <div className="mt-8 bg-orange-500 text-white p-6 rounded-xl text-center">
            <h3 className="text-xl font-bold">
              🔥 Keep Building Your Streak!
            </h3>
          </div>

        </div>

      </div>
    </>
  );
}