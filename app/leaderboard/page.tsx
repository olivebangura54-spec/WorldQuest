"use client";

import { useEffect, useState, useCallback } from "react";
import { getTopUsers, UserProfile } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

/* ───── Animated Counter ───── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useCallback((node: HTMLSpanElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
  }, [target]);

  return (
    <span ref={ref} className="gradient-text-animated font-black">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ───── Crystal Trophy SVG ───── */
function CrystalTrophy({ rank }: { rank: 1 | 2 | 3 }) {
  const colors = {
    1: { main: "#fbbf24", glow: "rgba(251,191,36,0.4)", label: "Gold" },
    2: { main: "#94a3b8", glow: "rgba(148,163,184,0.3)", label: "Silver" },
    3: { main: "#d4a574", glow: "rgba(212,165,116,0.3)", label: "Bronze" },
  };
  const c = colors[rank];

  return (
    <div className="relative">
      <svg
        width="50"
        height="60"
        viewBox="0 0 50 60"
        fill="none"
        style={{ filter: `drop-shadow(0 0 15px ${c.glow})` }}
      >
        {/* Crystal shape */}
        <polygon points="25,2 42,15 38,45 12,45 8,15" fill={c.main} opacity="0.15" stroke={c.main} strokeWidth="1.5" />
        <polygon points="25,2 35,12 30,40 20,40 15,12" fill={c.main} opacity="0.25" />
        <polygon points="25,8 32,16 28,36 22,36 18,16" fill={c.main} opacity="0.35" />
        {/* Base */}
        <rect x="15" y="45" width="20" height="3" rx="1.5" fill={c.main} opacity="0.4" />
        <rect x="18" y="48" width="14" height="2" rx="1" fill={c.main} opacity="0.3" />
        {/* Rank number */}
        <text x="25" y="32" textAnchor="middle" fill={c.main} fontSize="14" fontWeight="bold" fontFamily="var(--font-cinzel)">
          {rank}
        </text>
      </svg>
    </div>
  );
}

