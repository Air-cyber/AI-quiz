import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quizAPI } from '../utils/apiUtils';
import { Button } from './Button';

interface LeaderboardProps {
  testCode: string;
  onClose?: () => void;
}

interface LeaderboardEntry {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  score: number;
  totalQuestions: number;
  timeTaken: number;
  rank: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ testCode, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testInfo, setTestInfo] = useState<{ subject: string; topic: string } | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await quizAPI.getLeaderboard(testCode);
        setLeaderboardData(response.scores || []);
        setTestInfo(response.testInfo || null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };

    if (testCode) {
      fetchLeaderboard();
    }
  }, [testCode]);

  // Format time (seconds) to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
          {testInfo && (
            <p className="text-sm text-gray-600">
              {testInfo.subject} - {testInfo.topic} (Test Code: {testCode})
            </p>
          )}
        </div>
        {onClose && (
          <Button intent="secondary" size="small" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600">No data available for this test code.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Taken
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${entry.rank === 1
                        ? 'bg-yellow-100 text-yellow-800'
                        : entry.rank === 2
                          ? 'bg-gray-200 text-gray-800'
                          : entry.rank === 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.userId.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.userId.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.score} / {entry.totalQuestions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(entry.score / entry.totalQuestions) >= 0.7
                      ? 'bg-green-100 text-green-800'
                      : (entry.score / entry.totalQuestions) >= 0.4
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {Math.round((entry.score / entry.totalQuestions) * 100)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTime(entry.timeTaken)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Leaderboard;
