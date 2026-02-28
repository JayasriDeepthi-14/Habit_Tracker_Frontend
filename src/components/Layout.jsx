import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Habits", path: "/habits" },
    { name: "Reports", path: "/reports" },
    { name: "Streak", path: "/streak" },
    { name: "Me", path: "/me" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">
            Habit Tracker
          </h1>
        </div>

        <nav className="flex flex-col gap-4 p-6">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`text-left ${
                location.pathname === item.path
                  ? "text-primary font-bold"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div>

        {/* Topbar */}
        <div className="flex justify-between items-center p-4 bg-white shadow-md">

          {/* Hamburger ALWAYS visible */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <h2 className="font-semibold">
            Welcome, {user?.name}
          </h2>

        </div>

        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}