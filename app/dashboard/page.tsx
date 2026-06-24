"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHAPTERS } from "@/data/chapters";
import { VAULT_PUZZLES } from "@/data/vaultPuzzles";
import { auth, onAuthStateChanged, type User } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";

type Tab = "profile" | "leaderboard" | "vault" | "memory";

interface PlayerProgress {
  completedChapters: string[];
  currentChapter: string;
  totalXP: number;
  totalGold: number;
  stamps: string[];
  totalDistanceTraveled: number;
  unlockedVault: string[];
}

interface LeaderboardEntry {
  name: string;
  xp: number;
  cities: number;
  avatar?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>({
    completedChapters: [],
    currentChapter: "sahara",
    totalXP: 0,
    totalGold: 150,
    stamps: [],
    totalDistanceTraveled: 0,
    unlockedVault: [],
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { name: "Explorer99", xp: 2450, cities: 6 },
    { name: "TravelerX", xp: 1890, cities: 4 },
    { name: "Wanderlust", xp: 1560, cities: 3 },
    { name: "Nomad2024", xp: 1200, cities: 2 },
    { name: "You", xp: 0, cities: 0 },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
    });
    
    const saved = localStorage.getItem("worldquest_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProgress(prev => ({ ...prev, ...parsed }));
    }
    
    return () => unsubscribe();
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "vault", label: "PuzzleVault", icon: "🧩" },
    { id: "memory", label: "Memory Match", icon: "🃏" },
  ];

  const completedCount = progress.completedChapters.length;
  const progressPercent = Math.round((completedCount / CHAPTERS.length) * 100);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">Your WorldQuest journey</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 text-sm">🪙 {progress.totalGold}</span>
            <span className="text-cyan-400 text-sm">✨ {progress.totalXP} XP</span>
            <button 
              onClick={() => router.push("/adventure")}
              className="px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-sm transition-all"
            >
              🌍 Adventure
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white/15 text-white border border-white/20"
                  : "bg-white/5 text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-w-5xl mx-auto">
        {activeTab === "profile" && <ProfileTab progress={progress} user={user} percent={progressPercent} />}
        {activeTab === "leaderboard" && <LeaderboardTab entries={leaderboard} userXP={progress.totalXP} />}
        {activeTab === "vault" && <VaultTab progress={progress} setProgress={setProgress} />}
        {activeTab === "memory" && <MemoryMatchTab />}
      </div>
    </div>
  );
}

