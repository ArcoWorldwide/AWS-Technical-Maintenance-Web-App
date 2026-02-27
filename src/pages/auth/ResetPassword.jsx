import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired token.");
        return;
      }

      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full px-4 py-3 border rounded-lg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border rounded-lg text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3C498B] text-white py-3 rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;