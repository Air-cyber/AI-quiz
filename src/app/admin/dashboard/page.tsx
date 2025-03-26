"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaCopy, FaChartLine, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Icons for better UI

// Define subjects and topics
const subjects = {
  Mathematics: {
    "Arithematic": ["Basic Operations", "Fractions", "Decimals", "Percentages"],
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
type Topic = keyof typeof subjects[Subject];
type Chapter = typeof subjects[Subject][Topic][number];

interface TestCode {
  _id: string;
  testCode: string;
  subject: string;
  topic: string;
  chapter: string;
  difficulty: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [subject, setSubject] = useState<Subject | "">("");
  const [topic, setTopic] = useState<Topic | "">("");
  const [chapter, setChapter] = useState<Chapter | "">("");
  const [difficulty, setDifficulty] = useState("easy");
  const [testCodes, setTestCodes] = useState<TestCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setAdminName(localStorage.getItem("adminName") || "Admin");
    setAdminEmail(localStorage.getItem("adminEmail") || "");

    // Fetch test codes
    fetchTestCodes();
  }, []);

  // Reset topic and chapter when subject changes
  useEffect(() => {
    setTopic("");
    setChapter("");
  }, [subject]);

  // Reset chapter when topic changes
  useEffect(() => {
    setChapter("");
  }, [topic]);

  const fetchTestCodes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/api/admin/test-codes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTestCodes(response.data);
    } catch (error) {
      console.error("Error fetching test codes:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    router.push("/admin/login");
  };

  const handleGenerateTestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject || !topic || !chapter || !difficulty) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "http://localhost:5000/api/admin/generate-test-code",
        { subject, topic, chapter, difficulty },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(`Test code generated successfully: ${response.data.testCode.testCode}`);

      // Refresh test codes list
      fetchTestCodes();

      // Reset form
      setSubject("");
      setTopic("");
      setChapter("");
      setDifficulty("easy");
    } catch (error: any) {
      console.error("Error generating test code:", error);
      setError(error.response?.data?.error || "Failed to generate test code");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Test code copied to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const viewLeaderboard = (testCode: string) => {
    router.push(`/admin/leaderboard/${testCode}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">EduAI Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-white text-2xl" />
                <span className="text-white font-medium">{adminName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Generate Test Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Test Code</h2>

          <form onSubmit={handleGenerateTestCode} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a subject</option>
                  {Object.keys(subjects).map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as Topic)}
                  disabled={!subject}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!subject ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  required
                >
                  <option value="">Select a topic</option>
                  {subject && Object.keys(subjects[subject]).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                <select
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value as Chapter)}
                  disabled={!topic}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!topic ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  required
                >
                  <option value="">Select a chapter</option>
                  {topic && subject && subjects[subject] && (subjects[subject][topic] as readonly string[]).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                <p>{success}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              {loading ? "Generating..." : "Generate Test Code"}
            </button>
          </form>
        </div>

        {/* Test Codes Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Test Codes</h2>

          {testCodes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No test codes generated yet. Create your first one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testCodes.map((testCode) => (
                    <tr key={testCode._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {testCode.testCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {testCode.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {testCode.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${testCode.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : testCode.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {testCode.difficulty.charAt(0).toUpperCase() + testCode.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(testCode.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => copyToClipboard(testCode.testCode)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            title="Copy test code"
                          >
                            <FaCopy className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => viewLeaderboard(testCode.testCode)}
                            className="text-green-600 hover:text-green-800 transition-colors duration-200"
                            title="View leaderboard"
                          >
                            <FaChartLine className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}