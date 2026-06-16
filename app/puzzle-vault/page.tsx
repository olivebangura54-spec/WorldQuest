"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { MOCK_PUZZLES, CATEGORIES, Puzzle, completePuzzle } from "@/services/puzzleService";
import { addXP } from "@/services/xpService";
import { checkAchievements } from "@/services/achievementService";
import ProtectedRoute from "@/components/ProtectedRoute";
import PuzzleView from "@/components/PuzzleView";
import XPPopup from "@/components/XPPopup";
import Link from "next/link";

export default function PuzzleVaultPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showXPPopup, setShowXPPopup] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const filteredPuzzles = MOCK_PUZZLES.filter(p =>
    selectedCategory === "All" || p.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Loading puzzles...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070b14] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <header className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-purple-400">🧩</span>
              Puzzle Vault
            </h1>
          </header>

          <main>
            {activePuzzle ? (
              <div className="flex flex-col items-center" style={{ animation: 'scale-in 0.4s ease-out' }}>
                <button
                  onClick={() => setActivePuzzle(null)}
                  className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Return to Vault
                </button>
                <PuzzleView
                  puzzle={activePuzzle}
                  onComplete={async () => {
                    if (user) {
                      const result = await addXP(user.uid, 25);
                      await completePuzzle(user.uid, activePuzzle.id);
                      setShowXPPopup(25);
                      if (result.leveledUp) {
                        alert(`LEVEL UP! You reached Level ${result.level}: ${result.title}!`);
                      }
                      const updatedProfile = await getUserProfile(user.uid);
                      setProfile(updatedProfile);
                      const earned = await checkAchievements(user.uid);
                      if (earned.length > 0) {
                        alert(`Achievements Unlocked: ${earned.map(a => a.title).join(", ")}`);
                      }
                    }
                    setActivePuzzle(null);
                  }}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-8 justify-center" style={{ animation: 'slide-up 0.5s ease-out' }}>
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredPuzzles.map((puzzle, index) => {
                    const isCompleted = profile?.puzzlesCompleted.includes(puzzle.id);
                    return (
                      <div
                        key={puzzle.id}
                        onClick={() => setActivePuzzle(puzzle)}
                        className="group card-base overflow-hidden cursor-pointer"
                        style={{ animation: `slide-up 0.5s ease-out ${Math.min(index * 0.05, 0.3)}s both` }}
                      >
                        <div className="aspect-video relative overflow-hidden bg-gray-800/50">
                          <img
                            src={puzzle.imageUrl}
                            alt={puzzle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {isCompleted && (
                            <div className="absolute top-3 right-3">
                              <span className="badge-green text-[10px] py-0.5">✓ Done</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-1 group-hover:text-purple-400 transition-colors">{puzzle.title}</h3>
                          <div className="text-xs text-gray-500 mb-2">{puzzle.location}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">{puzzle.difficulty}</span>
                            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">{puzzle.category}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredPuzzles.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-4xl mb-4">🧩</div>
                    <p className="text-gray-500">No puzzles found in this category yet.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {showXPPopup !== null && (
          <XPPopup amount={showXPPopup} onComplete={() => setShowXPPopup(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
