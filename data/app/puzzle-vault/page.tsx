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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <header className="flex items-center mb-10 max-w-6xl mx-auto w-full">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition flex items-center group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto text-purple-500">Puzzle Vault</h1>
        </header>

        <main className="max-w-6xl mx-auto">
          {activePuzzle ? (
            <div className="flex flex-col items-center">
              <button 
                onClick={() => setActivePuzzle(null)}
                className="mb-8 text-gray-400 hover:text-white transition"
              >
                ← Return to Vault
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

                    // Refresh profile to show completion status
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
              {/* Category Browser */}
              <div className="flex flex-wrap gap-3 mb-12 justify-center">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === category 
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" 
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Puzzle Library */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPuzzles.map(puzzle => {
                  const isCompleted = profile?.puzzlesCompleted.includes(puzzle.id);
                  
                  return (
                    <div 
                      key={puzzle.id}
                      onClick={() => setActivePuzzle(puzzle)}
                      className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 transition-all hover:border-purple-500 hover:shadow-2xl cursor-pointer flex flex-col items-center text-center overflow-hidden"
                    >
                      <div className="mb-4 bg-gray-800 w-full aspect-video flex items-center justify-center rounded-xl border border-gray-700 group-hover:scale-105 transition-transform overflow-hidden relative">
                        <img 
                          src={puzzle.imageUrl} 
                          alt={puzzle.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{puzzle.title}</h3>
                      <div className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-tighter">
                        {puzzle.location}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                        {puzzle.difficulty} • {puzzle.category}
                      </div>
                      
                      {isCompleted ? (
                        <span className="text-green-500 text-xs font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                          COMPLETED
                        </span>
                      ) : (
                        <span className="text-purple-400 text-xs font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                          UNSOLVED
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredPuzzles.length === 0 && (
                <div className="text-center py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                  <p className="text-gray-500">No puzzles found in this category yet.</p>
                </div>
              )}
            </>
          )}
        </main>

        {showXPPopup !== null && (
          <XPPopup amount={showXPPopup} onComplete={() => setShowXPPopup(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
