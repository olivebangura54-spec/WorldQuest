"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

/* ───── Chapter Data ───── */
const CHAPTERS = [
  {
    id: 1,
    number: "I",
    title: "The Awakening",
    subtitle: "Where it all begins",
    lore: "In the twilight of the old world, a spark of knowledge ignites within you. The ancient realm calls to those brave enough to listen.",
    color: "#a855f7",
    glowColor: "rgba(168,85,247,0.3)",
  },
  {
    id: 2,
    number: "II",
    title: "The Crystal Caves",
    subtitle: "Depths of understanding",
    lore: "Deep beneath the surface, crystals hum with forgotten wisdom. Navigate treacherous passages where knowledge is both weapon and reward.",
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,0.3)",
  },
  {
    id: 3,
    number: "III",
    title: "The Storm Peaks",
    subtitle: "Trial by element",
    lore: "At the summit where lightning meets stone, only the worthy can endure. The storm tests not strength, but the depth of your understanding.",
    color: "#f0abfc",
    glowColor: "rgba(240,171,252,0.3)",
  },
  {
    id: 4,
    number: "IV",
    title: "The Shadow Realm",
    subtitle: "Face the unknown",
    lore: "In darkness, truth is revealed. The Shadow Realm strips away illusion, leaving only the essence of what you have learned.",
    color: "#f43f5e",
    glowColor: "rgba(244,63,94,0.3)",
  },
  {
    id: 5,
    number: "V",
    title: "The Ascension",
    subtitle: "Claim your destiny",
    lore: "At the threshold between mortal and legend, the final trial awaits. Only those who have mastered all realms may ascend to become World Scholars.",
    color: "#fbbf24",
    glowColor: "rgba(251,191,36,0.3)",
  },
];

