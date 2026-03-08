import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {

  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Habits", path: "/habits", icon: "📝" },
    { name: "Reports", path: "/reports", icon: "📈" },
    { name: "Streak", path: "/streak", icon: "🔥" },
    { name: "Profile", path: "/profile", icon: "👤" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16 md:w-20" : "w-56 md:w-64"}
        bg-white shadow-md transition-all duration-300 flex flex-col`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5">

          {!collapsed && (
            <h1 className="text-lg md:text-xl font-bold text-primary">
              Habit Tracker
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 text-lg"
          >
            {collapsed ? ">" : "<"}
          </button>

        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 px-2 md:px-4 mt-4">

          {menu.map((item) => (

            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >

              <span className="text-lg">{item.icon}</span>

              {!collapsed && <span>{item.name}</span>}

            </button>

          ))}

        </nav>

        {/* Logout */}
        <div className="mt-auto p-3 md:p-4">

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-500 text-white p-3 rounded-lg w-full justify-center"
          >

            <span className="text-lg">⏻</span>

            {!collapsed && "Logout"}

          </button>

        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="flex justify-end items-center p-4 bg-white shadow-md shrink-0">

          <h2 className="font-semibold text-sm md:text-base">
            Welcome, {user?.name}
          </h2>

        </div>

        {/* Scrollable Page */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 w-full">
          <Outlet />
        </div>

      </div>

    </div>
  );
}