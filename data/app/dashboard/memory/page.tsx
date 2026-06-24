"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Card {
  id: number;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_CONTENTS = [
  "🗼", "🗽", "🏛️", "🕌", "⛩️", "🕍", "🏰", "🗿",
  "🌉", "🌊", "🏔️", "🌋", "🏝️", "🌅", "🌄", "🌠",
];

export default function MemoryMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "easy";
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [score, setScore] = useState(0);

  const getGridSize = () => {
    switch (difficulty) {
      case "easy": return 4;
      case "medium": return 8;
      case "hard": return 16;
      default: return 4;
    }
  };

  const getTimeLimit = () => {
    switch (difficulty) {
      case "easy": return 30;
      case "medium": return 60;
      case "hard": return 90;
      default: return 30;
    }
  };

  const initGame = useCallback(() => {
    const size = getGridSize();
    const pairs = size / 2;
    const selected = CARD_CONTENTS.slice(0, pairs);
    const deck = [...selected, ...selected]
      .map((content, i) => ({
        id: i,
        pairId: Math.floor(i / 2),
        content,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setTimeLeft(getTimeLimit());
    setGameState("ready");
    setScore(0);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    if (timeLeft <= 0) {
      setGameState("lost");
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleCardClick = (index: number) => {
    if (gameState === "ready") setGameState("playing");
    if (gameState !== "playing") return;
    if (flippedIndices.length >= 2) return;
    if (cards[index].isMatched) return;
    if (cards[index].isFlipped) return;
    if (flippedIndices.includes(index)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);
    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].pairId === cards[second].pairId) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            (i === first || i === second) ? { ...c, isMatched: true } : c
          ));
          setFlippedIndices([]);
          setScore(s => s + 100 + timeLeft);
          
          // Check win
          setCards(prev => {
            const allMatched = prev.every(c => c.isMatched || (c.id === first || c.id === second));
            if (allMatched) setGameState("won");
            return prev;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            (i === first || i === second) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const cols = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 4;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white">
          ← Dashboard
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Memory Match</h1>
          <p className="text-xs text-gray-500 capitalize">{difficulty}</p>
        </div>
        <div className="text-right text-sm">
          <div className={`font-mono font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-cyan-400"}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-gray-500">Moves: {moves}</div>
        </div>
      </div>

      {/* Game Area */}
      {gameState === "ready" && (
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setGameState("playing")}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 font-bold text-lg hover:scale-105 transition-all"
          >
            Start Game
          </button>
        </div>
      )}

      {(gameState === "playing" || gameState === "won" || gameState === "lost") && (
        <div 
          className="grid gap-3 max-w-lg w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(i)}
              disabled={card.isMatched || gameState !== "playing"}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? "bg-white/10 border-2 border-cyan-400/50 scale-100"
                  : "bg-white/5 border-2 border-white/10 hover:border-white/30 hover:bg-white/10 scale-100 active:scale-95"
              } ${card.isMatched ? "opacity-50" : ""}`}
            >
              {card.isFlipped || card.isMatched ? card.content : "?"}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {gameState === "won" && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-cyan-300 mb-2">You Won!</h2>
            <p className="text-gray-400 mb-2">Score: {score}</p>
            <p className="text-gray-500 text-sm mb-6">Moves: {moves} • Time: {getTimeLimit() - timeLeft}s</p>
            <div className="flex gap-3 justify-center">
              <button onClick={initGame} className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all">
                Play Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === "lost" && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">Time's Up!</h2>
            <p className="text-gray-400 mb-6">Matched: {cards.filter(c => c.isMatched).length / 2} pairs</p>
            <div className="flex gap-3 justify-center">
              <button onClick={initGame} className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all">
                Try Again
              </button>
              <button onClick={() => router.push("/dashboard")} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}