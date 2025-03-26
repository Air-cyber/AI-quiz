"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "../utils/authUtils";
import {
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaSignInAlt,
  FaUserPlus,
  FaSun,
  FaMoon
} from "react-icons/fa";

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side - QuizMaster and Dark Mode */}
        <div className="flex items-center space-x-4">
          {/* Logo and App Name */}
          <Link href="/" className="text-xl font-bold flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span className="text-2xl">🎯</span>
            <span className="text-white dark:text-white">QuizMaster</span>
          </Link>

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-blue-500 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <FaSun className="text-yellow-300 text-xl" />
            ) : (
              <FaMoon className="text-white text-xl" />
            )}
          </button>
        </div>

        {/* Right side - User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-white dark:text-gray-100">{user.username}</span>
                  {user.email && (
                    <span className="text-xs text-blue-200 dark:text-gray-300 truncate max-w-[120px]">
                      {user.email}
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center dark:bg-gray-700">
                  <FaUser className="text-white dark:text-gray-100" />
                </div>
              </div>

              {/* Report Card Link */}
              <Link
                href="/report-card"
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                <FaChartLine className="text-blue-600 dark:text-gray-100" />
                <span className="text-blue-600 dark:text-gray-100">Report Card</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                <FaSignOutAlt className="text-blue-600 dark:text-gray-100" />
                <span className="text-blue-600 dark:text-gray-100">Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href="/login"
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                <FaSignInAlt className="text-blue-600 dark:text-gray-100" />
                <span className="text-blue-600 dark:text-gray-100">Login</span>
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-all duration-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                <FaUserPlus className="text-white dark:text-gray-100" />
                <span className="text-white dark:text-gray-100">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};