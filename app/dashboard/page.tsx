"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { checkAndUpdateStreak } from "@/services/streakService";
import { LEVEL_THRESHOLDS, calculateLevel } from "@/services/xpService";
import ProtectedRoute from "@/components/ProtectedRoute";
import SettingsPanel from "@/components/SettingsPanel";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

/* ───── Achievement Badges ───── */
const ACHIEVEMENTS = [
  { id: "first_quest", title: "First Steps", desc: "Complete your first quest", icon: "⭐", unlocked: false },
  { id: "streak_3", title: "Flame Keeper", desc: "Maintain a 3-day streak", icon: "🔥", unlocked: false },
  { id: "puzzle_5", title: "Puzzle Weaver", desc: "Solve 5 puzzles", icon: "🧩", unlocked: false },
  { id: "level_5", title: "Crystal Bearer", desc: "Reach level 5", icon: "💎", unlocked: false },
  { id: "chapter_1", title: "Chapter Initiate", desc: "Complete Chapter I", icon: "📖", unlocked: false },
  { id: "rank_10", title: "Rising Star", desc: "Reach top 10", icon: "🌟", unlocked: false },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          await checkAndUpdateStreak(user.uid);
          const data = await getUserProfile(user.uid);
          if (data) {
            setProfile(data);
            // Mark achievements as unlocked
            ACHIEVEMENTS.forEach((a) => {
              if (data.achievements.includes(a.id)) a.unlocked = true;
            });
          } else {
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0b1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          </div>
          <span className="text-sm text-purple-300/60 font-medium">Entering the Sanctum...</span>
        </div>
      </div>
    );
  }

  const xpProgress = profile
    ? (() => {
        const currentLevel = calculateLevel(profile.xp);
        const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
        const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const xpInLevel = profile.xp - currentThreshold;
        const xpNeeded = nextThreshold - currentThreshold;
        return xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
      })()
    : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0d0b1a] text-white overflow-x-hidden">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[250px]" style={{ background: "rgba(168,85,247,0.03)" }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(34,211,238,0.02)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[300px]" style={{ background: "rgba(240,171,252,0.015)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10" style={{ animation: "slide-up 0.6s ease-out" }}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white/90 font-[family-name:var(--font-cinzel)]">
                World<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Quest</span>
              </span>
            </Link>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </header>

          {/* Player Card — The Sanctum Header */}
          {profile && (
            <div className="mb-10" style={{ animation: "slide-up 0.6s ease-out 0.1s both" }}>
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: "rgba(26,22,37,0.6)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(168,85,247,0.12)",
                  boxShadow: "0 0 60px rgba(168,85,247,0.05)",
                }}
              >
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-purple-500/20 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-cyan-500/15 rounded-br-2xl" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      {/* Neon ring border */}
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
                        style={{
                          background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.3))",
                          padding: "3px",
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-[#1a1625] flex items-center justify-center">
                          {profile.avatar}
                        </div>
                      </div>
                      {/* Level badge */}
                      <div
                        className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{
                          background: "linear-gradient(135deg, #a855f7, #22d3ee)",
                          boxShadow: "0 0 15px rgba(168,85,247,0.4)",
                        }}
                      >
                        {profile.level}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">LV. {profile.level}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                      <h2 className="text-3xl font-black font-[family-name:var(--font-cinzel)] text-white">{profile.characterName}</h2>
                      <span className="badge-gold inline-flex w-fit mx-auto md:mx-0">{profile.title}</span>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
                          {profile.xp.toLocaleString()}
                        </span>
                        <span className="text-gray-500">XP</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-2 text-sm">
                        <span>🔥</span>
                        <span className="font-bold text-orange-400">{profile.streak}</span>
                        <span className="text-gray-500">Streak</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-2 text-sm">
                        <span>🧩</span>
                        <span className="font-bold text-purple-400">{profile.puzzlesCompleted.length}</span>
                        <span className="text-gray-500">Puzzles</span>
                      </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Level {profile.level} Progress</span>
                        <span className="text-xs text-gray-500 font-mono">{Math.round(xpProgress)}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{
                            width: `${xpProgress}%`,
                            background: "linear-gradient(90deg, #a855f7, #22d3ee, #f0abfc)",
                            boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: "shimmer-line 3s ease-in-out infinite" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {profile && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10" style={{ animation: "slide-up 0.6s ease-out 0.2s both" }}>
              {[
                { label: "Total XP", value: profile.xp.toLocaleString(), icon: "⚡", color: "#a855f7" },
                { label: "Level", value: `${profile.level}`, icon: "📊", color: "#22d3ee" },
                { label: "Puzzles", value: `${profile.puzzlesCompleted.length}`, icon: "🧩", color: "#f0abfc" },
                { label: "Streak", value: `${profile.streak} days`, icon: "🔥", color: "#fbbf24" },
                { label: "Chapter", value: `${profile.currentChapter}/5`, icon: "📖", color: "#4ade80" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(26,22,37,0.6)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${stat.color}30`;
                    e.currentTarget.style.boxShadow = `0 0 20px ${stat.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Achievements Section */}
          <div className="mb-10" style={{ animation: "slide-up 0.6s ease-out 0.3s both" }}>
            <h3 className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {ACHIEVEMENTS.map((achievement) => (
                <div
                  key={achievement.id}
                  className="group rounded-xl p-4 text-center transition-all duration-300 cursor-default"
                  style={{
                    background: achievement.unlocked ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${achievement.unlocked ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)"}`,
                    boxShadow: achievement.unlocked ? "0 0 15px rgba(168,85,247,0.1)" : "none",
                    opacity: achievement.unlocked ? 1 : 0.4,
                  }}
                >
                  <div className="text-3xl mb-2" style={{ filter: achievement.unlocked ? "none" : "grayscale(1)" }}>
                    {achievement.icon}
                  </div>
                  <div className="text-[10px] font-bold text-white truncate">{achievement.title}</div>
                  <div className="text-[8px] text-gray-600 mt-1 truncate">{achievement.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}>
            <Link
              href="/adventure"
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.04))",
                border: "1px solid rgba(168,85,247,0.2)",
                boxShadow: "0 0 30px rgba(168,85,247,0.05)",
              }}
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: "rgba(168,85,247,0.15)" }}>
                  ⚔️
                </div>
                <h3 className="text-lg font-bold mb-1">Continue Quest</h3>
                <p className="text-sm text-gray-400">Resume your adventure</p>
              </div>
              <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">⚔️</div>
            </Link>

            <Link
              href="/puzzle-vault"
              className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(26,22,37,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: "rgba(168,85,247,0.08)" }}>
                🧩
              </div>
              <h3 className="text-lg font-bold mb-1">Puzzle Vault</h3>
              <p className="text-sm text-gray-400">Solve puzzles for bonus XP</p>
            </Link>

            <Link
              href="/leaderboard"
              className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(26,22,37,0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: "rgba(168,85,247,0.08)" }}>
                🏆
              </div>
              <h3 className="text-lg font-bold mb-1">Leaderboard</h3>
              <p className="text-sm text-gray-400">See your global ranking</p>
            </Link>
          </div>
        </div>

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </ProtectedRoute>
  );
}