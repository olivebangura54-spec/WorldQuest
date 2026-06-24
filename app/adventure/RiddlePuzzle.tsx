"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  playerLevel: number;
  realmNumber: number;
  onComplete: () => void;
  onExit: () => void;
  customRiddle?: {        // ← ADD THIS LINE
    question: string;
    answers: string[];
    hints: string[];
    timeLimit: number;
  };
}
const RIDDLE_BANK = [
  {
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answers: ["map", "a map"],
    hints: ["You use me to find your way.", "I show the world in miniature.", "I'm paper that shows geography."],
    timeLimit: 45,
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answers: ["footsteps", "footstep", "steps", "footprints", "a footprint"],
    hints: ["I happen when you walk.", "I trail behind you.", "You make me with your feet."],
    timeLimit: 30,
  },
  {
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answers: ["echo", "an echo"],
    hints: ["I repeat what you say.", "I bounce off walls.", "You hear me in canyons."],
    timeLimit: 40,
  },
  {
    question: "The poor have me; the rich need me. If you eat me, you die. What am I?",
    answers: ["nothing"],
    hints: ["I am the absence of something.", "I am what remains when all is gone.", "I am the void."],
    timeLimit: 50,
  },
  {
    question: "I am not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
    answers: ["fire"],
    hints: ["I am hot and dangerous.", "I dance on wood.", "I need oxygen to survive."],
    timeLimit: 35,
  },
];
export default function RiddlePuzzle({ playerLevel, realmNumber, onComplete, onExit, customRiddle }: Props) {
  const difficulty = Math.min(playerLevel, 5);
const riddle = customRiddle || RIDDLE_BANK[(realmNumber - 1) % RIDDLE_BANK.length];
  
  const [timeLeft, setTimeLeft] = useState(riddle.timeLimit - (difficulty * 3));
  const [input, setInput] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong" | "timeout">("idle");
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || solved) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, solved]);

  useEffect(() => {
    if (timeLeft <= 0 && !solved) {
      setFeedback("timeout");
      setShowAnswer(true);
      // Auto-advance after showing answer
      setTimeout(onComplete, 4000);
    }
  }, [timeLeft, solved, onComplete]);

  const handleSubmit = useCallback(() => {
    const clean = input.trim().toLowerCase();
    if (riddle.answers.includes(clean)) {
      setFeedback("correct");
      setSolved(true);
      setTimeout(onComplete, 2000);
    } else {
      setFeedback("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [input, riddle.answers, onComplete]);

  const useHint = () => {
    if (hintsUsed < riddle.hints.length && timeLeft > 0) {
      setHintsUsed(h => h + 1);
      setTimeLeft(t => Math.max(t - 5, 0));
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const timerColor = timeLeft > 10 ? "text-cyan-400" : timeLeft > 5 ? "text-amber-400" : "text-red-500";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors text-sm tracking-widest">
          ← EXIT
        </button>
        <div className={`text-2xl font-mono font-bold ${timerColor} ${timeLeft <= 5 ? "animate-pulse" : ""}`}>
          {formatTime(Math.max(timeLeft, 0))}
        </div>
      </div>

      <div className={`max-w-xl w-full transition-transform duration-200 ${shake ? "translate-x-2" : ""}`}>
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.4em] text-purple-400 uppercase">Realm {realmNumber}</span>
        </div>

        <div 
          className="p-8 rounded-3xl mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(34,211,238,0.04))",
            border: feedback === "correct" ? "1px solid rgba(34,211,238,0.6)" : feedback === "timeout" ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(168,85,247,0.2)",
            boxShadow: feedback === "correct" ? "0 0 60px rgba(34,211,238,0.2)" : feedback === "timeout" ? "0 0 40px rgba(239,68,68,0.15)" : "none",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent)", filter: "blur(40px)" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-sm text-purple-300 tracking-widest uppercase">The Oracle Speaks</span>
            </div>

            <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90 mb-8" style={{ textShadow: "0 2px 20px rgba(168,85,247,0.2)" }}>
              "{riddle.question}"
            </p>

            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Speak your answer..."
                disabled={solved || timeLeft <= 0}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || solved || timeLeft <= 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>

            {feedback === "correct" && (
              <div className="mt-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-center animate-pulse">
                ✦ The realm acknowledges your wisdom. The path opens... ✦
              </div>
            )}
            {feedback === "wrong" && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-center">
                The Oracle shakes her head. Try again, traveler.
              </div>
            )}
            {feedback === "timeout" && (
              <div className="mt-4 space-y-3">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-center">
                  Time has faded. The vision slips away...
                </div>
                {showAnswer && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center animate-pulse">
                    <div className="text-sm text-amber-400/70 mb-1">The answer was:</div>
                    <div className="text-lg font-bold">"{riddle.answers[0]}"</div>
                    <div className="text-xs text-amber-400/50 mt-2">Moving to next realm...</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={useHint}
            disabled={hintsUsed >= riddle.hints.length || timeLeft <= 0 || solved}
            className="text-sm text-purple-400/60 hover:text-purple-300 transition-colors disabled:opacity-30"
          >
            {hintsUsed >= riddle.hints.length ? "No hints remain" : `Reveal hint (${riddle.hints.length - hintsUsed} left, -5s)`}
          </button>
          <span className="text-xs text-gray-600">Difficulty: {["Novice", "Adept", "Scholar", "Sage", "Oracle"][difficulty - 1] || "Novice"}</span>
        </div>

        <div className="mt-4 space-y-2">
          {riddle.hints.slice(0, hintsUsed).map((hint: string, i: number) => (
            <div key={i} className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-sm text-purple-200/70 italic">
              💫 Hint {i + 1}: {hint}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}