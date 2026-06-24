"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHAPTERS, getChapterIndex, getTotalDistance } from "@/data/chapters";

interface PlayerProgress {
  completedChapters: string[];
  currentChapter: string;
  totalXP: number;
  totalGold: number;
  stamps: string[];
  totalDistanceTraveled: number;
}

export default function WorldMapPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<PlayerProgress>({
    completedChapters: [],
    currentChapter: "sahara",
    totalXP: 0,
    totalGold: 150,
    stamps: [],
    totalDistanceTraveled: 0,
  });
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("worldquest_progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const isUnlocked = (chapterId: string) => {
    const idx = getChapterIndex(chapterId);
    if (idx === 0) return true;
    return progress.completedChapters.includes(CHAPTERS[idx - 1].id);
  };

  const isCompleted = (chapterId: string) => progress.completedChapters.includes(chapterId);
  const isCurrent = (chapterId: string) => progress.currentChapter === chapterId;

  const handleCityClick = (chapterId: string) => {
    if (!isUnlocked(chapterId)) return;
    router.push(`/adventure/${chapterId}`);
  };

  const completedCount = progress.completedChapters.length;
  const totalDistance = getTotalDistance();
  const progressPercent = Math.round((completedCount / CHAPTERS.length) * 100);

  const getCityPosition = (index: number, total: number) => {
    const x = 10 + (index / (total - 1)) * 80;
    const y = 30 + Math.sin((index / (total - 1)) * Math.PI) * 25;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle world map background */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1000 500" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M200,150 Q250,100 300,130 T400,120 Q500,100 600,140 T750,130 Q850,110 900,150" />
          <path d="M150,250 Q200,200 280,230 T400,220 Q500,200 620,240 T750,230 Q850,210 920,250" />
          <path d="M180,350 Q240,300 320,330 T450,320 Q550,300 680,340 T800,330 Q880,310 940,350" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ textShadow: "0 0 40px rgba(168,85,247,0.4)" }}>WorldQuest</h1>
          <p className="text-sm text-gray-400">Journey Across the Globe</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-amber-400">🪙 {progress.totalGold}</span>
          <span className="text-cyan-400">✨ {progress.totalXP} XP</span>
          <span className="text-purple-400">🎫 {completedCount}/{CHAPTERS.length} Cities</span>
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-all"
          >
            📊 Dashboard
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>World Exploration</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {progress.totalDistanceTraveled > 0 ? `${progress.totalDistanceTraveled.toLocaleString()} km traveled` : "Begin your journey"}
        </div>
      </div>

      {/* Travel Path Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
        {CHAPTERS.slice(0, -1).map((chapter, i) => {
          const start = getCityPosition(i, CHAPTERS.length);
          const end = getCityPosition(i + 1, CHAPTERS.length);
          const isPathCompleted = isCompleted(chapter.id);
          return (
            <line
              key={`path-${chapter.id}`}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke={isPathCompleted ? "#22d3ee" : "#333"}
              strokeWidth="2"
              strokeDasharray={isPathCompleted ? "0" : "6,6"}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* City Nodes */}
      <div className="relative z-10 w-full" style={{ height: "calc(100vh - 200px)" }}>
        {CHAPTERS.map((chapter, index) => {
          const pos = getCityPosition(index, CHAPTERS.length);
          const unlocked = isUnlocked(chapter.id);
          const completed = isCompleted(chapter.id);
          const current = isCurrent(chapter.id);
          const hovered = hoveredCity === chapter.id;

          return (
            <button
              key={chapter.id}
              onClick={() => handleCityClick(chapter.id)}
              onMouseEnter={() => setHoveredCity(chapter.id)}
              onMouseLeave={() => setHoveredCity(null)}
              disabled={!unlocked}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${unlocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-30'}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {(current || completed) && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: completed ? chapter.themeColor : chapter.accentColor }} />
              )}

              <div
                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${hovered ? 'scale-125' : ''}`}
                style={{
                  background: completed
                    ? `linear-gradient(135deg, ${chapter.themeColor}50, ${chapter.accentColor}30)`
                    : unlocked
                      ? `linear-gradient(135deg, ${chapter.themeColor}30, transparent)`
                      : "rgba(30,30,30,0.8)",
                  border: `2px solid ${completed ? chapter.themeColor : unlocked ? chapter.accentColor : '#444'}`,
                  boxShadow: hovered ? `0 0 30px ${chapter.themeColor}50` : completed ? `0 0 20px ${chapter.themeColor}30` : 'none',
                }}
              >
                {completed ? (
                  <span className="text-xl md:text-2xl">✈️</span>
                ) : unlocked ? (
                  <span className="text-xl md:text-2xl">📍</span>
                ) : (
                  <span className="text-lg">🔒</span>
                )}
              </div>

              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all ${hovered ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                <div className="text-xs md:text-sm font-bold" style={{ color: completed ? chapter.themeColor : unlocked ? chapter.accentColor : '#666' }}>
                  {chapter.name}
                </div>
                <div className="text-[10px] md:text-xs text-gray-500">{chapter.subtitle}</div>
                {completed && <div className="text-[10px] text-cyan-400 mt-0.5">✓ Conquered</div>}
                {current && !completed && <div className="text-[10px] text-amber-400 mt-0.5 animate-pulse">→ Current</div>}
                {!unlocked && chapter.distanceFromPrev && (
                  <div className="text-[10px] text-gray-600 mt-0.5">{chapter.distanceFromPrev.toLocaleString()} km</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Passport Preview */}
      <div className="fixed bottom-6 left-6 z-20">
        <div className="p-4 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-sm">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Passport</div>
          <div className="flex gap-1.5">
            {CHAPTERS.map(c => (
              <div
                key={c.id}
                className={`w-8 h-10 rounded-md flex items-center justify-center text-xs border ${isCompleted(c.id) ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/5 bg-white/5'}`}
                title={c.name}
              >
                {isCompleted(c.id) ? '✓' : '·'}
              </div>
            ))}
          </div>
          <div className="text-[10px] text-gray-600 mt-1.5">{completedCount}/{CHAPTERS.length} stamps collected</div>
        </div>
      </div>

      {/* Region legend */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="p-3 rounded-xl bg-black/80 border border-white/10 backdrop-blur-sm">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Regions</div>
          <div className="space-y-1">
            {Array.from(new Set(CHAPTERS.map(c => c.region))).map(region => (
              <div key={region} className="flex items-center gap-2 text-[10px] text-gray-400">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                {region}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}