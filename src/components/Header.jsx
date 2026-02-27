import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {

  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        Habit Tracker
      </h1>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6 text-gray-600 font-medium">
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/habits" className="hover:text-blue-600">
          Habits
        </Link>
        <Link to="/reports" className="hover:text-blue-600">
          Reports
        </Link>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">

        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          {user?.name || "Profile"}
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-4">

            <p className="text-sm text-gray-500 mb-2">
              Logged in as
            </p>

            <p className="font-semibold text-gray-800 mb-3">
              {user?.email}
            </p>

            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              <Link
            to="/"
            className="text-white font-semibold hover:underline"
          >
            Logout
          </Link>
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}