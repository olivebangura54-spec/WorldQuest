"use client";

import { useState, useEffect } from "react";

interface QuestionViewProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    isBoss?: boolean;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionView({ question, onAnswer }: QuestionViewProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    
    setSelectedOption(option);
    setIsSubmitted(true);
    const isCorrect = option === question.correctAnswer;
    
    // Delay to show feedback before moving on
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-8">
        <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${
          question.isBoss ? "bg-red-900/30 border-red-500 text-red-500" : "bg-blue-900/30 border-blue-500 text-blue-500"
        }`}>
          {question.isBoss ? "Boss Challenge" : "Knowledge Check"}
        </span>
        <div className="flex items-center space-x-2">
          {question.isBoss && <span className="text-2xl animate-pulse">💀</span>}
          {isSubmitted && (
            <span className={`text-sm font-bold animate-bounce ${selectedOption === question.correctAnswer ? "text-green-500" : "text-red-500"}`}>
              {selectedOption === question.correctAnswer ? "PERFECT!" : "KEEP GOING!"}
            </span>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-10 leading-snug">
        {question.question}
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {question.options.map((option) => {
          const isCorrect = option === question.correctAnswer;
          const isSelected = option === selectedOption;
          
          let buttonClass = "w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg relative overflow-hidden ";
          
          if (isSubmitted) {
            if (isCorrect) {
              buttonClass += "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
            } else if (isSelected) {
              buttonClass += "border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
            } else {
              buttonClass += "border-gray-800 text-gray-600 opacity-50";
            }
          } else {
            buttonClass += "border-gray-800 bg-gray-800/50 hover:border-blue-500/50 hover:bg-gray-800 group";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
              className={buttonClass}
            >
              <div className="flex items-center relative z-10">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 border transition-all ${
                  isSubmitted && isCorrect 
                    ? "border-green-500 bg-green-500 text-white" 
                    : isSubmitted && isSelected 
                      ? "border-red-500 bg-red-500 text-white" 
                      : isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-600 text-gray-400 group-hover:border-blue-400"
                }`}>
                  {isSubmitted && isCorrect ? "✓" : isSubmitted && isSelected ? "✗" : ""}
                </span>
                {option}
              </div>
              
              {/* Feedback Pulse */}
              {isSubmitted && isSelected && (
                <div className={`absolute inset-0 animate-ping opacity-10 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}></div>
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && question.explanation && (
        <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-start">
            <span className="text-xl mr-3">💡</span>
            <div>
              <p className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-1">Did you know?</p>
              <p className="text-gray-300 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Auto-progression indicator */}
      {isSubmitted && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[progress_2.5s_linear]"></div>
          </div>
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Next Step Loading...</span>
        </div>
      )}
    </div>
  );
}
