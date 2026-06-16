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
          // Check/Update Streak
          const streakInfo = await checkAndUpdateStreak(user.uid);
          if (streakInfo) {
            console.log("Streak updated:", streakInfo);
            // In a real app, you might show a nice modal here
          }

          const data = await getUserProfile(user.uid);
          if (data) {
            setProfile(data);
          } else {
            // If no profile found, redirect to onboarding
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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <header className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-500">WorldQuest</h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </header>

        <main className="max-w-5xl mx-auto space-y-10">
          {/* Player Card */}
          {profile && (
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center space-x-6 shadow-xl">
              <div className="text-6xl bg-gray-800 p-4 rounded-full border-2 border-blue-500 shadow-lg">
                {profile.avatar}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-2xl font-bold">{profile.characterName}</h2>
                  <span className="text-blue-400 font-semibold">{profile.title}</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-400 mb-4">
                  <span>Level {profile.level}</span>
                  <span>{profile.xp} XP</span>
                  <span>🔥 {profile.streak} Day Streak</span>
                </div>
                {/* XP Progress Bar */}
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${(() => {
                      const currentLevel = calculateLevel(profile.xp);
                      const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
                      const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
                      const xpInLevel = profile.xp - currentThreshold;
                      const xpNeeded = nextThreshold - currentThreshold;
                      return xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
                    })()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NavCard 
              href="/adventure" 
              title="Adventure Mode" 
              description="Journey through story-driven chapters and restore the Knowledge Crystals."
              icon="🌍"
              color="bg-green-600"
            />
            <NavCard 
              href="/puzzle-vault" 
              title="Puzzle Vault" 
              description="Challenge yourself with additional puzzles and earn bonus XP."
              icon="🧩"
              color="bg-purple-600"
            />
            <NavCard 
              href="/leaderboard" 
              title="Leaderboard" 
              description="See how you rank against other explorers around the world."
              icon="🏆"
              color="bg-yellow-600"
            />
            <NavCard 
              href="/profile" 
              title="Explorer Profile" 
              description="View your achievements, stats, and journey progress."
              icon="👤"
              color="bg-blue-600"
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function NavCard({ href, title, description, icon, color }: { href: string, title: string, description: string, icon: string, color: string }) {
  return (
    <Link href={href} className="group">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 h-full transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] group-hover:-translate-y-2">
        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
