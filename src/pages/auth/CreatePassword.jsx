import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// API base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get UID from URL: /createpassword?uid=abc123
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(true);

  // Fetch email from backend using UID
  useEffect(() => {
    if (!uid) {
      setFetchingEmail(false);
      return;
    }

    const fetchEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/get-email/${uid}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Invalid or expired link.");
        } else {
          setEmail(data.email);
        }
      } catch (err) {
        setError("Unable to verify link. Please try again.");
      } finally {
        setFetchingEmail(false);
      }
    };

    fetchEmail();
  }, [uid]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!password || !confirmPassword) {
      return setError("All fields are required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      // Call backend API to create password
      const response = await fetch(`${API_BASE_URL}/auth/create-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create password.");
        return;
      }

      // Success
      setSuccess("Password created successfully! Redirecting to login...");

      // Redirect to login after 2s
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while verifying UID
  if (fetchingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-sm">Verifying link...</p>
      </div>
    );
  }

  // If UID invalid
  if (!uid || error === "Invalid or expired link.") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-red-500 mb-4">
            This password setup link is invalid or expired.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#3C498B] text-white px-4 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Lock className="text-[#3C498B]" size={28} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Create Your Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Set your password to activate your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border bg-gray-50 rounded-lg text-sm"
              />
              <Mail size={18} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border rounded-lg text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 border rounded-lg text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold bg-[#3C498B] hover:bg-[#2A376B]"
          >
            {loading ? "Creating Password..." : "Create Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;