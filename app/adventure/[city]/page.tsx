"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChapter, CHAPTERS, type Chapter, type QuizQuestion } from "@/data/chapters";

interface PlayerProgress {
  completedChapters: string[];
  currentChapter: string;
  totalXP: number;
  totalGold: number;
  stamps: string[];
  totalDistanceTraveled: number;
}

export default function CityHubPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.city as string;
  const chapter = getChapter(cityId);

  const [progress, setProgress] = useState<PlayerProgress>({
    completedChapters: [],
    currentChapter: "sahara",
    totalXP: 0,
    totalGold: 150,
    stamps: [],
    totalDistanceTraveled: 0,
  });

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<"question" | "feedback" | "complete">("question");
  const [correctCount, setCorrectCount] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("worldquest_progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (p: PlayerProgress) => {
    localStorage.setItem("worldquest_progress", JSON.stringify(p));
    setProgress(p);
  };

  if (!chapter) return <div className="min-h-screen bg-black text-white flex items-center justify-center">City not found</div>;

  const isCompleted = progress.completedChapters.includes(cityId);
  const quiz = chapter.quizQuestions[currentQuizIndex];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case "medium": return "text-amber-400 bg-amber-400/10 border-amber-400/30";
      case "hard": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/30";
    }
  };

  const handleAnswer = (index: number) => {
    if (quizState !== "question") return;
    setSelectedOption(index);
    setShowFact(true);

    const isCorrect = index === quiz.correctIndex;
    if (isCorrect) setCorrectCount(c => c + 1);
    setAnsweredQuestions(prev => [...prev, isCorrect]);

    setQuizState("feedback");

    setTimeout(() => {
      setShowFact(false);
      if (currentQuizIndex < chapter.quizQuestions.length - 1) {
        setCurrentQuizIndex(i => i + 1);
        setSelectedOption(null);
        setQuizState("question");
      } else {
        setQuizState("complete");
        // Award XP based on score
        const xpGain = correctCount * 15 + (isCorrect ? 15 : 0);
        const goldGain = Math.floor((correctCount + (isCorrect ? 1 : 0)) / 3) * 10;
        const updated = {
          ...progress,
          totalXP: progress.totalXP + xpGain,
          totalGold: progress.totalGold + goldGain,
        };
        saveProgress(updated);
      }
    }, 2500);
  };

  const handleEnterBoss = () => {
    router.push(`/adventure/${cityId}/boss`);
  };

  const handleReturnToMap = () => {
    router.push("/adventure");
  };

  const scorePercent = answeredQuestions.length > 0
    ? Math.round((answeredQuestions.filter(Boolean).length / answeredQuestions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* City Header */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img src={chapter.image} alt={chapter.name} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <button onClick={handleReturnToMap} className="text-sm text-gray-400 hover:text-white mb-3 flex items-center gap-2 transition-colors">
            ← Back to World Map
          </button>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: chapter.accentColor, textShadow: `0 0 40px ${chapter.themeColor}40` }}>
              {chapter.name}
            </h1>
            <span className={`text-[10px] px-2 py-1 rounded-full border ${getDifficultyColor("medium")}`}>{chapter.region}</span>
          </div>
          <p className="text-gray-400 text-sm">{chapter.subtitle}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Facts Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: chapter.accentColor }}>
            <span>📖</span> Discover {chapter.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {chapter.facts.map((fact, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Fact {i + 1}</div>
                <p className="text-sm text-gray-300 leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        {!isCompleted && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: chapter.accentColor }}>
                <span>🧩</span> Traveler's Quiz
              </h2>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-1 rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
                <span className="text-xs text-gray-500">
                  {currentQuizIndex + 1} / {chapter.quizQuestions.length}
                </span>
              </div>
            </div>

            {quizState !== "complete" ? (
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 mb-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentQuizIndex) / chapter.quizQuestions.length) * 100}%`,
                      background: `linear-gradient(90deg, ${chapter.themeColor}, ${chapter.accentColor})`,
                    }}
                  />
                </div>

                <p className="text-lg md:text-xl mb-6 font-light leading-relaxed">{quiz.question}</p>

                <div className="space-y-3">
                  {quiz.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === quiz.correctIndex;
                    const showResult = quizState === "feedback";

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={quizState !== "question"}
                        className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border ${showResult && isCorrect ? 'bg-emerald-500/15 border-emerald-500/50' : showResult && isSelected && !isCorrect ? 'bg-red-500/15 border-red-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${showResult && isCorrect ? 'bg-emerald-500/30 text-emerald-300' : showResult && isSelected ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-gray-400'}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={`flex-1 ${showResult && isCorrect ? 'text-emerald-300' : showResult && isSelected ? 'text-red-300' : 'text-gray-300'}`}>{option}</span>
                          {showResult && isCorrect && <span className="text-emerald-400 text-lg">✓</span>}
                          {showResult && isSelected && !isCorrect && <span className="text-red-400 text-lg">✗</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showFact && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-pulse">
                    <p className="text-sm text-amber-300 leading-relaxed">{quiz.fact}</p>
                  </div>
                )}

                {/* Progress dots */}
                <div className="mt-6 flex gap-1.5 justify-center">
                  {chapter.quizQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${i < currentQuizIndex ? 'bg-emerald-400' : i === currentQuizIndex ? 'bg-white' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl text-center" style={{ background: `linear-gradient(135deg, ${chapter.themeColor}15, ${chapter.accentColor}08)`, border: `1px solid ${chapter.themeColor}40` }}>
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: chapter.accentColor }}>Quiz Complete!</h3>
                <p className="text-gray-400 mb-1">You scored {correctCount} out of {chapter.quizQuestions.length}</p>
                <p className="text-sm text-gray-500 mb-4">{scorePercent}% accuracy</p>

                {correctCount === chapter.quizQuestions.length && (
                  <p className="text-amber-400 text-sm mb-4 animate-pulse">🏆 Perfect score! +100 XP bonus</p>
                )}
                {correctCount >= 7 && correctCount < 9 && (
                  <p className="text-cyan-400 text-sm mb-4">⭐ Excellent! +50 XP bonus</p>
                )}

                <button
                  onClick={handleEnterBoss}
                  className="mt-4 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${chapter.themeColor}, ${chapter.accentColor})`,
                    boxShadow: `0 0 30px ${chapter.themeColor}40`,
                  }}
                >
                  Enter the Boss Challenge →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Already completed */}
        {isCompleted && (
          <div className="p-8 rounded-3xl text-center bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-2xl font-bold text-emerald-300 mb-2">{chapter.name} Conquered!</h3>
            <p className="text-gray-400 mb-4">You've earned your passport stamp for this city.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReturnToMap} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                Return to World Map
              </button>
              <button onClick={handleEnterBoss} className="px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-all border border-emerald-500/30">
                Replay Boss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}