// ==================== PROFILE TAB ====================
function ProfileTab({ progress, user, percent }: { progress: PlayerProgress; user: User | null; percent: number }) {
  return (
    <div className="space-y-6">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-full h-full rounded-full" />
          ) : (
            "🧭"
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.displayName || "Traveler"}</h2>
          <p className="text-sm text-gray-400">Level {Math.floor(progress.totalXP / 500) + 1} Explorer</p>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-amber-400">🪙 {progress.totalGold}</span>
            <span className="text-cyan-400">✨ {progress.totalXP} XP</span>
            <span className="text-purple-400">🎫 {progress.stamps.length} Stamps</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Cities", value: progress.completedChapters.length, icon: "🏙️" },
          { label: "Distance", value: `${progress.totalDistanceTraveled.toLocaleString()} km`, icon: "✈️" },
          { label: "Vault Unlocked", value: progress.unlockedVault.length, icon: "🧩" },
          { label: "Completion", value: `${percent}%`, icon: "📊" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Passport Stamps */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-bold mb-4">Passport Stamps</h3>
        <div className="flex gap-3 flex-wrap">
          {CHAPTERS.map(c => {
            const hasStamp = progress.stamps.includes(c.id);
            return (
              <div
                key={c.id}
                className={`w-16 h-20 rounded-xl flex flex-col items-center justify-center border ${
                  hasStamp ? "border-cyan-400/50 bg-cyan-400/10" : "border-white/5 bg-white/5 opacity-30"
                }`}
              >
                <span className="text-xl">{hasStamp ? "✈️" : "·"}</span>
                <span className="text-[10px] text-center mt-1 leading-tight">{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== LEADERBOARD TAB ====================
function LeaderboardTab({ entries, userXP }: { entries: LeaderboardEntry[]; userXP: number }) {
  const sorted = [...entries, { name: "You", xp: userXP, cities: 0 }]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">🏆 Global Rankings</h2>
      {sorted.map((entry, i) => {
        const isYou = entry.name === "You";
        return (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              isYou ? "bg-purple-500/10 border-purple-500/30" : "bg-white/5 border-white/10"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              i === 0 ? "bg-amber-500/30 text-amber-300" :
              i === 1 ? "bg-gray-300/30 text-gray-300" :
              i === 2 ? "bg-orange-600/30 text-orange-300" :
              "bg-white/10 text-gray-400"
            }`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium">{entry.name} {isYou && "(You)"}</div>
              <div className="text-xs text-gray-500">{entry.cities} cities conquered</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-cyan-400">{entry.xp.toLocaleString()} XP</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== VAULT TAB ====================
function VaultTab({ progress, setProgress }: { progress: PlayerProgress; setProgress: (p: PlayerProgress) => void }) {
  const regions = Array.from(new Set(VAULT_PUZZLES.map(p => p.region)));
  
  const unlockPuzzle = (puzzleId: string, cost: number) => {
    if (progress.totalGold < cost) return;
    if (progress.unlockedVault.includes(puzzleId)) return;
    
    const next = {
      ...progress,
      totalGold: progress.totalGold - cost,
      unlockedVault: [...progress.unlockedVault, puzzleId],
    };
    setProgress(next);
    localStorage.setItem("worldquest_progress", JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🧩 PuzzleVault</h2>
        <span className="text-sm text-amber-400">🪙 {progress.totalGold}</span>
      </div>
      
      {regions.map(region => (
        <div key={region}>
          <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-3">{region}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {VAULT_PUZZLES.filter(p => p.region === region).map(puzzle => {
              const isUnlocked = progress.unlockedVault.includes(puzzle.id);
              const canAfford = progress.totalGold >= puzzle.cost;
              
              return (
                <div
                  key={puzzle.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 opacity-70"
                  }`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-black/50">
                    <img src={puzzle.image} alt={puzzle.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{puzzle.name}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${
                      puzzle.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400" :
                      puzzle.difficulty === "medium" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {puzzle.difficulty}
                    </span>
                    <span className="text-gray-500">{puzzle.gridSize} cards</span>
                  </div>
                  
                  {isUnlocked ? (
                    <button className="w-full mt-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-sm border border-cyan-500/30 hover:bg-cyan-500/30 transition-all">
                      Play
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockPuzzle(puzzle.id, puzzle.cost)}
                      disabled={!canAfford}
                      className={`w-full mt-3 py-2 rounded-xl text-sm transition-all ${
                        canAfford
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                          : "bg-white/5 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? `Unlock 🪙 ${puzzle.cost}` : `Need 🪙 ${puzzle.cost}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MEMORY MATCH TAB ====================
function MemoryMatchTab() {
  const router = useRouter();
  
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🃏</div>
      <h2 className="text-2xl font-bold mb-2">Memory Match</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Test your memory! Flip cards to match city landmarks, famous faces, and world wonders. 
        Faster matches = higher scores.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        {[
          { label: "Easy", desc: "4 cards", time: "30 sec", icon: "🟢" },
          { label: "Medium", desc: "8 cards", time: "60 sec", icon: "🟡" },
          { label: "Hard", desc: "16 cards", time: "90 sec", icon: "🔴" },
        ].map(mode => (
          <button
            key={mode.label}
            onClick={() => router.push(`/dashboard/memory?difficulty=${mode.label.toLowerCase()}`)}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all group"
          >
            <div className="text-3xl mb-2">{mode.icon}</div>
            <div className="font-bold mb-1">{mode.label}</div>
            <div className="text-xs text-gray-500">{mode.desc}</div>
            <div className="text-xs text-gray-600 mt-1">{mode.time}</div>
          </button>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        Daily challenge resets at midnight • Leaderboard updates hourly
      </div>
    </div>
  );
}