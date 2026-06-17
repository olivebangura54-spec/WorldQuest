"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { checkAndUpdateStreak } from "@/services/streakService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LEVEL_THRESHOLDS, calculateLevel } from "@/services/xpService";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          await checkAndUpdateStreak(user.uid);
          const data = await getUserProfile(user.uid);
          if (data) {
            setProfile(data);
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
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Loading your quest...</span>
        </div>
      </div>
    );
  }

  const xpProgress = profile ? (() => {
    const currentLevel = calculateLevel(profile.xp);
    const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const xpInLevel = profile.xp - currentThreshold;
    const xpNeeded = nextThreshold - currentThreshold;
    return xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
  })() : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070b14] text-white">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                <span className="text-lg">🌍</span>
              </div>
              <span className="text-xl font-bold text-white/90">WorldQuest</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </header>

          {/* Player Card */}
          {profile && (
            <div className="card-base p-8 mb-10" style={{ animation: 'slide-up 0.6s ease-out' }}>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gray-800/80 border-2 border-blue-500/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    {profile.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold shadow-lg">
                    {profile.level}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <h2 className="text-2xl font-bold">{profile.characterName}</h2>
                    <span className="badge-gold inline-flex w-fit mx-auto md:mx-0">{profile.title}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-center md:justify-start gap-6 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-amber-400 font-bold">{profile.xp.toLocaleString()}</span>
                      <span>XP</span>
                    </div>
                    <div className="w-px h-4 bg-gray-800" />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>🔥</span>
                      <span className="font-bold text-orange-400">{profile.streak}</span>
                      <span>Day Streak</span>
                    </div>
                    <div className="w-px h-4 bg-gray-800" />
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>🧩</span>
                      <span className="font-bold text-purple-400">{profile.puzzlesCompleted.length}</span>
                      <span>Puzzles</span>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Level {profile.level} Progress</span>
                      <span className="text-xs text-gray-500 font-mono">{Math.round(xpProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${xpProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NavCard
              href="/adventure"
              title="Adventure Mode"
              description="Journey through story-driven chapters and restore the Knowledge Crystals."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              }
              color="from-blue-600/20 to-blue-600/5"
              borderColor="border-blue-500/20"
              iconColor="text-blue-400"
              delay="0s"
            />
            <NavCard
              href="/puzzle-vault"
              title="Puzzle Vault"
              description="Challenge yourself with jigsaw puzzles from around the world and earn bonus XP."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959V6.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.286c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875S5.25 2.193 5.25 3.229c0 .369.128.713.349 1.003.215.283.401.604.401.959V6.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.286c0-.355.186-.676.401-.959A1.603 1.603 0 013.5 3.325c0-.369.128-.713.349-1.003C4.07 2.032 5.077 1.192 6.25 1.192S8.5 2.032 8.5 3.068c0 .369.128.713.349 1.003.215.283.401.604.401.959V6.75a.75.75 0 01-.75.75h-1.5" />
                </svg>
              }
              color="from-purple-600/20 to-purple-600/5"
              borderColor="border-purple-500/20"
              iconColor="text-purple-400"
              delay="0.1s"
            />
            <NavCard
              href="/leaderboard"
              title="Leaderboard"
              description="See how you rank against other explorers around the world."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m3.77-1.522a6.004 6.004 0 00-.73-5.474m-3.77 1.522a6.004 6.004 0 01.73-5.474m0 0a6.003 6.003 0 00-3.77-1.522m3.77 1.522a6.004 6.004 0 01-.73 5.474" />
                </svg>
              }
              color="from-amber-600/20 to-amber-600/5"
              borderColor="border-amber-500/20"
              iconColor="text-amber-400"
              delay="0.2s"
            />
            <NavCard
              href="/profile"
              title="Explorer Profile"
              description="View your achievements, stats, and journey progress."
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
              color="from-emerald-600/20 to-emerald-600/5"
              borderColor="border-emerald-500/20"
              iconColor="text-emerald-400"
              delay="0.3s"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function NavCard({
  href,
  title,
  description,
  icon,
  color,
  borderColor,
  iconColor,
  delay,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  iconColor: string;
  delay: string;
}) {
  return (
    <Link href={href} className="group block" style={{ animation: `slide-up 0.6s ease-out ${delay} both` }}>
      <div className={`card-base p-7 h-full bg-gradient-to-br ${color} ${borderColor} flex items-start gap-5`}>
        <div className={`w-12 h-12 rounded-xl bg-white/[0.05] border ${borderColor} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1.5 group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}