import { useState, useEffect } from "react";
import api from "../services/api";

const categories = {
  "Live Healthier": [
    "Drinking Water",
    "Take Medicine",
    "Eat Healthy Food",
    "Morning Walk",
    "Stretching"
  ],
  "Relieve Pressure": [
    "Listening Songs",
    "Dancing",
    "Yoga",
    "Meditation",
    "Breathing Exercise"
  ],
  "Try New Things": [
    "Video Editing",
    "Memes Making",
    "Designing",
    "Drawing",
    "Learn Something New"
  ],
  "Be Focused": [
    "Reading Books",
    "Work Time",
    "Deep Work Session",
    "Study Session",
    "No Phone Time"
  ],
  "Better Relationship": [
    "Call Family",
    "Meet Friends",
    "Quality Time",
    "Express Gratitude",
    "Help Someone"
  ],
  "Sleep Better": [
    "Sleep Before 11PM",
    "No Phone Before Sleep",
    "8 Hours Sleep",
    "Relax Music",
    "Night Routine"
  ]
};

export default function Habits() {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [customTitle, setCustomTitle] = useState("");
  const [habits, setHabits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await api.get("/habits");
    setHabits(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleTask = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter(t => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const saveSelected = async () => {
    for (let task of selectedTasks) {
      await api.post("/habits", {
        title: task,
        category: selectedCategory,
        priority: "Medium"
      });
    }
    setSelectedTasks([]);
    setSelectedCategory(null);
    load();
  };

  const addOrUpdateCustom = async () => {
    if (!customTitle) return;

    if (editingId) {
      await api.put(`/habits/${editingId}`, {
        title: customTitle,
        category: "Custom",
        priority: "Medium"
      });
      setEditingId(null);
    } else {
      await api.post("/habits", {
        title: customTitle,
        category: "Custom",
        priority: "Medium"
      });
    }

    setCustomTitle("");
    load();
  };

  const editHabit = (habit) => {
    setCustomTitle(habit.title);
    setEditingId(habit.id);
  };

  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`);
    load();
  };

  const filteredHabits = habits.filter(h =>
    h.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>

      <div className="p-6 space-y-10">

        {/* CATEGORY SECTION */}
        {!selectedCategory ? (
          <>
            <h2 className="text-2xl font-bold">
              Choose Your Target
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {Object.keys(categories).map(cat => (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  {cat}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-primary"
            >
              ← Back
            </button>

            <h2 className="text-xl font-semibold mt-4">
              {selectedCategory}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {categories[selectedCategory].map(task => (
                <div
                  key={task}
                  onClick={() => toggleTask(task)}
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedTasks.includes(task)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {task}
                </div>
              ))}
            </div>

            <button
              onClick={saveSelected}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-lg"
            >
              Save Selected
            </button>
          </>
        )}

        {/* CUSTOM HABIT SECTION */}
        <div>
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Custom Habit" : "Add Custom Habit"}
          </h3>

          <div className="flex gap-3 mt-4">
            <input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter custom habit"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={addOrUpdateCustom}
              className="bg-green-600 text-white px-4 rounded"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div>
          <input
            placeholder="Search saved habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* SAVED HABITS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Your Saved Habits
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredHabits.map(h => (
              <div
                key={h.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-200 border border-gray-100 dark:border-gray-700"
              >
                <span>
                  {h.title}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => editHabit(h)}
                    className="text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}