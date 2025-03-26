"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa"; // Icons for better UI

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Store admin token and info
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminName", response.data.admin.name);
        localStorage.setItem("adminEmail", response.data.admin.email);
        localStorage.setItem("adminRole", response.data.admin.role);

        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">Login to manage quizzes and view results</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Email icon */}
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> {/* Password icon */}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaSignInAlt className="text-white" /> {/* Login icon */}
                  <span>Sign in</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-4">
          <Link
            href="/admin/signup"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaUserPlus className="mr-2" /> {/* Sign up icon */}
            <span>Don&apos;t have an admin account? Sign up</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaUser className="mr-2" /> {/* Student login icon */}
            <span>Login as Student</span>
          </Link>
        </div>
      </div>
    </div>
  );
}