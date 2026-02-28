import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data);
      navigate("/dashboard");

    } catch (err) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-background">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Welcome Back 👋
        </h2>

        <div className="space-y-4">

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-400"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-400"
          />

          <button
            onClick={submit}
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-dark transition duration-200"
          >
            Login
          </button>

        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}