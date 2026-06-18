"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { MOCK_PUZZLES, CATEGORIES, Puzzle, completePuzzle } from "@/services/puzzleService";
import { addXP } from "@/services/xpService";
import { checkAchievements } from "@/services/achievementService";
import ProtectedRoute from "@/components/ProtectedRoute";
import PuzzleView from "@/components/PuzzleView";
import XPPopup from "@/components/XPPopup";
import Link from "next/link";

/* ───── Floating Puzzle Pieces ───── */
function FloatingPuzzlePieces() {
  const pieces = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.03 + Math.random() * 0.05,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <svg
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `crystal-float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M25,5 L75,5 L85,25 L65,35 L65,65 L85,75 L75,95 L25,95 L15,75 L35,65 L35,35 L15,25 Z"
            fill="rgba(212,165,116,0.3)"
            stroke="rgba(212,165,116,0.4)"
            strokeWidth="1"
          />
        </svg>
      ))}
    </div>
  );
}

/* ───── Fireflies ───── */
function Fireflies() {
  const dots = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: "rgba(251,191,36,0.6)",
            boxShadow: `0 0 ${d.size * 5}px rgba(251,191,36,0.4)`,
            animation: `particle-firefly ${d.duration}s ${d.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

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

  const filteredPuzzles = MOCK_PUZZLES.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#1a2f1a" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-sm text-amber-200/60 font-medium">Opening the Vault...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white" style={{ background: "linear-gradient(180deg, #0d1a0d 0%, #1a2f1a 30%, #1a2f1a 70%, #0d1a0d 100%)" }}>
        {/* Floating puzzle pieces */}
        <FloatingPuzzlePieces />
        <Fireflies />

        {/* Ambient lantern glow */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px]" style={{ background: "rgba(212,165,116,0.06)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px]" style={{ background: "rgba(212,165,116,0.04)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10" style={{ animation: "slide-up 0.6s ease-out" }}>
            <Link href="/dashboard" className="flex items-center gap-2 text-amber-200/40 hover:text-amber-200 transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3 font-[family-name:var(--font-cinzel)]">
              <span className="text-amber-400 text-3xl">🧩</span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #d4a574, #fbbf24)" }}>
                Puzzle Vault
              </span>
            </h1>
          </header>

          <main>
            {activePuzzle ? (
              <div className="flex flex-col items-center" style={{ animation: "scale-in 0.4s ease-out" }}>
                <button
                  onClick={() => setActivePuzzle(null)}
                  className="mb-8 flex items-center gap-2 text-amber-200/40 hover:text-amber-200 transition-colors group"
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
                        alert(`Achievements Unlocked: ${earned.map((a) => a.title).join(", ")}`);
                      }
                    }
                    setActivePuzzle(null);
                  }}
                />
              </div>
            ) : (
              <>
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-10 justify-center" style={{ animation: "slide-up 0.5s ease-out" }}>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedCategory === category
                          ? "text-white shadow-[0_0_20px_rgba(212,165,116,0.3)]"
                          : "text-amber-200/40 hover:text-amber-200 hover:bg-white/5 border border-white/5"
                      }`}
                      style={
                        selectedCategory === category
                          ? { background: "linear-gradient(135deg, rgba(212,165,116,0.3), rgba(180,120,60,0.2))", border: "1px solid rgba(212,165,116,0.3)" }
                          : {}
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Puzzle grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredPuzzles.map((puzzle, index) => {
                    const isCompleted = profile?.puzzlesCompleted.includes(puzzle.id);
                    return (
                      <div
                        key={puzzle.id}
                        onClick={() => setActivePuzzle(puzzle)}
                        className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2"
                        style={{
                          background: "rgba(26,47,26,0.6)",
                          backdropFilter: "blur(16px)",
                          border: "1px solid rgba(212,165,116,0.1)",
                          animation: `card-reveal 0.6s ease-out ${Math.min(index * 0.08, 0.4)}s both`,
                          boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(212,165,116,0.3)";
                          e.currentTarget.style.boxShadow = "0 0 40px rgba(212,165,116,0.1), 0 8px 30px rgba(0,0,0,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(212,165,116,0.1)";
                          e.currentTarget.style.boxShadow = "0 4px 30px rgba(0,0,0,0.2)";
                        }}
                      >
                        <div className="aspect-video relative overflow-hidden bg-black/30">
                          <img
                            src={puzzle.imageUrl}
                            alt={puzzle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          {isCompleted && (
                            <div className="absolute top-3 right-3">
                              <span className="badge-green text-[10px] py-0.5">✓ Done</span>
                            </div>
                          )}
                          {/* Puzzle piece overlay on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 flex items-center justify-center">
                              <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959V6.75a.75.75 0 01-.75.75h-1.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm mb-1 group-hover:text-amber-300 transition-colors text-amber-100/90">
                            {puzzle.title}
                          </h3>
                          <div className="text-xs text-amber-200/30 mb-3">{puzzle.location}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-200/30 uppercase tracking-wider font-bold">
                              {puzzle.difficulty}
                            </span>
                            <span className="text-[10px] text-amber-200/30 uppercase tracking-wider font-bold">
                              {puzzle.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredPuzzles.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🧩</div>
                    <p className="text-amber-200/40 font-[family-name:var(--font-cinzel)] text-lg">The vault holds no secrets... yet.</p>
                    <p className="text-amber-200/20 text-sm mt-2">Check back soon for new puzzles.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {showXPPopup !== null && <XPPopup amount={showXPPopup} onComplete={() => setShowXPPopup(null)} />}
      </div>
    </ProtectedRoute>
  );
}