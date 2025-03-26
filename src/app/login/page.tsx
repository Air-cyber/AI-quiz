"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "../_ui/utils/apiUtils";
import { FaEnvelope, FaUser, FaLock, FaSignInAlt, FaUserPlus, FaUserShield } from "react-icons/fa"; // Icons for better UI

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Attempting login with:", { identifier });

    try {
      const response = await authAPI.login({ identifier, password });
      console.log("Login successful");

      // Store token and user info in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.username);
      localStorage.setItem("userId", response.userId);
      if (response.email) {
        localStorage.setItem("email", response.email);
      }

      // Redirect to home page
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Student Login</h1>
        <p className="text-center text-gray-600 mb-6">Login to take quizzes and view your results</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="identifier">
              Email or Username
            </label>
            <div className="relative">
              <input
                id="identifier"
                type="text"
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="your.email@example.com or username"
              />
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Email/Username icon */}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Password icon */}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaSignInAlt className="text-white" /> {/* Login icon */}
                  <span>Log In as Student</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-2">
          <Link
            href="/signup"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaUserPlus className="mr-2" /> {/* Sign up icon */}
            <span>Don&apos;t have an account? Sign up</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaUserShield className="mr-2" /> {/* Admin login icon */}
            <span>Login as Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}