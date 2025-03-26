"use client";
import { motion } from "framer-motion";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const QuizProgress = ({
  currentQuestion,
  totalQuestions,
}: QuizProgressProps) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-brand-light-blue">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <motion.div
          style={{ width: `${progressPercentage}%` }}
          className="h-full bg-brand-light-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
