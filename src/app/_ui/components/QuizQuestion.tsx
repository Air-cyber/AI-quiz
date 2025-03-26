"use client";
import { motion } from "framer-motion";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answer: string) => void;
}

export const QuizQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuizQuestionProps) => {
  const handleOptionClick = (option: string) => {
    onAnswerSelect(question.id, option);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === option
                ? "border-brand-light-blue bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleOptionClick(option)}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selectedAnswer === option
                    ? "border-brand-light-blue"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswer === option && (
                  <div className="w-3 h-3 rounded-full bg-brand-light-blue" />
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
