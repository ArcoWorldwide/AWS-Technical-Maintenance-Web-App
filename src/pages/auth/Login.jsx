import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants/permissions";

const Login = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ROLES.ADMIN, // default for now
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginAsRole(formData.role);

    navigate("/dashboard");
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
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#3C498B] hover:bg-[#3c498bd9] text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
