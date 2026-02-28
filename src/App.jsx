import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Reports from "./pages/Reports";
import Streak from "./pages/Streak";
import Me from "./pages/Me";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/streak" element={<Streak />} />
            <Route path="/me" element={<Me />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}