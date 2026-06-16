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
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070b14] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold">Explorer Profile</h1>
          </header>

          {/* Profile Hero */}
          {profile && (
            <div className="card-base p-8 mb-10" style={{ animation: 'slide-up 0.6s ease-out' }}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-gray-800/80 border-2 border-blue-500/30 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    {profile.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold shadow-lg">
                    {profile.level}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black mb-2">{profile.characterName}</h2>
                  <span className="badge-gold inline-flex w-fit mx-auto md:mx-0 mb-6">{profile.title}</span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatItem label="Level" value={profile.level.toString()} icon="📈" />
                    <StatItem label="Total XP" value={profile.xp.toLocaleString()} icon="✨" />
                    <StatItem label="Streak" value={`${profile.streak} Days`} icon="🔥" />
                    <StatItem label="Puzzles" value={profile.puzzlesCompleted.length.toString()} icon="🧩" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements */}
            <section style={{ animation: 'slide-up 0.6s ease-out 0.1s both' }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="text-xl">🏆</span> Achievements
              </h3>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = profile?.achievements.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isUnlocked
                          ? "bg-white/[0.03] border-white/[0.06]"
                          : "bg-white/[0.01] border-white/[0.03] opacity-40 grayscale"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-2xl shrink-0">
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
            <section style={{ animation: 'slide-up 0.6s ease-out 0.2s both' }}>
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                <span className="text-xl">🗺️</span> Adventure Log
              </h3>
              <div className="space-y-3">
                {CHAPTERS.map((chapter) => {
                  const isCompleted = profile?.chaptersCompleted.includes(chapter.id);
                  const isUnlocked = chapter.id === 1 || profile?.chaptersCompleted.includes(chapter.id - 1);

                  return (
                    <div
                      key={chapter.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${
                        isCompleted
                          ? "bg-blue-600/5 border-blue-500/15"
                          : "bg-white/[0.02] border-white/[0.06]"
                      } ${!isUnlocked && !isCompleted ? "opacity-40 grayscale" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-xl shrink-0">
                        {chapter.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm ${isCompleted ? "text-blue-400" : ""}`}>
                          Ch. {chapter.id}: {chapter.title}
                        </h4>
                        <div className="text-xs text-gray-600">
                          {isCompleted ? "Recovered " + chapter.crystalName : isUnlocked ? "In Progress" : "Locked"}
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

function StatItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">{label}</div>
    </div>
  );
}