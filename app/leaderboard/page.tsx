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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <header className="flex items-center mb-10 max-w-4xl mx-auto w-full">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition flex items-center group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto text-yellow-500">Global Leaderboard</h1>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-widest">
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Explorer</th>
                  <th className="px-6 py-4 font-semibold">Level</th>
                  <th className="px-6 py-4 font-semibold text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topUsers.map((user, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  
                  return (
                    <tr 
                      key={user.uid} 
                      className={`transition-colors hover:bg-gray-800/30 ${isTopThree ? 'bg-yellow-500/5' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          {rank === 1 ? (
                            <span className="text-2xl">🥇</span>
                          ) : rank === 2 ? (
                            <span className="text-2xl">🥈</span>
                          ) : rank === 3 ? (
                            <span className="text-2xl">🥉</span>
                          ) : (
                            <span className="text-gray-500 font-mono font-bold w-6 text-center">{rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl bg-gray-800 w-10 h-10 flex items-center justify-center rounded-full border border-gray-700">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-gray-100">{user.characterName}</div>
                            <div className="text-xs text-gray-500">{user.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-gray-800 px-3 py-1 rounded-full text-sm font-bold border border-gray-700">
                          Lvl {user.level}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-bold text-yellow-500">
                        {user.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {topUsers.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No explorers found yet. Be the first!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
