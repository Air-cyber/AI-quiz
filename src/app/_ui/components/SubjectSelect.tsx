"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { fetchQuizQuestions } from "../utils/fetchQuestions";
import axios from "axios";

const subjects = {
  Mathematics: {
    "Arithmetic": ["Basic Operations", "Fractions", "Decimals", "Percentages"],
    "Geometry": ["Lines & Angles", "Triangles", "Circles", "Polygons"],
    "Calculus": ["Limits", "Derivatives", "Integrals", "Applications"]
  },
  Science: {
    "Physics": ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics"],
    "Chemistry": ["Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Acids & Bases"],
    "Biology": ["Cell Biology", "Genetics", "Ecology", "Human Physiology"]
  },
  History: {
    "Ancient": ["Mesopotamia", "Egypt", "Greece", "Rome"],
    "Medieval": ["Byzantine Empire", "Islamic World", "European Feudalism", "Crusades"],
    "Modern": ["Renaissance", "Industrial Revolution", "World Wars", "Cold War"]
  },
  "General Knowledge": {
    "Sports": ["Olympics", "Football", "Cricket", "Basketball"],
    "Politics": ["Governance", "Elections", "International Relations", "Political Ideologies"],
    "Culture": ["Art", "Music", "Literature", "Festivals"]
  },
  "Machine Learning": {
    "Supervised Learning": ["Regression", "Classification", "Decision Trees", "Support Vector Machines"],
    "Unsupervised Learning": ["Clustering", "Dimensionality Reduction", "Anomaly Detection", "Association Rules"],
    "Deep Learning": ["Neural Networks", "CNNs", "RNNs", "Transformers"]
  }
} as const;

type Subject = keyof typeof subjects;
type Topic<S extends Subject = Subject> = keyof typeof subjects[S];
type Chapter<S extends Subject = Subject, T extends Topic<S> = Topic<S>> = typeof subjects[S][T][number];

const levels = ["Easy", "Medium", "Hard"] as const;
type Level = typeof levels[number];

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Type guard functions
function isSubject(value: any): value is Subject {
  return value in subjects;
}

function isLevel(value: any): value is Level {
  return levels.includes(value);
}

function isTopic<S extends Subject>(value: any, subject: S): value is Topic<S> {
  return value in subjects[subject];
}

function isChapter<S extends Subject, T extends Topic<S>>(value: any, subject: S, topic: T): value is Chapter<S, T> {
  const chapters = subjects[subject][topic] as readonly string[];
  return chapters.includes(value);
}

interface SubjectSelectProps {
  onStartQuiz: <S extends Subject, L extends Level, T extends Topic<S>, C extends Chapter<S, T>>(
    subject: S,
    level: L,
    topic: T,
    chapter: C
  ) => void;
  activeTestCode?: string;
}

export const SubjectSelect = ({
  onStartQuiz,
  activeTestCode
}: SubjectSelectProps) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | "">("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<Level | "">("");
  const [loading, setLoading] = useState(false);
  const [isTestCodeActive, setIsTestCodeActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchTestInfoAndStartQuiz = useCallback(async () => {
    if (!activeTestCode) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        { testCode: activeTestCode },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.testInfo) {
        const { subject, topic, chapter, difficulty } = response.data.testInfo;

        if (!isSubject(subject) || !isLevel(difficulty) ||
          !isTopic(topic, subject) || !isChapter(chapter, subject, topic)) {
          throw new Error("Invalid test data received from server");
        }

        const quizQuestions = await fetchQuizQuestions(
          subject,
          difficulty,
          topic,
          chapter
        );

        if (!quizQuestions || quizQuestions.length === 0) {
          throw new Error("No questions received from the server");
        }

        localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));
        onStartQuiz(subject, difficulty, topic, chapter);
      }
    } catch (error) {
      console.error("Error fetching test info:", error);
      setIsTestCodeActive(false);
    } finally {
      setLoading(false);
    }
  }, [activeTestCode, onStartQuiz]);

  useEffect(() => {
    fetchTestInfoAndStartQuiz();
  }, [fetchTestInfoAndStartQuiz]);

  useEffect(() => {
    setSelectedTopic("");
    setSelectedChapter("");
  }, [selectedSubject]);

  useEffect(() => {
    setSelectedChapter("");
  }, [selectedTopic]);

  const handleContinue = async () => {
    if (!selectedSubject || !selectedLevel || !selectedTopic || !selectedChapter) return;
    setLoading(true);

    try {
      if (!isSubject(selectedSubject) || !isLevel(selectedLevel) ||
        !isTopic(selectedTopic, selectedSubject) || !isChapter(selectedChapter, selectedSubject, selectedTopic)) {
        throw new Error("Invalid selection");
      }

      const quizQuestions = await fetchQuizQuestions(
        selectedSubject,
        selectedLevel,
        selectedTopic,
        selectedChapter
      );

      if (!quizQuestions || quizQuestions.length === 0) {
        throw new Error("No questions received from the server");
      }

      localStorage.setItem("quizQuestions", JSON.stringify(quizQuestions));
      onStartQuiz(selectedSubject, selectedLevel, selectedTopic, selectedChapter);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeTestCode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-brand-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-brand-neutral-dark">Preparing Your Quiz...</h2>
          <p className="text-brand-neutral">Please wait while we load your test</p>
        </div>
      </div>
    );
  }

  if (!activeTestCode) {
    return (
      <motion.div
        key="subject-select"
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
        }}
        className="w-full h-full flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-soft"
        initial="initial"
        animate="animate"
        exit="initial"
      >
        {/* ... rest of your JSX remains the same ... */}
      </motion.div>
    );
  }

  return null;
};