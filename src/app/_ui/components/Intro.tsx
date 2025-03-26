import Image from "next/image";
import { CheckCircle } from "@/ui/icons/CheckCircle";
import { importantToKnow } from "@/ui/content/content";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface IntroProps {
  onGetStartedClick: () => void;
  onTestCodeSubmit: (testCode: string, testCodeInfo: TestCodeInfo) => void;
}

interface TestCodeInfo {
  subject: string;
  topic: string;
  chapter: string;
  difficulty: string;
}

export const Intro = ({ onGetStartedClick, onTestCodeSubmit }: IntroProps) => {
  const router = useRouter();
  const [testCode, setTestCode] = useState("");
  const [error, setError] = useState("");
  const [showTestCodeInput, setShowTestCodeInput] = useState(false);
  const [testCodeInfo, setTestCodeInfo] = useState<TestCodeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleTestCodeSubmit = async () => {
    if (!testCode.trim()) {
      setError("Please enter a test code");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        { testCode: testCode.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.testInfo) {
        const testInfo = {
          subject: response.data.testInfo.subject,
          topic: response.data.testInfo.topic,
          chapter: response.data.testInfo.chapter,
          difficulty: response.data.testInfo.difficulty
        };
        setTestCodeInfo(testInfo);
        onTestCodeSubmit(testCode.trim(), testInfo); // Pass testCodeInfo to parent
      } else {
        setError("Invalid test code. Please try again.");
      }
    } catch (error: any) {
      console.error("Error validating test code:", error);
      setError(error.response?.data?.error || "Invalid test code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 py-8 flex-1 w-full lg:max-w-4xl mx-auto flex flex-col overflow-hidden">
      <Image
        src="/doodles.svg"
        width={343}
        height={413}
        priority
        className="absolute -bottom-10 right-0 z-0 object-cover pointer-events-none w-[343px] h-[413px] lg:w-[500px] lg:h-[600px]"
        alt="Doodles Illustration"
      />
      <div className="w-full flex flex-col flex-1 items-center z-10">
        <h1 className="text-brand-light-blue font-bold text-[32px] sm:text-4xl">
          Daily Practice Paper (DPP)
        </h1>

        {!showTestCodeInput ? (
          <>
            <h3 className="text-gray-800 font-bold text-xl mt-6 sm:text-2xl self-center">
              Things to know before you start:
            </h3>

            <div className="flex flex-col items-start mt-5 sm:mt-10 space-y-5 w-full">
              {importantToKnow.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle />
                  <p className="text-sm text-brand-storm-dust font-normal sm:text-xl">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col items-center w-full">
              <button
                onClick={() => setShowTestCodeInput(true)}
                className="text-brand-light-blue underline text-sm sm:text-base mb-4"
              >
                Have a test code? Click here
              </button>
            </div>
          </>
        ) : (
          <div className="w-full max-w-md mt-10 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-black font-bold text-xl mb-4">
              Enter Your Test Code
            </h3>
            <input
              type="text"
              placeholder="Enter test code"
              className="w-full p-3 rounded-xl border border-brand-light-gray mb-2"
              value={testCode}
              onChange={(e) => {
                setTestCode(e.target.value.toUpperCase());
                setError("");
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            {testCodeInfo && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Test Information:</h4>
                <p><span className="font-medium">Subject:</span> {testCodeInfo.subject}</p>
                <p><span className="font-medium">Topic:</span> {testCodeInfo.topic}</p>
                <p><span className="font-medium">Chapter:</span> {testCodeInfo.chapter}</p>
                <p><span className="font-medium">Level:</span> {testCodeInfo.difficulty}</p>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button
                size="small"
                onClick={handleTestCodeSubmit}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Validating..." : "Apply Code"}
              </Button>
              <Button
                size="small"
                intent="secondary"
                onClick={() => {
                  setShowTestCodeInput(false);
                  setTestCode("");
                  setTestCodeInfo(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {!showTestCodeInput && (
        <Button
          className="w-full z-10"
          block
          size={"small"}
          onClick={onGetStartedClick}
        >
          Let&apos;s Get Started
        </Button>
      )}
    </div>
  );
};
export function SubjectSelect({
  onStartQuiz,
  activeTestCode,
  darkMode
}: {
  onStartQuiz: (subject: string, level: string, topic: string, chapter: string) => void;
  activeTestCode: string;
  darkMode: boolean;
}) {
  return (
    <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
      }`}>
      <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-blue-300' : 'text-blue-600'
        }`}>Select Your Subject</h2>
      {/* Rest of your subject selection UI */}
    </div>
  );
}