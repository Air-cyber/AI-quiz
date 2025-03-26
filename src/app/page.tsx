"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Countdown } from "@/ui/components/Countdown";
import { Intro } from "@/ui/components/Intro";
import { Quiz } from "@/ui/components/Quiz";
import { SubjectSelect } from "@/ui/components/SubjectSelect";
import { authAPI } from "./_ui/utils/apiUtils";
import axios from "axios";
import { Results } from "./_ui/components/Results";

type QuizStep = "intro" | "subject-select" | "quiz" | "results";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<QuizStep>("intro");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [testCode, setTestCode] = useState<string>("");
  const [score, setScore] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const checkAuth = async () => {
      try {
        await authAPI.getProfile();
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

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

  const handleGetStarted = () => {
    setCurrentStep("subject-select");
  };

  const handleTestCodeSubmit = async (code: string) => {
    setTestCode(code);
    setCurrentStep("subject-select");
  };

  const handleStartQuiz = (subject: string, level: string, topic: string, chapter: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setSelectedChapter(chapter);
    setSelectedLevel(level);
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("intro");
    setSelectedSubject("");
    setSelectedTopic("");
    setSelectedChapter("");
    setSelectedLevel("");
    setTestCode("");
    setScore(0);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-brand-background dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <AnimatePresence mode="wait">
          {currentStep === "intro" && (
            <Intro
              onGetStartedClick={handleGetStarted}
              onTestCodeSubmit={handleTestCodeSubmit}
              darkMode={darkMode}
            />
          )}

          {currentStep === "subject-select" && (
            <SubjectSelect
              onStartQuiz={handleStartQuiz}
              activeTestCode={testCode}
              darkMode={darkMode}
            />
          )}

          {currentStep === "quiz" && (
            <Quiz
              selectedSubject={selectedSubject}
              selectedTopic={selectedTopic}
              selectedLevel={selectedLevel}
              chapter={selectedChapter}
              testCode={testCode}
              onComplete={handleQuizComplete}
              darkMode={darkMode}
            />
          )}

          {currentStep === "results" && (
            <Results
              score={score}
              totalQuestions={10}
              onRestart={handleRestart}
              subject={selectedSubject}
              topic={selectedTopic}
              chapter={selectedChapter}
              level={selectedLevel}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}