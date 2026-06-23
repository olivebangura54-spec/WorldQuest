// app/adventure/page.tsx — Adventure Hub
"use client";

import { useState } from "react";
import RiddlePuzzle from "./RiddlePuzzle";
import JigsawPuzzle from "./JigsawPuzzle";

type PuzzleType = "menu" | "riddle" | "jigsaw";

export default function AdventurePage() {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType>("menu");
  const [completedRealms, setCompletedRealms] = useState(0);
  const playerLevel = 3;

  const handlePuzzleComplete = () => {
    setCompletedRealms(prev => prev + 1);
    setCurrentPuzzle("menu");
  };

  if (currentPuzzle === "riddle") {
    return <RiddlePuzzle 
      playerLevel={playerLevel} 
      realmNumber={completedRealms + 1}
      onComplete={handlePuzzleComplete}
      onExit={() => setCurrentPuzzle("menu")}
    />;
  }

  if (currentPuzzle === "jigsaw") {
    return <JigsawPuzzle 
      playerLevel={playerLevel}
      realmNumber={completedRealms + 1}
      onComplete={handlePuzzleComplete}
      onExit={() => setCurrentPuzzle("menu")}
    />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-2 text-center" style={{ textShadow: "0 0 40px rgba(168,85,247,0.4)" }}>
        Realm {completedRealms + 1}
      </h1>
      <p className="text-center text-gray-400 mb-12">Choose your challenge to unlock the next realm</p>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <button
          onClick={() => setCurrentPuzzle("riddle")}
          className="group relative p-8 rounded-3xl text-left transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(34,211,238,0.05))",
            border: "1px solid rgba(168,85,247,0.3)",
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)" }}>
            <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">The Oracle's Riddle</h3>
          <p className="text-gray-400 text-sm mb-4">Solve the ancient mystery with wit and wisdom. Time is ticking.</p>
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <span>Text-based • Timed</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => setCurrentPuzzle("jigsaw")}
          className="group relative p-8 rounded-3xl text-left transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.05))",
            border: "1px solid rgba(34,211,238,0.3)",
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(34,211,238,0.2)", border: "1px solid rgba(34,211,238,0.4)" }}>
            <svg className="w-7 h-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0 .355.189.686.496.865a2.25 2.25 0 010 3.996 1.124 1.124 0 00-.496.865v.75m0-7.501c0 .355.189.686.496.865a2.25 2.25 0 010 3.996 1.124 1.124 0 00-.496.865v.75M6 12h12m-12 0a2.25 2.25 0 00-2.25-2.25M6 12a2.25 2.25 0 012.25-2.25M6 12l6 6m6-6l-6-6m6 6a2.25 2.25 0 012.25-2.25M18 12a2.25 2.25 0 01-2.25 2.25" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">The Shattered Vision</h3>
          <p className="text-gray-400 text-sm mb-4">Reassemble the sacred image piece by piece. The realm reveals itself.</p>
          <div className="flex items-center gap-2 text-cyan-300 text-sm">
            <span>Visual • Drag & Drop</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}