"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "../_ui/utils/apiUtils";
import { FaEnvelope, FaUser, FaLock, FaArrowRight, FaSignInAlt, FaUserPlus, FaUserShield } from "react-icons/fa"; // Importing icons

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    console.log("Attempting signup with:", { email, username, password: "***" });

    try {
      const userData = {
        email,
        password,
        username: username || undefined, // Only send username if provided
        role: "student", // Explicitly set role as student
      };

      const response = await authAPI.register(userData);
      console.log("Signup successful");

      // Show success message and redirect to login page instead of storing token
      setError("");
      alert("Account created successfully! Please log in with your credentials.");
      router.push("/login");
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Registration failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Student Registration</h1>
        <p className="text-center text-gray-600 mb-4">Create a student account to take quizzes</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email Address*
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="username">
              Username (Optional)
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="If left empty, we'll use part of your email"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Password*
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Sign Up as Student
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4 space-y-2">
          <Link
            href="/login"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaSignInAlt className="mr-2" /> {/* Login icon */}
            <span>Already have an account? Log In</span>
          </Link>
          <Link
            href="/admin/signup"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaUserShield className="mr-2" /> {/* Admin registration icon */}
            <span>Are you an administrator? Admin Registration</span>
          </Link>
        </div>
      </div>
    </div>
  );
}