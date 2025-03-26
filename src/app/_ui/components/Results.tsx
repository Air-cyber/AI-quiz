import { Button } from "./Button";
import { motion } from "framer-motion";

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  subject: string;
  topic: string;
  chapter: string;
  level: string;
}

export const Results = ({
  score,
  totalQuestions,
  onRestart,
  subject,
  topic,
  chapter,
  level,
}: ResultsProps) => {
  const percentage = (score / totalQuestions) * 100;
  const isPass = percentage >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex flex-col items-center justify-center p-5 bg-brand-background rounded-2xl shadow-soft"
    >
      <div className="text-center">
        <h1 className="text-brand-primary font-bold text-3xl mb-6">
          Quiz Results
        </h1>

        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isPass ? "#4CAF50" : "#FF6B6B"}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-2xl font-bold">{percentage}%</div>
              <div className="text-sm text-brand-neutral-dark">
                {score}/{totalQuestions}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Subject:</span> {subject}</p>
            <p><span className="font-medium">Topic:</span> {topic}</p>
            <p><span className="font-medium">Chapter:</span> {chapter}</p>
            <p><span className="font-medium">Level:</span> {level}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            {isPass ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
          </h2>
          <p className="text-brand-neutral-dark">
            {isPass
              ? "You've successfully completed the quiz with a passing score!"
              : "Don't worry, you can always try again to improve your score."}
          </p>
        </div>

        <Button
          onClick={onRestart}
          className="w-full"
          size="large"
        >
          Start New Quiz
        </Button>
      </div>
    </motion.div>
  );
}; 