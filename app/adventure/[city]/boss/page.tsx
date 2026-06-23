"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChapter, getChapterIndex, getNextChapter, CHAPTERS } from "@/data/chapters";
import RiddlePuzzle from "../../RiddlePuzzle";
import JigsawPuzzle from "../../JigsawPuzzle";

interface PlayerProgress {
  completedChapters: string[];
  currentChapter: string;
  totalXP: number;
  totalGold: number;
  stamps: string[];
  totalDistanceTraveled: number;
}

export default function BossPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.city as string;
  const chapter = getChapter(cityId);

  const [progress, setProgress] = useState<PlayerProgress>({
    completedChapters: [],
    currentChapter: "sahara",
    totalXP: 0,
    totalGold: 150,
    stamps: [],
    totalDistanceTraveled: 0,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("worldquest_progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (p: PlayerProgress) => {
    localStorage.setItem("worldquest_progress", JSON.stringify(p));
    setProgress(p);
  };

  if (!chapter) return <div className="min-h-screen bg-black text-white flex items-center justify-center">City not found</div>;

  const handlePuzzleComplete = () => {
    setIsTransitioning(true);

    const nextChapter = getNextChapter(cityId);
    const distance = chapter.distanceFromPrev || 0;

    const updated: PlayerProgress = {
      ...progress,
      completedChapters: [...new Set([...progress.completedChapters, cityId])],
      currentChapter: nextChapter?.id || cityId,
      totalXP: progress.totalXP + 250,
      totalGold: progress.totalGold + 75,
      stamps: [...new Set([...progress.stamps, cityId])],
      totalDistanceTraveled: progress.totalDistanceTraveled + distance,
    };

    setTimeout(() => {
      saveProgress(updated);
      if (nextChapter) {
        router.push(`/adventure/${nextChapter.id}`);
      } else {
        router.push("/adventure");
      }
    }, 3500);
  };

  const handleExit = () => {
    router.push(`/adventure/${cityId}`);
  };

  if (isTransitioning) {
    const nextChapter = getNextChapter(cityId);
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="text-6xl mb-6 animate-bounce">✈️</div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: chapter.accentColor }}>
          {chapter.name} Conquered!
        </h2>
        <p className="text-gray-400 mb-2">Passport stamp earned ✓</p>
        {nextChapter && (
          <p className="text-sm text-gray-500 mb-4">Next stop: {nextChapter.name}</p>
        )}
        <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full animate-pulse" style={{ background: chapter.themeColor, width: "100%" }} />
        </div>
        <p className="text-gray-500 text-sm mt-4">Boarding flight...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Boss Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div>
          <button onClick={handleExit} className="text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-2 transition-colors">
            ← Back to {chapter.name}
          </button>
          <h1 className="text-2xl font-bold" style={{ color: chapter.accentColor }}>
            Boss Challenge: {chapter.name}
          </h1>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          {chapter.bossPuzzle === "riddle" ? "🧩" : "🖼️"}
          <span>{chapter.bossPuzzle === "riddle" ? "Solve the riddle to proceed" : "Reassemble the vision"}</span>
        </div>
      </div>

      {/* Puzzle */}
      {chapter.bossPuzzle === "riddle" ? (
        <RiddlePuzzle
          playerLevel={3}
          realmNumber={getChapterIndex(cityId) + 1}
          onComplete={handlePuzzleComplete}
          onExit={handleExit}
          customRiddle={chapter.riddleBank?.[0]}
        />
      ) : (
        <JigsawPuzzle
          playerLevel={3}
          realmNumber={getChapterIndex(cityId) + 1}
          onComplete={handlePuzzleComplete}
          onExit={handleExit}
          customImage={chapter.jigsawImage}
        />
      )}
    </div>
  );
}