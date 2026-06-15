"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { ACHIEVEMENTS } from "@/services/achievementService";
import { CHAPTERS } from "@/services/chapterService";
import { MOCK_PUZZLES } from "@/services/puzzleService";
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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <header className="flex items-center mb-10 max-w-5xl mx-auto w-full">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition flex items-center group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto text-blue-500">Explorer Profile</h1>
        </header>

        <main className="max-w-5xl mx-auto space-y-12 pb-20">
          {/* Profile Hero Section */}
          {profile && (
            <div className="bg-gray-900 rounded-3xl p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="text-9xl">🌍</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 relative z-10">
                <div className="text-9xl bg-gray-800 p-8 rounded-full border-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  {profile.avatar}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-extrabold mb-2">{profile.characterName}</h2>
                  <div className="inline-block bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-blue-600/30 mb-6">
                    {profile.title}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <StatItem label="Level" value={profile.level.toString()} icon="📈" />
                    <StatItem label="Total XP" value={profile.xp.toLocaleString()} icon="✨" />
                    <StatItem label="Streak" value={`${profile.streak} Days`} icon="🔥" />
                    <StatItem label="Puzzles" value={profile.puzzlesCompleted.length.toString()} icon="🧩" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Achievements Section */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-3">🏆</span> Achievements
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = profile?.achievements.includes(achievement.id);
                  return (
                    <div 
                      key={achievement.id}
                      className={`flex items-center p-4 rounded-2xl border transition ${
                        isUnlocked 
                          ? "bg-gray-900 border-gray-800 opacity-100" 
                          : "bg-gray-900/40 border-gray-800/50 opacity-40 grayscale"
                      }`}
                    >
                      <div className="text-3xl mr-5 w-14 h-14 bg-gray-800 flex items-center justify-center rounded-xl border border-gray-700">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-100">{achievement.title}</h4>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>
                      {isUnlocked && (
                        <div className="ml-auto text-green-500 font-bold text-xs uppercase tracking-widest">
                          Unlocked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Adventure Progress Section */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-3">🗺️</span> Adventure Log
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {CHAPTERS.map(chapter => {
                  const isCompleted = profile?.chaptersCompleted.includes(chapter.id);
                  const isUnlocked = chapter.id === 1 || profile?.chaptersCompleted.includes(chapter.id - 1);

                  return (
                    <div 
                      key={chapter.id}
                      className={`flex items-center p-4 rounded-2xl border transition ${
                        isCompleted 
                          ? "bg-blue-600/5 border-blue-500/30" 
                          : "bg-gray-900 border-gray-800"
                      } ${!isUnlocked && "opacity-40 grayscale"}`}
                    >
                      <div className="text-2xl mr-5 w-12 h-12 bg-gray-800 flex items-center justify-center rounded-full border border-gray-700">
                        {chapter.image}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${isCompleted ? 'text-blue-400' : 'text-gray-100'}`}>
                          Chapter {chapter.id}: {chapter.title}
                        </h4>
                        <div className="text-xs text-gray-500">
                          {isCompleted ? "Recovered " + chapter.crystalName : isUnlocked ? "In Progress" : "Locked"}
                        </div>
                      </div>
                      {isCompleted && (
                        <div className="ml-auto text-green-500 text-xl">
                          💎
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string, icon: string }) {
  return (
    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-lg font-bold text-gray-100">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</div>
    </div>
  );
}
