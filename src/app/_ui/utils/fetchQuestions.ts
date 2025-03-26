import axios from "axios";
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const fetchQuizQuestions = async (
  subject: string,
  level: string,
  topic: string,
  chapter: string
) => {
  try {
    // Get the authentication token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(
      "http://localhost:5000/api/quiz/generate",
      {
        subject,
        difficulty: level,
        topic,
        chapter,
        numQuestions: 10
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response.data);

    if (!response.data) {
      throw new Error("No response data received");
    }

    // Handle both direct questions array and test code response format
    const questions = response.data.questions || response.data;
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions received");
    }

    return questions;
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch questions");
  }
};
