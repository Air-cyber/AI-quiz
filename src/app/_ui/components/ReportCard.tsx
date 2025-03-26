"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { authAPI, quizAPI } from "../utils/apiUtils";
import { Button } from "./Button";
import {
  FiHome,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiAlertCircle,
  FiClock,
  FiBook,
  FiBookmark,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2
} from "react-icons/fi";

interface QuizHistoryItem {
  quizId: string;
  subject: string;
  topic?: string;
  score: number;
  totalQuestions: number;
  testCode?: string;
  rank?: number;
  totalParticipants?: number;
  date: string;
}

export const ReportCard = () => {
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicsBySubject, setTopicsBySubject] = useState<Record<string, string[]>>({});
  const [performanceStats, setPerformanceStats] = useState({
    improvement: 0,
    strongSubjects: [] as string[],
    weakSubjects: [] as string[],
    strongTopics: [] as string[],
    weakTopics: [] as string[]
  });
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchTopicsForSubject = async (subject: string) => {
    try {
      if (!subject || topicsBySubject[subject]) return;

      const topics = await quizAPI.getTopicsBySubject(subject);
      setTopicsBySubject(prev => ({
        ...prev,
        [subject]: topics
      }));
    } catch (error) {
      console.error(`Error fetching topics for ${subject}:`, error);
    }
  };

  const getTopicName = (subject: string, topicId: string) => {
    if (topicsBySubject[subject] && !isNaN(Number(topicId))) {
      const index = Number(topicId);
      return topicsBySubject[subject][index] || topicId;
    }
    return topicId;
  };

  const calculatePerformanceStats = (history: QuizHistoryItem[]) => {
    if (history.length === 0) return;

    let improvement = 0;
    if (history.length > 1) {
      const firstScore = (history[0].score / history[0].totalQuestions) * 100;
      const lastScore = (history[history.length - 1].score / history[history.length - 1].totalQuestions) * 100;
      improvement = Math.round(lastScore - firstScore);
    }

    const subjectPerformance: Record<string, { total: number; count: number }> = {};
    const topicPerformance: Record<string, { total: number; count: number }> = {};

    history.forEach(quiz => {
      const percentage = (quiz.score / quiz.totalQuestions) * 100;
      const subject = quiz.subject || quiz.topic || 'General';
      const topic = quiz.topic ? getTopicName(quiz.subject || '', quiz.topic) : 'General';

      if (!subjectPerformance[subject]) {
        subjectPerformance[subject] = { total: 0, count: 0 };
      }
      subjectPerformance[subject].total += percentage;
      subjectPerformance[subject].count++;

      if (topic) {
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { total: 0, count: 0 };
        }
        topicPerformance[topic].total += percentage;
        topicPerformance[topic].count++;
      }
    });

    const strongSubjects: string[] = [];
    const weakSubjects: string[] = [];
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];

    Object.entries(subjectPerformance).forEach(([subject, { total, count }]) => {
      const avgScore = total / count;
      if (avgScore >= 70) strongSubjects.push(subject);
      else if (avgScore <= 50) weakSubjects.push(subject);
    });

    Object.entries(topicPerformance).forEach(([topic, { total, count }]) => {
      const avgScore = total / count;
      if (avgScore >= 70) strongTopics.push(topic);
      else if (avgScore <= 50) weakTopics.push(topic);
    });

    setPerformanceStats({
      improvement,
      strongSubjects,
      weakSubjects,
      strongTopics,
      weakTopics
    });
  };

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const profile = await authAPI.getProfile();

        if (profile.quizHistory) {
          const sortedHistory = [...profile.quizHistory].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setQuizHistory(sortedHistory);
          calculatePerformanceStats(sortedHistory);

          const uniqueSubjects = Array.from(new Set(sortedHistory.map(quiz => quiz.subject || quiz.topic)));
          uniqueSubjects.forEach(subject => {
            if (subject) fetchTopicsForSubject(subject);
          });
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        setError("Failed to load quiz history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [router]);

  const calculateAverageScore = () => {
    if (quizHistory.length === 0) return 0;
    return Math.round(quizHistory.reduce((acc, quiz) => acc + (quiz.score / quiz.totalQuestions) * 100, 0) / quizHistory.length);
  };

  const handleBackToHome = () => router.push('/');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiBook className="text-blue-600" />
            Performance Report Card
          </h1>
          <p className="text-gray-600 mt-1">Detailed analysis of your quiz performance</p>
        </div>
        <Button intent="secondary" size="small" onClick={handleBackToHome} icon={<FiHome />}>
          Back to Home
        </Button>
      </div>

      {quizHistory.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
          <div className="flex flex-col items-center justify-center">
            <FiBookmark className="text-gray-400 text-4xl mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No Quiz History Found</h3>
            <p className="text-gray-500 mt-1">Take some quizzes to see your performance data here.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiBarChart2 className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">{calculateAverageScore()}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FiClock className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quizzes Taken</p>
                  <p className="text-2xl font-bold text-gray-800">{quizHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  {performanceStats.improvement >= 0 ? (
                    <FiTrendingUp className="text-purple-600 text-xl" />
                  ) : (
                    <FiTrendingDown className="text-purple-600 text-xl" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Performance Trend</p>
                  <p className={`text-2xl font-bold ${performanceStats.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {performanceStats.improvement >= 0 ? '+' : ''}{performanceStats.improvement}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz History Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        Date
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiBook className="text-gray-400" />
                        Subject
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiAward className="text-gray-400" />
                        Rank
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizHistory.map((quiz) => {
                    const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                    const rowClass = percentage >= 70
                      ? 'bg-green-50 hover:bg-green-100'
                      : percentage >= 50
                        ? 'bg-yellow-50 hover:bg-yellow-100'
                        : 'bg-red-50 hover:bg-red-100';

                    return (
                      <tr key={quiz.quizId} className={`${rowClass} transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(quiz.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {quiz.subject || quiz.topic || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {quiz.subject && quiz.topic ?
                              (isNaN(Number(quiz.topic)) ? quiz.topic : getTopicName(quiz.subject, quiz.topic))
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{quiz.score} / {quiz.totalQuestions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${percentage >= 70
                              ? 'bg-green-100 text-green-800'
                              : percentage >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {percentage >= 70 ? (
                              <FiCheckCircle className="mr-1" />
                            ) : percentage >= 50 ? (
                              <FiAlertCircle className="mr-1" />
                            ) : (
                              <FiXCircle className="mr-1" />
                            )}
                            {percentage}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {quiz.rank ? (
                            <div className="flex items-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${quiz.rank === 1
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : quiz.rank === 2
                                    ? 'bg-gray-200 text-gray-800'
                                    : quiz.rank === 3
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-blue-100 text-blue-800'
                                }`}>
                                {quiz.rank}
                              </span>
                              {quiz.totalParticipants && (
                                <span className="ml-2 text-xs text-gray-500">
                                  /{quiz.totalParticipants}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Strong Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-green-600" />
                Your Strong Areas
              </h3>

              {performanceStats.strongSubjects.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">SUBJECTS</h4>
                  <div className="space-y-3">
                    {performanceStats.strongSubjects.map(subject => (
                      <div key={subject} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {performanceStats.strongTopics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">TOPICS</h4>
                  <div className="space-y-3">
                    {performanceStats.strongTopics.slice(0, 5).map(topic => (
                      <div key={topic} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {performanceStats.strongSubjects.length === 0 && performanceStats.strongTopics.length === 0 && (
                <p className="text-gray-500 text-sm">No strong areas identified yet.</p>
              )}
            </div>

            {/* Weak Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-red-600" />
                Areas Needing Improvement
              </h3>

              {performanceStats.weakSubjects.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">SUBJECTS</h4>
                  <div className="space-y-3">
                    {performanceStats.weakSubjects.map(subject => (
                      <div key={subject} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">{subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {performanceStats.weakTopics.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">TOPICS</h4>
                  <div className="space-y-3">
                    {performanceStats.weakTopics.slice(0, 5).map(topic => (
                      <div key={topic} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {performanceStats.weakSubjects.length === 0 && performanceStats.weakTopics.length === 0 && (
                <p className="text-gray-500 text-sm">No weak areas identified.</p>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};