"use client";

import { useEffect, useState } from "react";
import { getTopUsers, UserProfile } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function LeaderboardPage() {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Loading rankings...</span>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#070b14] text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <h1 className="text-xl font-bold gradient-text-gold">Global Leaderboard</h1>
          </header>

          {/* Top 3 Podium */}
          {topUsers.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-10" style={{ animation: 'slide-up 0.6s ease-out' }}>
              {[1, 0, 2].map((rankIndex) => {
                const user = topUsers[rankIndex];
                if (!user) return null;
                const rank = rankIndex + 1;
                const isFirst = rank === 1;
                return (
                  <div
                    key={user.uid}
                    className={`card-base p-5 text-center ${isFirst ? "bg-gradient-to-b from-amber-600/10 to-transparent border-amber-500/20 -mt-4" : ""}`}
                  >
                    <div className="text-3xl mb-3">{getRankIcon(rank)}</div>
                    <div className="text-3xl mb-2">{user.avatar}</div>
                    <div className="font-bold text-sm mb-1 truncate">{user.characterName}</div>
                    <div className="text-xs text-gray-500 mb-3">{user.title}</div>
                    <div className="text-lg font-bold text-amber-400">{user.xp.toLocaleString()} XP</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="card-base overflow-hidden" style={{ animation: 'slide-up 0.6s ease-out 0.1s both' }}>
            <div className="p-5 border-b border-white/[0.06]">
              <h2 className="font-bold text-lg">Full Rankings</h2>
            </div>
            {topUsers.length === 0 ? (
              <div className="p-20 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <p className="text-gray-500">No explorers found yet. Be the first!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {topUsers.map((user, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={user.uid}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="w-8 text-center shrink-0">
                        {getRankIcon(rank) || (
                          <span className="text-sm font-mono text-gray-600">{rank}</span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-lg shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{user.characterName}</div>
                        <div className="text-xs text-gray-600">{user.title}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm text-amber-400">{user.xp.toLocaleString()} XP</div>
                        <div className="text-xs text-gray-600">Lvl {user.level}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}