/* ───── Starfield Background ───── */
function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 3,
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0.4,
            animation: `sparkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ───── Aether Thread SVG ───── */
function AetherThreads() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" style={{ opacity: 0.15 }}>
      <defs>
        <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#f0abfc" />
        </linearGradient>
      </defs>
      {/* Connecting lines between chapters */}
      <path d="M 200,180 Q 400,120 600,200" stroke="url(#thread-gradient)" strokeWidth="1" fill="none" strokeDasharray="8 4" style={{ animation: "energy-flow 3s linear infinite" }} />
      <path d="M 600,200 Q 800,280 1000,160" stroke="url(#thread-gradient)" strokeWidth="1" fill="none" strokeDasharray="8 4" style={{ animation: "energy-flow 3s linear infinite 0.5s" }} />
      <path d="M 300,350 Q 500,250 700,320" stroke="url(#thread-gradient)" strokeWidth="1" fill="none" strokeDasharray="8 4" style={{ animation: "energy-flow 3s linear infinite 1s" }} />
      <path d="M 700,320 Q 900,380 1100,300" stroke="url(#thread-gradient)" strokeWidth="1" fill="none" strokeDasharray="8 4" style={{ animation: "energy-flow 3s linear infinite 1.5s" }} />
    </svg>
  );
}

export default function ChaptersPage() {
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

  const getChapterStatus = (chapterId: number): "unlocked" | "locked" | "active" => {
    if (!profile) return "locked";
    if (profile.chaptersCompleted.includes(chapterId)) return "unlocked";
    if (chapterId === profile.currentChapter) return "active";
    if (chapterId < profile.currentChapter) return "unlocked";
    return "locked";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0b1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
          </div>
          <span className="text-sm text-purple-300/60 font-medium">Consulting the Astral Codex...</span>
        </div>
      </div>
    );
  }

  const completedCount = profile?.chaptersCompleted.length || 0;
  const progressPercent = Math.round((completedCount / 5) * 100);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0d0b1a] text-white overflow-hidden">
        {/* Starfield */}
        <Starfield />

        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(168,85,247,0.04)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: "rgba(34,211,238,0.03)" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8" style={{ animation: "slide-up 0.6s ease-out" }}>
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] gradient-text">The Astral Codex</h1>
          </header>

          {/* Progress constellation map */}
          <div className="mb-12 glass rounded-2xl p-6" style={{ animation: "slide-up 0.6s ease-out 0.1s both", border: "1px solid rgba(168,85,247,0.1)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-purple-300/60 uppercase tracking-widest font-semibold">Journey Progress</span>
              <span className="text-sm font-mono text-cyan-400">{completedCount}/5 Chapters</span>
            </div>
            <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, #a855f7, #22d3ee, #f0abfc)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                }}
              />
            </div>
            {/* Chapter dots */}
            <div className="flex justify-between mt-4">
              {CHAPTERS.map((ch, i) => {
                const status = getChapterStatus(ch.id);
                return (
                  <div key={ch.id} className="flex flex-col items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        background: status === "unlocked" ? ch.color : status === "active" ? ch.color : "rgba(255,255,255,0.1)",
                        boxShadow: status === "active" ? `0 0 12px ${ch.glowColor}` : status === "unlocked" ? `0 0 8px ${ch.glowColor}` : "none",
                      }}
                    />
                    <span className="text-[8px] text-gray-600 uppercase tracking-wider">{ch.number}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Constellation grid */}
          <div className="relative">
            <AetherThreads />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {CHAPTERS.map((chapter, index) => {
                const status = getChapterStatus(chapter.id);
                const isLocked = status === "locked";
                const isActive = status === "active";
                const isUnlocked = status === "unlocked";

                return (
                  <div
                    key={chapter.id}
                    className="relative group"
                    style={{
                      animation: `card-reveal 0.7s ease-out ${0.15 + index * 0.1}s both`,
                    }}
                  >
                    <div
                      className={`relative rounded-2xl p-6 transition-all duration-500 overflow-hidden ${
                        isLocked ? "opacity-50" : "hover:-translate-y-2"
                      }`}
                      style={{
                        background: "rgba(26,22,37,0.6)",
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${isActive ? chapter.glowColor : isUnlocked ? `${chapter.color}30` : "rgba(255,255,255,0.05)"}`,
                        boxShadow: isActive ? `0 0 30px ${chapter.glowColor}, inset 0 0 30px ${chapter.glowColor.replace("0.3", "0.05")}` : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLocked) {
                          e.currentTarget.style.borderColor = `${chapter.color}60`;
                          e.currentTarget.style.boxShadow = `0 0 40px ${chapter.glowColor}`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLocked) {
                          e.currentTarget.style.borderColor = isActive ? chapter.glowColor : `${chapter.color}30`;
                          e.currentTarget.style.boxShadow = isActive ? `0 0 30px ${chapter.glowColor}` : "none";
                        }
                      }}
                    >
                      {/* Star marker / chapter number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ filter: isLocked ? "none" : `drop-shadow(0 0 8px ${chapter.glowColor})` }}>
                            <polygon
                              points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12"
                              fill={isLocked ? "rgba(255,255,255,0.05)" : chapter.color}
                              opacity={isLocked ? 0.3 : 0.8}
                              stroke={isLocked ? "rgba(255,255,255,0.1)" : chapter.color}
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                        <span
                          className="text-[10px] uppercase tracking-widest font-bold"
                          style={{ color: isLocked ? "rgba(255,255,255,0.15)" : chapter.color }}
                        >
                          Chapter {chapter.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-xl font-bold mb-1 font-[family-name:var(--font-cinzel)]"
                        style={{ color: isLocked ? "rgba(255,255,255,0.3)" : "white" }}
                      >
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 italic">{chapter.subtitle}</p>

                      {/* Lore text */}
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: isLocked ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)" }}
                      >
                        {isLocked ? "This chapter remains sealed by ancient magic..." : chapter.lore}
                      </p>

                      {/* Status / Action */}
                      {isLocked ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-xs font-semibold uppercase tracking-wider">Sealed</span>
                        </div>
                      ) : isActive ? (
                        <Link
                          href={`/adventure/chapter/${chapter.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                          style={{
                            background: `linear-gradient(135deg, ${chapter.color}40, ${chapter.color}20)`,
                            border: `1px solid ${chapter.color}50`,
                            boxShadow: `0 0 20px ${chapter.glowColor}`,
                          }}
                        >
                          Enter Chapter
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2" style={{ color: chapter.color }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                        </div>
                      )}
                    </div>

                    {/* Pulsing glow for active chapter */}
                    {isActive && (
                      <div
                        className="absolute -inset-1 rounded-2xl opacity-20 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at center, ${chapter.color}20, transparent 70%)`,
                          animation: "glow-pulse 3s ease-in-out infinite",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lore footer */}
          <div className="mt-16 text-center" style={{ animation: "fade-in 1s ease-out 0.8s both" }}>
            <p className="text-xs text-gray-600 italic font-[family-name:var(--font-cinzel)]">
              &ldquo;In the constellation of knowledge, every star is a chapter waiting to be discovered.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}