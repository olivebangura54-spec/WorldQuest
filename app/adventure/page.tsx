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
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Loading chapters...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070b14] text-white">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold">Adventure Mode</h1>
          </header>

          {/* Hero Section */}
          <div className="text-center mb-12" style={{ animation: 'slide-up 0.6s ease-out' }}>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              <span className="gradient-text">The Quest for the</span>{" "}
              <span className="text-white">Knowledge Crystals</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Complete chapters to restore the World Archive.
            </p>
          </div>

          {/* Chapter Grid - Vertical Path Layout */}
          <div className="max-w-2xl mx-auto space-y-4">
            {CHAPTERS.map((chapter, index) => {
              const isCompleted = profile?.chaptersCompleted.includes(chapter.id);
              const isUnlocked = chapter.id === 1 || profile?.chaptersCompleted.includes(chapter.id - 1);

              return (
                <div
                  key={chapter.id}
                  style={{ animation: `slide-up 0.5s ease-out ${index * 0.08}s both` }}
                >
                  <button
                    onClick={() => isUnlocked && router.push(`/adventure/chapter/${chapter.id}`)}
                    disabled={!isUnlocked}
                    className={`w-full text-left group transition-all duration-300 ${
                      isUnlocked
                        ? "cursor-pointer"
                        : "opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className={`card-base p-6 flex items-center gap-5 ${
                      isCompleted
                        ? "bg-gradient-to-r from-blue-600/10 to-purple-600/5 border-blue-500/20"
                        : isUnlocked
                          ? "hover:border-blue-500/30"
                          : ""
                    }`}>
                      {/* Chapter Number */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : isUnlocked
                            ? "bg-white/[0.03] border border-white/[0.06] group-hover:border-blue-500/30 group-hover:bg-blue-600/10"
                            : "bg-white/[0.02] border border-white/[0.04]"
                      }`}>
                        {isCompleted ? (
                          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : isUnlocked ? (
                          <span className="text-2xl">{chapter.image}</span>
                        ) : (
                          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>

                      {/* Chapter Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Chapter {chapter.id}</span>
                          {isCompleted && (
                            <span className="badge-green text-[10px] py-0.5">Completed</span>
                          )}
                          {!isUnlocked && (
                            <span className="badge text-[10px] py-0.5 bg-gray-800/50 text-gray-600 border border-gray-700/50">Locked</span>
                          )}
                          {isUnlocked && !isCompleted && (
                            <span className="badge-blue text-[10px] py-0.5">Ready</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-0.5 group-hover:text-blue-400 transition-colors">{chapter.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{chapter.description}</p>
                      </div>

                      {/* Arrow */}
                      {isUnlocked && (
                        <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Connector line between chapters */}
                  {index < CHAPTERS.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className={`w-px h-4 ${
                        isCompleted ? "bg-blue-500/30" : "bg-gray-800/50"
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}