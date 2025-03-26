"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaHome, FaCog } from "react-icons/fa"; // Icons for better UI

export const AdminNavbar = () => {
  const [adminName, setAdminName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    const name = localStorage.getItem("adminName");

    if (token && name) {
      setIsLoggedIn(true);
      setAdminName(name);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    router.push("/admin/login");
  };

  // Only render the navbar if admin is logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-xl font-bold flex items-center">
          <FaHome className="mr-2 text-white" /> {/* Home icon */}
          <span>EduAI Admin</span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Settings Link */}
          <Link
            href="/admin/settings"
            className="flex items-center text-white hover:text-gray-200 transition-colors duration-200"
          >
            <FaCog className="mr-2" /> {/* Settings icon */}
            <span>Settings</span>
          </Link>

          {/* Welcome Message */}
          <div className="flex items-center space-x-2">
            <FaUser className="text-white" /> {/* User icon */}
            <span>Welcome, {adminName}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> {/* Logout icon */}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};