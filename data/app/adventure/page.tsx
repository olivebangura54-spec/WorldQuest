"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { CHAPTERS } from "@/services/chapterService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdventurePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        <header className="flex items-center mb-10 max-w-5xl mx-auto">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-400 transition flex items-center group">
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto">Adventure Mode</h1>
        </header>

        <main className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-200">The Quest for the Knowledge Crystals</h2>
            <p className="text-gray-400 mt-2">Complete chapters to restore the World Archive.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CHAPTERS.map((chapter) => {
              const isCompleted = profile?.chaptersCompleted.includes(chapter.id);
              // Chapter 1 is always unlocked. Others unlock if the previous one is completed.
              const isUnlocked = chapter.id === 1 || profile?.chaptersCompleted.includes(chapter.id - 1);

              return (
                <div 
                  key={chapter.id}
                  className={`relative group bg-gray-900 border-2 rounded-3xl p-6 transition flex flex-col ${
                    isUnlocked 
                      ? "border-gray-800 hover:border-blue-500 hover:shadow-2xl cursor-pointer" 
                      : "border-gray-800 opacity-60 grayscale cursor-not-allowed"
                  }`}
                  onClick={() => isUnlocked && router.push(`/adventure/chapter/${chapter.id}`)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`text-5xl p-4 rounded-2xl bg-gray-800 border ${isUnlocked ? 'border-blue-500/30' : 'border-gray-700'}`}>
                      {chapter.image}
                    </div>
                    {isCompleted ? (
                      <span className="bg-green-600/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-600/50">
                        COMPLETED
                      </span>
                    ) : !isUnlocked ? (
                      <span className="bg-gray-800 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-700">
                        LOCKED
                      </span>
                    ) : (
                      <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-600/50">
                        READY
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">
                    Chapter {chapter.id}
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-100 mb-3">{chapter.title}</h4>
                  <p className="text-gray-400 text-sm mb-8 flex-1 leading-relaxed">
                    {chapter.description}
                  </p>
                  
                  <div className="text-xs font-mono text-blue-500/70 mb-4">
                    REWARD: {chapter.crystalName}
                  </div>

                  {isUnlocked ? (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                      {isCompleted ? "Replay Adventure" : "Begin Journey"}
                    </button>
                  ) : (
                    <div className="w-full bg-gray-800 text-gray-600 py-3 rounded-xl font-bold text-center">
                      Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
