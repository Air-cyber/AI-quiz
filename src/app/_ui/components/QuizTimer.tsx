"use client";
import { useState, useEffect } from "react";

interface QuizTimerProps {
  onTimeUpdate: (seconds: number) => void;
}

export const QuizTimer = ({ onTimeUpdate }: QuizTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        onTimeUpdate(newSeconds);
        return newSeconds;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onTimeUpdate]);
  
  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  return (
    <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
      Time: {formatTime()}
    </div>
  );
};
