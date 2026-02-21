import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const CreatePassword = () => {
  const [email, setEmail] = useState(""); // Comes from server
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingEmail, setFetchingEmail] = useState(true);

  // Simulate fetching email from server (e.g. token-based link)
  useEffect(() => {
    setTimeout(() => {
      // This would normally come from backend API
      const serverEmail = "user@arcoworldwide.ng";
      setEmail(serverEmail);
      setFetchingEmail(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Password created successfully!");
      // redirect to dashboard here
      // navigate("/dashboard");
    }, 1500);
  };

  if (fetchingEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-sm">Loading account information...</p>
      </div>
    );
  }

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
            Your account has been created by the admin.
            Please set your password to activate it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border bg-gray-50 rounded-lg text-sm cursor-not-allowed"
              />
              <Mail
                size={18}
                className="absolute right-3 top-3 text-gray-400"
              />
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3C498B] focus:outline-none text-sm"
                placeholder="Enter password"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3C498B] focus:outline-none text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
              loading
                ? "bg-[#3C498B] cursor-not-allowed"
                : "bg-[#3C498B] hover:bg-[#2A376B]"
            }`}
          >
            {loading ? "Creating Password..." : "Create Password"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          ArcoWorldWide Maintenance Management System
        </p>
      </div>
    </div>
  );
};

export default CreatePassword;
