import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      await response.json();

      // Always show same message (security)
      setMessage(
        "If an account exists with this email, a reset link has been sent."
      );
    } catch (err) {
      setMessage(
        "If an account exists with this email, a reset link has been sent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute right-3 top-3 text-gray-400" size={18} />
          </div>

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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm text-gray-500 mt-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;