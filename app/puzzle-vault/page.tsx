"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { completePuzzle } from "@/services/puzzleService";
import { addXP } from "@/services/xpService";
import { checkAchievements } from "@/services/achievementService";
import { COUNTRIES, Country, CountryPuzzle } from "@/services/countryService";
import ProtectedRoute from "@/components/ProtectedRoute";
import PuzzleView from "@/components/PuzzleView";
import XPPopup from "@/components/XPPopup";
import Link from "next/link";

/* ───── Floating Puzzle Pieces ───── */
function FloatingPuzzlePieces() {
  const pieces = useMemo(
    () =>
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
    []
  );

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
  const dots = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 2,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 5,
      })),
    []
  );

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

/* ───── Difficulty Badge ───── */
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    easy: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.25)" },
    medium: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
    hard: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.25)" },
  };
  const c = colors[difficulty] || colors.easy;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {difficulty}
    </span>
  );
}

/* ───── Lock Icon ───── */
function LockIcon({ unlocked }: { unlocked: boolean }) {
  if (unlocked) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
        <svg className="w-6 h-6 text-amber-200/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    </div>
  );
}

export default function PuzzleVaultPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [activePuzzle, setActivePuzzle] = useState<(CountryPuzzle & { countryId: string }) | null>(null);
  const [activeCountry, setActiveCountry] = useState<Country | null>(null);
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

  const filteredCountries =
    selectedCountry === "all"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.id === selectedCountry);

  /**
   * Determine if a puzzle is unlocked.
   * Rule: first puzzle in each country is always unlocked.
   * Others unlock sequentially after completing the previous one.
   */
  const isPuzzleUnlocked = (country: Country, puzzleIndex: number): boolean => {
    if (puzzleIndex === 0) return true;
    if (!profile) return false;
    // Check if the previous puzzle in this country is completed
    const prevPuzzle = country.puzzles[puzzleIndex - 1];
    return profile.puzzlesCompleted.includes(prevPuzzle.id);
  };

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
      <div
        className="min-h-screen text-white"
        style={{
          background:
            "linear-gradient(180deg, #0d1a0d 0%, #1a2f1a 30%, #1a2f1a 70%, #0d1a0d 100%)",
        }}
      >
        <FloatingPuzzlePieces />
        <Fireflies />

        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px]"
            style={{ background: "rgba(212,165,116,0.06)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px]"
            style={{ background: "rgba(212,165,116,0.04)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <header
            className="flex items-center justify-between mb-10"
            style={{ animation: "slide-up 0.6s ease-out" }}
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-amber-200/40 hover:text-amber-200 transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3 font-[family-name:var(--font-cinzel)]">
              <span className="text-amber-400 text-3xl">🧩</span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d4a574, #fbbf24)",
                }}
              >
                Puzzle Vault
              </span>
            </h1>
          </header>

          <main>
            {activePuzzle ? (
              /* ── Active Puzzle View ── */
              <div
                className="flex flex-col items-center"
                style={{ animation: "scale-in 0.4s ease-out" }}
              >
                <button
                  onClick={() => {
                    setActivePuzzle(null);
                    setActiveCountry(null);
                  }}
                  className="mb-8 flex items-center gap-2 text-amber-200/40 hover:text-amber-200 transition-colors group"
                >
                  <svg
                    className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Return to {activeCountry?.name || "Vault"}
                </button>
                <PuzzleView
                  puzzle={{
                    id: activePuzzle.id,
                    title: activePuzzle.name,
                    imageUrl: activePuzzle.imageUrl,
                    location: activeCountry?.name || "",
                    description: activePuzzle.artPrompt,
                  }}
                  onComplete={async () => {
                    if (user) {
                      const result = await addXP(user.uid, activePuzzle.xpReward);
                      await completePuzzle(user.uid, activePuzzle.id);
                      setShowXPPopup(activePuzzle.xpReward);
                      if (result.leveledUp) {
                        alert(
                          `LEVEL UP! You reached Level ${result.level}: ${result.title}!`
                        );
                      }
                      const updatedProfile = await getUserProfile(user.uid);
                      setProfile(updatedProfile);
                      const earned = await checkAchievements(user.uid);
                      if (earned.length > 0) {
                        alert(
                          `Achievements Unlocked: ${earned
                            .map((a) => a.title)
                            .join(", ")}`
                        );
                      }
                    }
                    setActivePuzzle(null);
                    setActiveCountry(null);
                  }}
                />
              </div>
            ) : (
              <>
                {/* ── Country Filter Tabs ── */}
                <div
                  className="flex flex-wrap gap-2 mb-8 justify-center"
                  style={{ animation: "slide-up 0.5s ease-out" }}
                >
                  <button
                    onClick={() => setSelectedCountry("all")}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      selectedCountry === "all"
                        ? "text-white shadow-[0_0_20px_rgba(212,165,116,0.3)]"
                        : "text-amber-200/40 hover:text-amber-200 hover:bg-white/5 border border-white/5"
                    }`}
                    style={
                      selectedCountry === "all"
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(212,165,116,0.3), rgba(180,120,60,0.2))",
                            border: "1px solid rgba(212,165,116,0.3)",
                          }
                        : {}
                    }
                  >
                    🌍 All Countries
                  </button>
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => setSelectedCountry(country.id)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedCountry === country.id
                          ? "text-white shadow-[0_0_20px_rgba(212,165,116,0.3)]"
                          : "text-amber-200/40 hover:text-amber-200 hover:bg-white/5 border border-white/5"
                      }`}
                      style={
                        selectedCountry === country.id
                          ? {
                              background: `linear-gradient(135deg, ${country.color}40, ${country.color}20)`,
                              border: `1px solid ${country.color}50`,
                            }
                          : {}
                      }
                    >
                      {country.flag} {country.name}
                    </button>
                  ))}
                </div>

                {/* ── Country Sections ── */}
                {filteredCountries.map((country, countryIndex) => {
                  const completedCount = country.puzzles.filter((p) =>
                    profile?.puzzlesCompleted.includes(p.id)
                  ).length;

                  return (
                    <div
                      key={country.id}
                      className="mb-12"
                      style={{
                        animation: `slide-up 0.5s ease-out ${countryIndex * 0.1}s both`,
                      }}
                    >
                      {/* Country Header */}
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl">{country.flag}</span>
                        <div>
                          <h2 className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-amber-100/90">
                            {country.name}
                          </h2>
                          <p className="text-xs text-amber-200/30">
                            {country.description}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3 mb-5 ml-16">
                        <div className="flex-1 max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(completedCount / country.puzzles.length) * 100}%`,
                              background: `linear-gradient(90deg, ${country.color}, ${country.color}99)`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-amber-200/40 uppercase tracking-wider">
                          {completedCount}/{country.puzzles.length} puzzles
                        </span>
                      </div>

                      {/* Puzzle Grid — 2 cols mobile, 3 cols tablet, 4 cols desktop */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {country.puzzles.map((puzzle, puzzleIndex) => {
                          const isCompleted = profile?.puzzlesCompleted.includes(puzzle.id);
                          const isUnlocked = isPuzzleUnlocked(country, puzzleIndex);

                          return (
                            <div
                              key={puzzle.id}
                              onClick={() => {
                                if (!isUnlocked) return;
                                setActivePuzzle({ ...puzzle, countryId: country.id });
                                setActiveCountry(country);
                              }}
                              className={`group rounded-2xl overflow-hidden transition-all duration-400 ${
                                isUnlocked
                                  ? "cursor-pointer hover:-translate-y-2"
                                  : "cursor-not-allowed opacity-50"
                              }`}
                              style={{
                                background: "rgba(26,47,26,0.6)",
                                backdropFilter: "blur(16px)",
                                border: `1px solid ${
                                  isCompleted
                                    ? country.color + "40"
                                    : isUnlocked
                                      ? "rgba(212,165,116,0.15)"
                                      : "rgba(255,255,255,0.03)"
                                }`,
                                animation: `card-reveal 0.6s ease-out ${Math.min(
                                  puzzleIndex * 0.06,
                                  0.5
                                )}s both`,
                                boxShadow: isCompleted
                                  ? `0 0 20px ${country.color}15`
                                  : "0 4px 30px rgba(0,0,0,0.2)",
                              }}
                              onMouseEnter={(e) => {
                                if (!isUnlocked) return;
                                e.currentTarget.style.borderColor = country.color + "60";
                                e.currentTarget.style.boxShadow = `0 0 40px ${country.color}20, 0 8px 30px rgba(0,0,0,0.3)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isCompleted
                                  ? country.color + "40"
                                  : isUnlocked
                                    ? "rgba(212,165,116,0.15)"
                                    : "rgba(255,255,255,0.03)";
                                e.currentTarget.style.boxShadow = isCompleted
                                  ? `0 0 20px ${country.color}15`
                                  : "0 4px 30px rgba(0,0,0,0.2)";
                              }}
                            >
                              {/* Image — 4:5 aspect ratio */}
                              <div className="aspect-[4/5] relative overflow-hidden bg-black/30">
                                <img
                                  src={puzzle.imageUrl}
                                  alt={puzzle.name}
                                  className={`w-full h-full object-cover transition-transform duration-500 ${
                                    isUnlocked ? "group-hover:scale-105" : "grayscale"
                                  }`}
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                {/* Lock overlay for locked puzzles */}
                                <LockIcon unlocked={isUnlocked} />

                                {/* Status badges */}
                                <div className="absolute top-2 right-2">
                                  {isCompleted ? (
                                    <span className="badge-green text-[10px] py-0.5">
                                      ✓ Done
                                    </span>
                                  ) : isUnlocked ? (
                                    <DifficultyBadge difficulty={puzzle.difficulty} />
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-800/80 text-gray-500 border border-gray-700/50">
                                      🔒 Locked
                                    </span>
                                  )}
                                </div>

                                {/* XP reward badge */}
                                {isUnlocked && (
                                  <div className="absolute top-2 left-2">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      +{puzzle.xpReward} XP
                                    </span>
                                  </div>
                                )}

                                {/* Puzzle name — at bottom of card */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h3
                                    className={`text-sm font-bold leading-tight ${
                                      isUnlocked
                                        ? "text-white"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {puzzle.name}
                                  </h3>
                                  {isUnlocked && !isCompleted && (
                                    <p className="text-[10px] text-amber-200/50 mt-1 font-medium">
                                      Tap to play →
                                    </p>
                                  )}
                                  {isCompleted && (
                                    <p className="text-[10px] text-green-400/60 mt-1 font-medium">
                                      Completed ✓
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* ── Total Progress Summary ── */}
                <div
                  className="mt-8 text-center"
                  style={{ animation: "slide-up 0.6s ease-out 0.5s both" }}
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-2xl">🧩</span>
                    <div className="text-left">
                      <p className="text-xs text-amber-200/40 font-medium uppercase tracking-wider">
                        Total Progress
                      </p>
                      <p className="text-sm font-bold text-amber-100/80">
                        {profile?.puzzlesCompleted.length || 0} /{" "}
                        {COUNTRIES.reduce((sum, c) => sum + c.puzzles.length, 0)} puzzles completed
                      </p>
                    </div>
                  </div>
                </div>
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