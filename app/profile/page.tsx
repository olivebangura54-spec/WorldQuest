"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { ACHIEVEMENTS } from "@/services/achievementService";
import { CHAPTERS } from "@/services/chapterService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0b1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          <span className="text-sm text-purple-300/60 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0d0b1a] text-white">
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(168,85,247,0.03)" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10" style={{ animation: "slide-up 0.6s ease-out" }}>
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] gradient-text">Explorer Profile</h1>
          </header>

          {/* Profile Hero */}
          {profile && (
            <div className="rounded-2xl p-8 mb-10" style={{ animation: "slide-up 0.6s ease-out 0.1s both", background: "rgba(26,22,37,0.6)", backdropFilter: "blur(24px)", border: "1px solid rgba(168,85,247,0.12)" }}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.3))",
                      padding: "3px",
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-[#1a1625] flex items-center justify-center">
                      {profile.avatar}
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #22d3ee)",
                      boxShadow: "0 0 15px rgba(168,85,247,0.4)",
                    }}
                  >
                    {profile.level}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black mb-2 font-[family-name:var(--font-cinzel)]">{profile.characterName}</h2>
                  <span className="badge-gold inline-flex w-fit mx-auto md:mx-0 mb-6">{profile.title}</span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatItem label="Level" value={profile.level.toString()} icon="📈" color="#22d3ee" />
                    <StatItem label="Total XP" value={profile.xp.toLocaleString()} icon="✨" color="#a855f7" />
                    <StatItem label="Streak" value={`${profile.streak} Days`} icon="🔥" color="#fbbf24" />
                    <StatItem label="Puzzles" value={profile.puzzlesCompleted.length.toString()} icon="🧩" color="#f0abfc" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements */}
            <section style={{ animation: "slide-up 0.6s ease-out 0.2s both" }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 font-[family-name:var(--font-cinzel)]">
                <span className="text-xl">🏆</span>
                <span className="gradient-text">Achievements</span>
              </h3>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = profile?.achievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all"
                      style={{
                        background: isUnlocked ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.01)",
                        border: `1px solid ${isUnlocked ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.03)"}`,
                        opacity: isUnlocked ? 1 : 0.4,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{
                          background: isUnlocked ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isUnlocked ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)"}`,
                          filter: isUnlocked ? "none" : "grayscale(1)",
                        }}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                      {isUnlocked && (
                        <span className="badge-green text-[10px] shrink-0">Unlocked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Adventure Log */}
            <section style={{ animation: "slide-up 0.6s ease-out 0.3s both" }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 font-[family-name:var(--font-cinzel)]">
                <span className="text-xl">🗺️</span>
                <span className="gradient-text">Adventure Log</span>
              </h3>
              <div className="space-y-3">
                {CHAPTERS.map((chapter) => {
                  const isCompleted = profile?.chaptersCompleted.includes(chapter.id);
                  const isUnlocked = chapter.id === 1 || profile?.chaptersCompleted.includes(chapter.id - 1);

                  return (
                    <div
                      key={chapter.id}
                      className="flex items-center gap-4 p-4 rounded-xl"
                      style={{
                        background: isCompleted ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.01)",
                        border: `1px solid ${isCompleted ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)"}`,
                        opacity: !isUnlocked && !isCompleted ? 0.4 : 1,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{
                          background: isCompleted ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {chapter.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm ${isCompleted ? "text-purple-300" : ""}`}>
                          Ch. {chapter.id}: {chapter.title}
                        </h4>
                        <div className="text-xs text-gray-600">
                          {isCompleted ? "Recovered " + chapter.crystalName : isUnlocked ? "In Progress" : "Sealed"}
                        </div>
                      </div>
                      {isCompleted && (
                        <span className="text-lg shrink-0">💎</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatItem({ label, value, icon, color = "#a855f7" }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(26,22,37,0.6)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</div>
    </div>
  );
}