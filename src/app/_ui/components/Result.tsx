"use client";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { Button } from "@/app/_ui/components/Button";
import { authAPI } from "../utils/apiUtils";
import { useRouter } from "next/navigation";
import axios from "axios";

import confettiAnimation from "@/ui/assets/animations/confetti.json";
import { DonutChart } from "./DonutChart";
import { FaTrophy, FaChartLine, FaRedo } from "react-icons/fa"; // Removed FaHistory

interface QuizHistoryItem {
  quizId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}

interface ResultProps {
  results: {
    correctAnswers: number;
    wrongAnswers: number;
    secondsUsed: number;
  };
  totalQuestions: number;
  topic: string;
  testCode?: string;
}

export const Result = ({ results, totalQuestions, topic, testCode }: ResultProps) => {
  const { correctAnswers, wrongAnswers, secondsUsed } = results;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultSaved, setResultSaved] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (testCode) {
      fetchLeaderboard();
    }
  }, [testCode]);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/quiz/leaderboard/${testCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.leaderboard) {
        setLeaderboard(response.data.leaderboard);
        const userId = localStorage.getItem("userId");
        const userEntry = response.data.leaderboard.find(
          (entry: any) => entry.userId._id === userId
        );

        if (userEntry) {
          setUserRank(userEntry.rank);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    const saveQuizResult = async () => {
      try {
        await authAPI.saveQuizResult({
          topic,
          score: correctAnswers,
          totalQuestions,
          testCode,
          ...(userRank !== null && { rank: userRank }),
          totalParticipants: leaderboard.length
        });
        setResultSaved(true);
      } catch (err: any) {
        console.error("Failed to save quiz result:", err);
        setError("Failed to save your quiz result. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    saveQuizResult();
  }, [correctAnswers, totalQuestions, topic, resultSaved, testCode, userRank, leaderboard.length]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleViewReportCard = () => {
    router.push('/report-card');
  };

  return (
    <motion.div
      key={"result"}
      variants={{
        initial: {
          background: "#FF6A66",
          clipPath: "circle(0% at 50% 50%)",
        },
        animate: {
          background: "#FF6A66",
          clipPath: "circle(100% at 50% 50%)",
        },
      }}
      className="w-full h-full flex justify-center p-5 overflow-y-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col text-black font-bold text-[32px] text-center w-full max-w-4xl">
        <h1 className="font-bold text-2xl text-white mb-4">Daily Practice Paper Test Results</h1>

        {/* Current Result Box */}
        <div className="mt-4 flex-1 bg-white border border-brand-light-gray rounded-2xl flex flex-col items-center py-6 px-4 shadow-lg">
          <Lottie
            animationData={confettiAnimation}
            loop={false}
            autoplay={true}
            style={{ width: "120px", height: "120px" }}
          />
          <h3 className="text-brand-midnight text-2xl font-semibold leading-9 mt-2">
            Congratulations!
          </h3>
          <p className="text-brand-midnight text-lg font-normal mt-1">
            You scored
          </p>
          <span className="text-brand-midnight font-bold text-4xl mt-1">
            {`${correctAnswers}/${totalQuestions}`}
          </span>
          <p className="text-brand-midnight text-sm font-normal mt-1">
            correct answers
          </p>

          {/* Rank Display */}
          {testCode && userRank !== null && (
            <div className="mt-4 bg-blue-50 rounded-lg p-3 w-full max-w-xs">
              <div className="flex items-center justify-center space-x-2">
                <FaTrophy className="text-yellow-500 text-xl" />
                <p className="text-brand-midnight text-md font-medium">Your Rank</p>
              </div>
              <div className="flex items-center justify-center mt-1">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${userRank === 1
                  ? 'bg-yellow-100 text-yellow-800'
                  : userRank === 2
                    ? 'bg-gray-200 text-gray-800'
                    : userRank === 3
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                  #{userRank}
                </span>
                <span className="ml-2 text-brand-midnight text-sm">
                  out of {leaderboard.length} participants
                </span>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="flex flex-col md:flex-row items-center justify-center mt-4 space-y-4 md:space-y-0 md:space-x-6">
            <DonutChart
              className="w-28 h-28"
              total={60 * totalQuestions}
              used={secondsUsed}
              type={"time"}
              data={[
                {
                  label: "Time Used",
                  value: secondsUsed,
                  color: "#374CB7",
                },
                {
                  label: "Time Left",
                  value: 60 * totalQuestions - secondsUsed,
                  color: "#F0F0F0",
                },
              ]}
            />

            <DonutChart
              className="w-28 h-28"
              type={"questions"}
              total={totalQuestions}
              used={correctAnswers}
              data={[
                {
                  label: "Correct",
                  value: correctAnswers,
                  color: "#56C490",
                },
                {
                  label: "Wrong",
                  value: wrongAnswers,
                  color: "#FF6A66",
                },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col space-y-3 w-full max-w-sm mx-auto">
          <Button
            intent={"secondary"}
            size="medium"
            block
            onClick={handleViewReportCard}
            className="flex items-center justify-center"
          >
            <FaChartLine className="mr-2" />
            View Full Report Card
          </Button>

          <Button
            intent={"secondary"}
            size="medium"
            block
            onClick={handleRetry}
            className="flex items-center justify-center"
          >
            <FaRedo className="mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
};