import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fetchQuizQuestions } from "../utils/fetchQuestions";
import { Button } from "@/ui/components/Button";
import { OptionList } from "./OptionList";
import { formatTime } from "../utils/formatTime";
import { useRouter } from "next/navigation";
import { Result } from "./Result";
import { authAPI } from "../utils/apiUtils";
import { playCorrectAnswer, playWrongAnswer, playQuizEnd } from "../utils/playSound";
import axios from "axios";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  selectedSubject: string;
  selectedTopic: string;
  selectedLevel: string;
  testCode?: string;
  chapter: string;
  onComplete: (score: number) => void;
}

const TIME_LIMIT = 60; // 1 minute per question

export const Quiz = ({
  selectedSubject,
  selectedLevel,
  selectedTopic,
  testCode = "",
  chapter,
  onComplete,

}: QuizProps) => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [timePassed, setTimePassed] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [results, setResults] = useState({
    correctAnswers: 0,
    wrongAnswers: 0,
    secondsUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load questions from localStorage
  useEffect(() => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    if (storedQuestions && testCode) {
      setQuizQuestions(JSON.parse(storedQuestions));
      localStorage.removeItem("quizQuestions"); // Clear after loading
      setLoading(false);
    } else {
      fetchQuestions();
    }
  }, [selectedSubject, selectedLevel, selectedTopic, testCode, chapter]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        {
          subject: selectedSubject,
          difficulty: selectedLevel,
          topic: selectedTopic,
          chapter: chapter,
          testCode: testCode || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (testCode && response.data && response.data.questions) {
        setQuizQuestions(response.data.questions);
      } else if (response.data) {
        setQuizQuestions(response.data);
      } else {
        setError("Failed to load questions. Please try again.");
      }
    } catch (error: any) {
      console.error("Error fetching questions:", error);
      setError(
        error.response?.data?.error || "Failed to load questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const setupTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimePassed((prevTimePassed) => {
        const newTimePassed = prevTimePassed + 1;
        if (newTimePassed >= TIME_LIMIT) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return TIME_LIMIT;
        }
        return newTimePassed;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (selectedAnswerIndex === -1) {
      setResults((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }
    handleNextQuestion();
  };

  useEffect(() => {
    if (quizFinished) return;
    setupTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizFinished, activeQuestion]);

  useEffect(() => {
    if (quizFinished || timePassed <= TIME_LIMIT) return;
    if (selectedAnswerIndex === -1) {
      setResults((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }
    handleNextQuestion();
    setTimePassed(0);
  }, [timePassed]);

  const handleNextQuestion = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswerIndex(-1);
    if (activeQuestion + 1 < quizQuestions.length) {
      setActiveQuestion((prev) => prev + 1);
      setTimePassed(0);
      setupTimer();
    } else {
      playQuizEnd();
      const saveResult = async () => {
        try {
          const totalTimeTaken = results.secondsUsed + timePassed;
          await authAPI.saveQuizResult({
            subject: selectedSubject,
            topic: selectedTopic,
            score: results.correctAnswers,
            totalQuestions: quizQuestions.length,
            testCode: testCode || undefined,
            timeTaken: totalTimeTaken,
          });
          console.log("Quiz result saved successfully");
        } catch (error: any) {
          console.error("Failed to save quiz result:", error.response?.data || error);
        } finally {
          setQuizFinished(true);
        }
      };
      saveResult();
    }
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswerIndex(answerIndex);
    const correctAnswer = quizQuestions[activeQuestion]?.correctAnswer;
    const selectedAnswer = quizQuestions[activeQuestion]?.options[answerIndex];

    if (correctAnswer === selectedAnswer) {
      playCorrectAnswer();
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        correctAnswers: prev.correctAnswers + 1,
      }));
      setIsCorrectAnswer(true);
    } else {
      playWrongAnswer();
      setResults((prev) => ({
        ...prev,
        secondsUsed: prev.secondsUsed + timePassed,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
      setIsCorrectAnswer(false);
    }

    // Automatically move to the next question after 1 second
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light-blue mx-auto"></div>
          <p className="mt-4 text-brand-light-blue">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <Result
        results={results}
        totalQuestions={quizQuestions.length}
        topic={selectedSubject}
        testCode={testCode}
        subject={selectedSubject} // Add this line
      />
    );
  }

  if (quizQuestions.length === 0 || !quizQuestions[activeQuestion]) {
    return <p>Loading questions...</p>;
  }

  const { question, options } = quizQuestions[activeQuestion];

  return (
    <div className="w-full h-screen flex flex-col p-5 bg-brand-background">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-brand-primary font-bold text-2xl">
              {selectedSubject} Quiz
            </h1>
            <p className="text-brand-neutral-dark mt-1 text-sm">
              {selectedTopic} - {chapter} ({selectedLevel})
            </p>
          </div>
          <div className="text-right">
            <p className="text-brand-neutral-dark text-sm">Time Left:</p>
            <p className="text-brand-primary font-bold text-lg">
              {formatTime(TIME_LIMIT - timePassed)}
            </p>
          </div>
        </div>

        <motion.div
          key={"countdown"}
          variants={{
            initial: { background: "#FF6A66", clipPath: "circle(0% at 50% 50%)" },
            animate: { background: "#ffffff", clipPath: "circle(100% at 50% 50%)" },
          }}
          className="w-full h-full flex justify-center p-4"
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col text-black font-bold text-[28px] text-center w-full">
            <h1 className="font-bold text-sm text-brand-light-blue">
              Daily Practice Paper Test
            </h1>

            <div className="mt-4 rounded-2xl border border-brand-light-gray px-5 py-3 w-full mb-1">
              <h3 className="text-black font-medium text-xs">
                Question {activeQuestion + 1} / {quizQuestions.length}
              </h3>
              <h4 className="text-brand-midnight font-medium text-sm mt-2">
                {question}
              </h4>
            </div>
            <div className="flex justify-center items-center w-full mt-2">
              <span className="text-brand-mountain-mist text-xs font-normal">
                {formatTime(timePassed)}
              </span>
              <div className="relative flex-1 h-3 bg-[#F0F0F0] mx-1 rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-brand-light-blue rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(timePassed / TIME_LIMIT) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-brand-mountain-mist text-xs font-normal">
                {formatTime(TIME_LIMIT)}
              </span>
            </div>

            <OptionList
              activeQuestion={quizQuestions[activeQuestion]}
              options={options}
              selectedAnswerIndex={selectedAnswerIndex}
              onAnswerSelected={handleSelectAnswer}
              isCorrectAnswer={isCorrectAnswer}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};