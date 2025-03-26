export const fetchSocialStudiesQuestions = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "social studies",
        difficulty: "medium", // You can make this dynamic
      }),
    });

    const data = await response.json();
    return data.questions; // Ensure your backend returns questions in this format
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
