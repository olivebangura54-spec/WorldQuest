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

  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setIsSubmitted(true);
    const isCorrect = option === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ animation: 'scale-in 0.4s ease-out' }}>
      <div className="card-base p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className={question.isBoss ? "badge-red" : "badge-blue"}>
            {question.isBoss ? "⚔️ Boss Challenge" : "Knowledge Check"}
          </span>
          {isSubmitted && (
            <span className={`text-sm font-bold ${selectedOption === question.correctAnswer ? "text-emerald-400" : "text-rose-400"}`}>
              {selectedOption === question.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}
            </span>
          )}
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold mb-8 leading-relaxed text-gray-100">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = option === selectedOption;

            let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium relative overflow-hidden ";

            if (isSubmitted) {
              if (isCorrect) {
                optionClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
              } else if (isSelected) {
                optionClass += "border-rose-500/50 bg-rose-500/10 text-rose-300";
              } else {
                optionClass += "border-white/[0.04] text-gray-600 opacity-40";
              }
            } else {
              optionClass += "border-white/[0.06] bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/5 text-gray-300 cursor-pointer";
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={isSubmitted}
                className={optionClass}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isSubmitted && isCorrect
                      ? "bg-emerald-500 text-white"
                      : isSubmitted && isSelected
                        ? "bg-rose-500 text-white"
                        : isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-white/[0.06] text-gray-500"
                  }`}>
                    {isSubmitted && isCorrect ? "✓" : isSubmitted && isSelected ? "✗" : String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isSubmitted && question.explanation && (
          <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10" style={{ animation: 'slide-up 0.4s ease-out' }}>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">💡</span>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Did you know?</p>
                <p className="text-sm text-gray-400 leading-relaxed">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Auto-progression indicator */}
        {isSubmitted && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-1 w-20 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500/60 animate-[progress_2.5s_linear]" />
            </div>
            <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Next step</span>
          </div>
        )}
      </div>
    </div>
  );
}