/* ───── Crystal Progress Ring ───── */
function CrystalProgressRing({ percent, size = 80 }: { percent: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="4" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#crystal-gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <defs>
        <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  });
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const users = await getTopUsers(20);
        setTopUsers(users);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopUsers();
  }, []);

  // Season countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = seasonEnd.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Season Ended");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [seasonEnd]);

  const currentUserRank = topUsers.findIndex((u) => u.uid === user?.uid) + 1;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0b1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" style={{ animationDuration: "1.5s" }} />
          </div>
          <span className="text-sm text-purple-300/60 font-medium">Channeling crystal energies...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0d0b1a] text-white overflow-hidden">
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(168,85,247,0.04)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: "rgba(34,211,238,0.03)" }} />
          <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full blur-[150px]" style={{ background: "rgba(240,171,252,0.03)" }} />
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
            <h1 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] gradient-text">The Crystal Court</h1>
          </header>

          {/* Season Timer */}
          <div className="mb-10 text-center" style={{ animation: "slide-up 0.6s ease-out 0.1s both" }}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass" style={{ border: "1px solid rgba(168,85,247,0.15)" }}>
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <span className="text-xs text-purple-300/60 uppercase tracking-widest font-semibold">Season 1 Finals</span>
              <span className="text-sm font-mono font-bold text-cyan-400">{countdown}</span>
            </div>
          </div>

          {/* Top 3 Podium */}
          {topUsers.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-12" style={{ animation: "slide-up-heavy 0.8s ease-out 0.2s both" }}>
              {[1, 0, 2].map((rankIndex) => {
                const user = topUsers[rankIndex];
                if (!user) return null;
                const rank = (rankIndex + 1) as 1 | 2 | 3;
                const isFirst = rank === 1;
                const heights = { 1: "mt-0", 2: "mt-8", 3: "mt-12" };

                return (
                  <div
                    key={user.uid}
                    className={`flex flex-col items-center ${heights[rank]}`}
                  >
                    {/* Crystal Trophy */}
                    <div className="mb-3" style={{ animation: `crystal-float ${3 + rank}s ease-in-out infinite` }}>
                      <CrystalTrophy rank={rank} />
                    </div>

                    {/* Pedestal */}
                    <div
                      className={`w-full rounded-2xl p-5 text-center transition-all duration-300 ${
                        isFirst ? "glass-strong" : "glass"
                      }`}
                      style={{
                        borderColor: rank === 1 ? "rgba(251,191,36,0.2)" : rank === 2 ? "rgba(148,163,184,0.15)" : "rgba(212,165,116,0.15)",
                        boxShadow: isFirst ? "0 0 40px rgba(251,191,36,0.1)" : "none",
                      }}
                    >
                      {/* Avatar with neon ring */}
                      <div className="relative mx-auto mb-3 w-16 h-16">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: rank === 1 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : rank === 2 ? "linear-gradient(135deg, #94a3b8, #64748b)" : "linear-gradient(135deg, #d4a574, #b8845a)",
                            padding: "2px",
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-[#1a1625] flex items-center justify-center text-2xl">
                            {user.avatar}
                          </div>
                        </div>
                      </div>

                      <div className="font-bold text-sm mb-1 truncate text-white">{user.characterName}</div>
                      <div className="text-[10px] text-gray-500 mb-3 font-[family-name:var(--font-cinzel)]">{user.title}</div>

                      {/* Power Level */}
                      <div className="text-2xl font-black mb-1" style={{
                        background: "linear-gradient(135deg, #a855f7, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-purple-300/40 uppercase tracking-widest mb-3">Power Level</div>

                      {/* Mini stats */}
                      <div className="flex justify-center gap-4 text-[10px] text-gray-500">
                        <span>Level {user.level}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="rounded-2xl overflow-hidden glass" style={{ animation: "slide-up 0.6s ease-out 0.3s both", border: "1px solid rgba(168,85,247,0.1)" }}>
            <div className="p-5 border-b border-white/[0.06]">
              <h2 className="font-bold text-lg font-[family-name:var(--font-cinzel)] gradient-text">Global Rankings</h2>
            </div>
            {topUsers.length === 0 ? (
              <div className="p-20 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-gray-500 font-[family-name:var(--font-cinzel)]">No Crystal Guardians yet.</p>
                <p className="text-gray-600 text-sm mt-2">Be the first to claim your place.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {topUsers.map((u, index) => {
                  const rank = index + 1;
                  const isCurrentUser = u.uid === user?.uid;
                  const isTop10 = rank <= 10;

                  return (
                    <div
                      key={u.uid}
                      className={`flex items-center gap-4 px-5 py-4 transition-all duration-300 ${
                        isCurrentUser
                          ? "bg-cyan-500/5 border-l-2 border-l-cyan-400"
                          : "hover:bg-white/[0.02] border-l-2 border-l-transparent"
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 text-center shrink-0">
                        {isTop10 ? (
                          <span className={`text-sm font-black ${
                            rank === 1 ? "text-yellow-400" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-amber-600" : "text-purple-400"
                          }`}>
                            {rank <= 3 ? ["👑", "🥈", "🥉"][rank - 1] : `#${rank}`}
                          </span>
                        ) : (
                          <span className="text-sm font-mono text-gray-600">{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-lg shrink-0">
                        {u.avatar}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm truncate ${isCurrentUser ? "text-cyan-300" : "text-white"}`}>
                          {u.characterName}
                          {isCurrentUser && <span className="ml-2 text-[10px] text-cyan-400 font-normal">(You)</span>}
                        </div>
                        <div className="text-xs text-gray-600 font-[family-name:var(--font-cinzel)]">{u.title}</div>
                      </div>

                      {/* XP */}
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
                          {u.xp.toLocaleString()} XP
                        </div>
                        <div className="text-xs text-gray-600">Lvl {u.level}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-8" style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}>
            <div className="glass rounded-xl p-5 text-center" style={{ border: "1px solid rgba(168,85,247,0.1)" }}>
              <div className="text-2xl font-black mb-1">
                <AnimatedCounter target={topUsers.length} suffix="+" />
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total Players</div>
            </div>
            <div className="glass rounded-xl p-5 text-center" style={{ border: "1px solid rgba(168,85,247,0.1)" }}>
              <div className="text-2xl font-black mb-1">
                {currentUserRank > 0 ? (
                  <span className="text-cyan-400">#{currentUserRank}</span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Your Rank</div>
            </div>
            <div className="glass rounded-xl p-5 text-center" style={{ border: "1px solid rgba(168,85,247,0.1)" }}>
              <div className="text-2xl font-black mb-1">
                {currentUserRank > 1 && topUsers.length > 1 ? (
                  <AnimatedCounter target={Math.max(0, Math.round(((currentUserRank - 1) / topUsers.length) * 100))} suffix="%" />
                ) : (
                  <span className="text-purple-400">Top!</span>
                )}
              </div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Above You</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}