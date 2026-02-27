import { useState, useEffect } from "react";
import api from "../services/api";
import Header from "../components/Header";

export default function Habits() {

  const [habits, setHabits] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "Low"
  });

  // Load habits
  const load = () =>
    api.get("/habits").then(r => setHabits(r.data));

  useEffect(() => {
    load();
  }, []);

  // Add new habit
  const add = async () => {
    if (!form.title) return;

    await api.post("/habits", form);

    setForm({
      title: "",
      category: "",
      priority: "Low"
    });

    load();
  };

  // Delete habit
  const deleteHabit = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
    if (!confirmDelete) return;

    await api.delete(`/habits/${id}`);
    load();
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 p-6">

        {/* Add Habit Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-2xl mx-auto">

          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Add New Habit
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Habit Title"
              value={form.title}
              onChange={e =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              placeholder="Category (Health, Study, etc.)"
              value={form.category}
              onChange={e =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              value={form.priority}
              onChange={e =>
                setForm({ ...form, priority: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <button
              onClick={add}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Add Habit
            </button>

          </div>
        </div>

        {/* Habit List */}
        <div className="max-w-4xl mx-auto">

          <h2 className="text-xl font-semibold mb-4">
            Your Habits
          </h2>

          {habits.length === 0 ? (
            <p className="text-gray-500">
              No habits added yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {habits.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {h.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {h.category} • {h.priority}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        h.priority === "High"
                          ? "bg-red-100 text-red-600"
                          : h.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {h.priority}
                    </span>

                    <button
                      onClick={() => deleteHabit(h.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </>
  );
}