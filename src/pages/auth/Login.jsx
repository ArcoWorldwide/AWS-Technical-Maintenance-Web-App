import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants/permissions";

// API base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ROLES.ADMIN, // default for now
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save token in localStorage
      localStorage.setItem("token", data.token);

      // Set role in context
      loginAsRole(formData.role);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Sign in to your account
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            {/* Forgot Password Link */}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-[#3C498B] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3C498B] hover:bg-[#3c498bd9] text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;