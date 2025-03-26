"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReportCard } from "../_ui/components/ReportCard";
import { isAuthenticated } from "../_ui/utils/authUtils";
import { FaChartLine } from "react-icons/fa"; // Removed unused icons

export default function ReportCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 pt-16 pb-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <FaChartLine className="mr-2 text-blue-600" />
            Your Report Card
          </h1>
          <p className="text-gray-600">Track your progress and performance over time</p>
        </div>

        {/* Report Card Component */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ReportCard />
        </div>

        {/* Color-Coded Performance Lines */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Breakdown</h2>
          <div className="space-y-4">
            {/* Green Line (80-100) */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">80-100% (Excellent)</span>
            </div>

            {/* Orange Line (50-80) */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">50-80% (Good)</span>
            </div>

            {/* Yellow Line (30-50) */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">30-50% (Average)</span>
            </div>

            {/* Red Line (0-30) */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">0-30% (Needs Improvement)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}