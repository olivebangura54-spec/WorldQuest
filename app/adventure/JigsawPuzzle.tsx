"use client";

import { useState, useEffect, useCallback, useRef } from "react";
interface Props {
  playerLevel: number;
  realmNumber: number;
  onComplete: () => void;
  onExit: () => void;
  customImage?: string;
}
const REALM_IMAGES = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
];

interface Piece {
  id: number;
  correctPos: number;
  currentPos: number;
  rotation: number;
}

const BASE_COSTS = { peek: 15, rotateHint: 25, solvePiece: 50, fullSolve: 200 };
const DAILY_ALLOWANCES = { peek: 2, rotateHint: 1, solvePiece: 0, fullSolve: 0 };
const BUNDLES = {
  rotate3: { count: 3, cost: 60, save: 15, label: "3× Rotate" },
  peek5: { count: 5, cost: 55, save: 20, label: "5× Peek" },
  mixed: { rotate: 2, peek: 3, cost: 85, save: 30, label: "Mixed Pack" },
};
const AD_REWARD = { rotateHint: 1, peek: 2, gold: 10 };
const AD_COOLDOWN = { maxPerHour: 5, streakBonusThreshold: 3 };

interface HourlyAdData {
  hourTimestamp: number;
  count: number;
  lastAdTime: number;
  streak: number;
}

interface DailyUsage {
  date: string;
  peek: number;
  rotateHint: number;
  solvePiece: number;
  fullSolve: number;
  adsWatched: number;
}

interface Inventory {
  skipTickets: number;
}

export default function JigsawPuzzle({ playerLevel, realmNumber, onComplete, onExit, customImage }: Props) {
  const getGridSize = () => {
    if (playerLevel <= 2) return { cols: 3, rows: 2 };
    if (playerLevel <= 4) return { cols: 4, rows: 3 };
    if (playerLevel <= 6) return { cols: 5, rows: 4 };
    return { cols: 6, rows: 4 };
  };

  const { cols, rows } = getGridSize();
  const totalPieces = cols * rows;
const imageUrl = customImage || REALM_IMAGES[(realmNumber - 1) % REALM_IMAGES.length];
  const rotationEnabled = playerLevel >= 4;

  const [pieces, setPieces] = useState<Piece[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const [gold, setGold] = useState(150);
  const [xp, setXp] = useState(0);
  const [inventory, setInventory] = useState<Inventory>({ skipTickets: 2 });

  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    date: new Date().toDateString(),
    peek: 0, rotateHint: 0, solvePiece: 0, fullSolve: 0, adsWatched: 0,
  });

  const [hourlyAds, setHourlyAds] = useState<HourlyAdData>({
    hourTimestamp: Date.now(), count: 0, lastAdTime: 0, streak: 0,
  });

  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adCanSkip, setAdCanSkip] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState<"rotateHint" | "peek" | "gold" | null>(null);
  const [adStreakBonus, setAdStreakBonus] = useState(false);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPeeking, setIsPeeking] = useState(false);
  const [peekCooldown, setPeekCooldown] = useState(0);
  const peekTimerRef = useRef<NodeJS.Timeout | null>(null);
  const PEEK_DURATION = 2000;
  const PEEK_COOLDOWN = 8000;

  const [showHintShop, setShowHintShop] = useState(false);
  const [showBundles, setShowBundles] = useState(false);

  const [combo, setCombo] = useState(0);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);

  // Keyboard navigation
  const [focusedPiece, setFocusedPiece] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem("worldquest_daily_hints");
    if (savedDaily) {
      const parsed: DailyUsage = JSON.parse(savedDaily);
      if (parsed.date === today) setDailyUsage(parsed);
      else {
        const fresh = { date: today, peek: 0, rotateHint: 0, solvePiece: 0, fullSolve: 0, adsWatched: 0 };
        setDailyUsage(fresh);
        localStorage.setItem("worldquest_daily_hints", JSON.stringify(fresh));
      }
    }

    const savedHourly = localStorage.getItem("worldquest_hourly_ads");
    if (savedHourly) {
      const parsed: HourlyAdData = JSON.parse(savedHourly);
      const hourAgo = Date.now() - 3600000;
      if (parsed.hourTimestamp > hourAgo) setHourlyAds(parsed);
      else {
        const fresh = { hourTimestamp: Date.now(), count: 0, lastAdTime: 0, streak: 0 };
        setHourlyAds(fresh);
        localStorage.setItem("worldquest_hourly_ads", JSON.stringify(fresh));
      }
    }

    const savedInventory = localStorage.getItem("worldquest_inventory");
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  const updateDailyUsage = (type: keyof DailyUsage) => {
    setDailyUsage(prev => {
      const next = { ...prev, [type]: (prev[type] as number) + 1 };
      localStorage.setItem("worldquest_daily_hints", JSON.stringify(next));
      return next;
    });
  };

  const updateHourlyAds = (callback: (prev: HourlyAdData) => HourlyAdData) => {
    setHourlyAds(prev => {
      const next = callback(prev);
      localStorage.setItem("worldquest_hourly_ads", JSON.stringify(next));
      return next;
    });
  };

  const updateInventory = (callback: (prev: Inventory) => Inventory) => {
    setInventory(prev => {
      const next = callback(prev);
      localStorage.setItem("worldquest_inventory", JSON.stringify(next));
      return next;
    });
  };

  const getFreeRemaining = (type: keyof typeof DAILY_ALLOWANCES) => {
    return Math.max(0, DAILY_ALLOWANCES[type] - (dailyUsage[type] as number));
  };

  const getCost = (type: keyof typeof BASE_COSTS) => {
    const freeLeft = getFreeRemaining(type);
    return freeLeft > 0 ? 0 : BASE_COSTS[type];
  };

  const canWatchAd = () => hourlyAds.count < AD_COOLDOWN.maxPerHour;
  const adsRemainingThisHour = () => Math.max(0, AD_COOLDOWN.maxPerHour - hourlyAds.count);

  const timeUntilReset = () => {
    const remaining = Math.max(0, hourlyAds.hourTimestamp + 3600000 - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize pieces
  useEffect(() => {
    const initial: Piece[] = Array.from({ length: totalPieces }, (_, i) => ({
      id: i, correctPos: i, currentPos: i,
      rotation: rotationEnabled ? Math.floor(Math.random() * 4) * 90 : 0,
    }));
    for (let i = initial.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initial[i].currentPos, initial[j].currentPos] = [initial[j].currentPos, initial[i].currentPos];
    }
    setPieces(initial);
  }, [totalPieces, rotationEnabled]);

  // Timer
  useEffect(() => {
    if (isComplete) return;
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isComplete]);

  // Check completion
  useEffect(() => {
    if (pieces.length === 0) return;
    const allCorrect = pieces.every(p => p.correctPos === p.currentPos && p.rotation === 0);
    if (allCorrect) {
      setIsComplete(true);
      const hintlessBonus = dailyUsage.peek === 0 && dailyUsage.rotateHint === 0 && dailyUsage.solvePiece === 0 ? 50 : 0;
      setXp(x => x + 100 + hintlessBonus + (combo * 10));
      if (Math.random() < 0.3) updateInventory(prev => ({ ...prev, skipTickets: prev.skipTickets + 1 }));
      setTimeout(onComplete, 2500);
    }
  }, [pieces, onComplete, combo, dailyUsage]);

  // Combo decay
  useEffect(() => {
    if (combo === 0) return;
    const timer = setTimeout(() => setCombo(0), 5000);
    return () => clearTimeout(timer);
  }, [combo]);

  // Ad countdown
  useEffect(() => {
    if (!showAd || adCanSkip) return;
    if (adCountdown <= 0) { setAdCanSkip(true); return; }
    const timer = setTimeout(() => setAdCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showAd, adCountdown, adCanSkip]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (adTimerRef.current) clearTimeout(adTimerRef.current);
    };
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete || showAd || showHintShop) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setFocusedPiece(p => (p - cols + totalPieces) % totalPieces);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedPiece(p => (p + cols) % totalPieces);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setFocusedPiece(p => (p - 1 + totalPieces) % totalPieces);
          break;
        case "ArrowRight":
          e.preventDefault();
          setFocusedPiece(p => (p + 1) % totalPieces);
          break;
        case "r":
        case "R":
          if (rotationEnabled) {
            const piece = pieces.find(p => p.currentPos === focusedPiece);
            if (piece) handleDoubleClick(piece.id);
          }
          break;
        case "Enter":
          const piece = pieces.find(p => p.currentPos === focusedPiece);
          if (piece) {
            if (selectedPiece === null) {
              setSelectedPiece(piece.id);
              setDraggedPiece(piece.id);
            } else if (selectedPiece !== piece.id) {
              handleDrop(focusedPiece);
              setSelectedPiece(null);
              setDraggedPiece(null);
            } else {
              setSelectedPiece(null);
              setDraggedPiece(null);
            }
          }
          break;
        case " ":
          e.preventDefault();
          if (rotationEnabled && !isPeeking) startPeek();
          break;
        case "Escape":
          setSelectedPiece(null);
          setDraggedPiece(null);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " && isPeeking) endPeek();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isComplete, showAd, showHintShop, pieces, focusedPiece, selectedPiece, isPeeking, rotationEnabled, cols, totalPieces]);

  const applyReward = (rewardType: "rotateHint" | "peek" | "gold", streakMultiplier: number = 1) => {
    switch (rewardType) {
      case "rotateHint":
        setDailyUsage(prev => {
          const next = { ...prev, rotateHint: Math.max(0, prev.rotateHint - 1 * streakMultiplier) };
          localStorage.setItem("worldquest_daily_hints", JSON.stringify(next));
          return next;
        });
        break;
      case "peek":
        setDailyUsage(prev => {
          const next = { ...prev, peek: Math.max(0, prev.peek - 2 * streakMultiplier) };
          localStorage.setItem("worldquest_daily_hints", JSON.stringify(next));
          return next;
        });
        break;
      case "gold":
        setGold(g => g + AD_REWARD.gold * streakMultiplier);
        break;
    }
  };

  const watchAd = (rewardType: "rotateHint" | "peek" | "gold") => {
    if (!canWatchAd()) return;
    setAdRewardPending(rewardType);
    setShowAd(true);
    setAdCountdown(5);
    setAdCanSkip(false);
    setAdStreakBonus(false);
  };

  const useSkipTicket = (rewardType: "rotateHint" | "peek" | "gold") => {
    if (inventory.skipTickets <= 0) return;
    updateInventory(prev => ({ ...prev, skipTickets: prev.skipTickets - 1 }));
    const now = Date.now();
    const isConsecutive = now - hourlyAds.lastAdTime < 300000;
    const newStreak = isConsecutive ? hourlyAds.streak + 1 : 1;
    updateHourlyAds(prev => ({
      hourTimestamp: prev.hourTimestamp,
      count: prev.count + 1,
      lastAdTime: now,
      streak: newStreak,
    }));
    updateDailyUsage("adsWatched");
    const hitBonus = newStreak > 0 && newStreak % AD_COOLDOWN.streakBonusThreshold === 0;
    applyReward(rewardType, hitBonus ? 2 : 1);
  };

  const completeAd = () => {
    if (!adRewardPending) return;
    const now = Date.now();
    const isConsecutive = now - hourlyAds.lastAdTime < 300000;
    updateHourlyAds(prev => {
      const newStreak = isConsecutive ? prev.streak + 1 : 1;
      if (newStreak > 0 && newStreak % AD_COOLDOWN.streakBonusThreshold === 0) setAdStreakBonus(true);
      return {
        hourTimestamp: prev.hourTimestamp,
        count: prev.count + 1,
        lastAdTime: now,
        streak: newStreak,
      };
    });
    updateDailyUsage("adsWatched");
    applyReward(adRewardPending, adStreakBonus ? 2 : 1);
    setShowAd(false);
    setAdRewardPending(null);
  };

  const skipAd = () => {
    setShowAd(false);
    setAdRewardPending(null);
    updateHourlyAds(prev => ({ ...prev, streak: 0 }));
  };

  const startPeek = useCallback(() => {
    if (isComplete) return;
    const cost = getCost("peek");
    if (cost > 0 && gold < cost) { setShowHintShop(true); return; }
    if (peekCooldown > 0) return;
    if (cost > 0) setGold(g => g - cost);
    updateDailyUsage("peek");
    setIsPeeking(true);
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    peekTimerRef.current = setTimeout(() => {
      setIsPeeking(false);
      setPeekCooldown(PEEK_COOLDOWN / 1000);
    }, PEEK_DURATION);
  }, [peekCooldown, isComplete, gold, dailyUsage]);

  const endPeek = useCallback(() => {
    if (!isPeeking) return;
    setIsPeeking(false);
    setPeekCooldown(PEEK_COOLDOWN / 1000);
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
  }, [isPeeking]);

  useEffect(() => {
    if (peekCooldown <= 0) return;
    const timer = setInterval(() => {
      setPeekCooldown(c => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [peekCooldown]);

  const buyRotateHint = () => {
    const cost = getCost("rotateHint");
    if (cost > 0 && gold < cost) { setShowHintShop(true); return; }
    const wrongPiece = pieces.find(p => p.correctPos === p.currentPos && p.rotation !== 0)
      || pieces.find(p => p.correctPos !== p.currentPos || p.rotation !== 0);
    if (!wrongPiece) return;
    if (cost > 0) setGold(g => g - cost);
    updateDailyUsage("rotateHint");
    setPieces(prev => prev.map(p => p.id === wrongPiece.id ? { ...p, rotation: 0 } : p));
    if (wrongPiece.correctPos === wrongPiece.currentPos) incrementCombo();
  };

  const buySolvePiece = () => {
    const cost = getCost("solvePiece");
    if (cost > 0 && gold < cost) { setShowHintShop(true); return; }
    const wrongPiece = pieces.find(p => p.correctPos !== p.currentPos || p.rotation !== 0);
    if (!wrongPiece) return;
    if (cost > 0) setGold(g => g - cost);
    updateDailyUsage("solvePiece");
    setPieces(prev => prev.map(p => p.id === wrongPiece.id ? { ...p, currentPos: p.correctPos, rotation: 0 } : p));
    incrementCombo();
  };

  const buyFullSolve = () => {
    const cost = getCost("fullSolve");
    if (cost > 0 && gold < cost) { setShowHintShop(true); return; }
    if (cost > 0) setGold(g => g - cost);
    updateDailyUsage("fullSolve");
    setPieces(prev => prev.map(p => ({ ...p, currentPos: p.correctPos, rotation: 0 })));
  };

  const buyBundle = (bundleKey: keyof typeof BUNDLES) => {
    const bundle = BUNDLES[bundleKey];
    if (gold < bundle.cost) { setShowHintShop(true); return; }
    setGold(g => g - bundle.cost);
    if ("count" in bundle && !("rotate" in bundle)) {
      for (let i = 0; i < bundle.count; i++) updateDailyUsage("peek");
    } else if ("count" in bundle) {
      for (let i = 0; i < bundle.count; i++) updateDailyUsage("rotateHint");
    } else if ("rotate" in bundle && "peek" in bundle) {
      for (let i = 0; i < bundle.rotate; i++) updateDailyUsage("rotateHint");
      for (let i = 0; i < bundle.peek; i++) updateDailyUsage("peek");
    }
    setShowBundles(false);
  };

  const incrementCombo = () => {
    const now = Date.now();
    if (now - lastCorrectTime < 3000) setCombo(c => c + 1);
    else setCombo(1);
    setLastCorrectTime(now);
  };

  const handleDragStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
    setSelectedPiece(pieceId);
  };

  const handleDrop = (targetPos: number) => {
    if (draggedPiece === null) return;
    setPieces(prev => {
      const newPieces = [...prev];
      const draggedIdx = newPieces.findIndex(p => p.id === draggedPiece);
      const targetIdx = newPieces.findIndex(p => p.currentPos === targetPos);
      if (draggedIdx !== -1 && targetIdx !== -1 && draggedIdx !== targetIdx) {
        const temp = newPieces[draggedIdx].currentPos;
        newPieces[draggedIdx].currentPos = newPieces[targetIdx].currentPos;
        newPieces[targetIdx].currentPos = temp;
      }
      return newPieces;
    });
    setMoves(m => m + 1);
    setDraggedPiece(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handlePieceClick = (pieceId: number) => {
    if (!rotationEnabled) return;
    if (selectedPiece === pieceId) {
      setPieces(prev => prev.map(p => p.id === pieceId ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
      setMoves(m => m + 1);
    } else {
      setSelectedPiece(pieceId);
    }
  };

  const handleDoubleClick = (pieceId: number) => {
    if (!rotationEnabled) return;
    setPieces(prev => prev.map(p => p.id === pieceId ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    setMoves(m => m + 1);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getPieceAtPos = (pos: number) => pieces.find(p => p.currentPos === pos);
  const canAfford = (cost: number) => gold >= cost;

  const peekFreeLeft = getFreeRemaining("peek");
  const peekLabel = peekFreeLeft > 0
    ? `Hold to Peek (${peekFreeLeft} free left)`
    : `Hold to Peek (🪙 ${BASE_COSTS.peek})`;

  const streakBonusActive = hourlyAds.streak > 0 && hourlyAds.streak % AD_COOLDOWN.streakBonusThreshold === 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 md:p-8">
      {/* Ad Overlay */}
      {showAd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
          <div className="w-full max-w-lg p-8 text-center">
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-gray-400 text-lg">Advertisement</p>
                  <p className="text-gray-600 text-sm mt-2">Your reward unlocks in...</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${((5 - adCountdown) / 5) * 100}%` }} />
              </div>
            </div>

            {adStreakBonus && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm animate-pulse">
                🔥 Streak Bonus Active! Reward ×2
              </div>
            )}

            {inventory.skipTickets > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm text-cyan-300 mb-2">You have {inventory.skipTickets} skip ticket{inventory.skipTickets > 1 ? 's' : ''}</p>
                <button
                  onClick={() => {
                    if (adRewardPending) {
                      useSkipTicket(adRewardPending);
                      setShowAd(false);
                      setAdRewardPending(null);
                    }
                  }}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-cyan-300 hover:text-white transition-all hover:scale-105"
                  style={{ border: "1px solid rgba(34,211,238,0.4)", background: "rgba(34,211,238,0.1)" }}
                >
                  Use Skip Ticket 🎫 (instant reward)
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              {!adCanSkip ? (
                <div className="text-gray-500 text-sm">Skip in {adCountdown}s...</div>
              ) : (
                <>
                  <button
                    onClick={completeAd}
                    className="px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #9333ea, #06b6d4)", boxShadow: "0 0 30px rgba(147,51,234,0.4)" }}
                  >
                    Claim Reward ✦
                  </button>
                  <button onClick={skipAd} className="px-6 py-3 rounded-2xl text-sm text-gray-500 hover:text-white transition-colors">
                    Skip (breaks streak)
                  </button>
                </>
              )}
            </div>

            <p className="mt-6 text-xs text-gray-600">Watching ads supports the realm and earns you free hints</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors text-sm tracking-widest">← EXIT</button>
        <div className="text-center">
          <span className="text-xs tracking-[0.4em] text-cyan-400 uppercase block mb-1">Realm {realmNumber}</span>
          <h2 className="text-xl font-bold">The Shattered Vision</h2>
        </div>
        <div className="text-right flex items-center gap-4">
          {combo > 1 && <span className="text-amber-400 text-sm font-bold animate-pulse">🔥 {combo}x</span>}
          {hourlyAds.streak > 0 && (
            <span className={`text-sm font-medium ${streakBonusActive ? 'text-amber-400 animate-pulse' : 'text-orange-400/60'}`}>⚡ {hourlyAds.streak}</span>
          )}
          {inventory.skipTickets > 0 && <span className="text-cyan-400 text-sm font-medium" title="Skip Tickets">🎫 {inventory.skipTickets}</span>}
          <div>
            <div className="text-sm text-amber-400 font-medium">{gold} 🪙</div>
            <div className="text-xs text-gray-500">{formatTime(timeElapsed)} • {moves} moves</div>
          </div>
        </div>
      </div>

      {/* Reference Image */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button onClick={() => setShowPreview(!showPreview)} className="text-sm text-cyan-400/60 hover:text-cyan-300 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showPreview ? "Hide reference" : "Show reference"}
        </button>
        <div className="text-xs text-gray-600 flex items-center gap-3">
          <span>{cols}×{rows} grid • {totalPieces} pieces</span>
          {rotationEnabled && <span className="text-amber-400">• Rotation ON</span>}
        </div>
      </div>

      {showPreview && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-white/10" style={{ maxWidth: 300 }}>
          <img src={imageUrl} alt="Reference" className="w-full h-auto block" draggable={false} />
          <div className="px-3 py-2 bg-white/5 text-xs text-center text-gray-500">Reference Image</div>
        </div>
      )}

      {/* Peek Button */}
      {rotationEnabled && !isComplete && (
        <button
          onMouseDown={startPeek}
          onMouseUp={endPeek}
          onMouseLeave={endPeek}
          onTouchStart={startPeek}
          onTouchEnd={endPeek}
          disabled={peekCooldown > 0}
          className={`mb-3 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none ${peekCooldown > 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          style={{ background: isPeeking ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.1)', border: isPeeking ? '1px solid rgba(168,85,247,0.6)' : '1px solid rgba(168,85,247,0.3)', boxShadow: isPeeking ? '0 0 30px rgba(168,85,247,0.3)' : 'none' }}
        >
          {isPeeking ? (
            <span className="flex items-center gap-2 text-purple-200">
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              </svg>
              Peeking...
            </span>
          ) : peekCooldown > 0 ? (
            <span className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recharging... {peekCooldown}s
            </span>
          ) : (
            <span className="flex items-center gap-2 text-purple-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              </svg>
              {peekLabel}
            </span>
          )}
        </button>
      )}

      {/* Hint Shop Buttons */}
      {rotationEnabled && !isComplete && (
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => { setShowHintShop(true); setShowBundles(false); }} className="px-4 py-2 rounded-full text-sm text-amber-400/70 hover:text-amber-300 transition-all hover:scale-105" style={{ border: "1px solid rgba(251,191,36,0.2)", background: "rgba(251,191,36,0.05)" }}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Hint Shop
            </span>
          </button>
          <button onClick={() => { setShowHintShop(true); setShowBundles(true); }} className="px-4 py-2 rounded-full text-sm text-emerald-400/70 hover:text-emerald-300 transition-all hover:scale-105" style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)" }}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Bundles
            </span>
          </button>
        </div>
      )}

      {/* Hint Shop Overlay */}
      {showHintShop && !isComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-8 rounded-3xl max-h-[90vh] overflow-y-auto" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(34,211,238,0.05))", border: "1px solid rgba(168,85,247,0.3)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-purple-300">{showBundles ? "Hint Bundles" : "Oracle's Favors"}</h3>
              <button onClick={() => setShowHintShop(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>

            <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
              <span>Your gold:</span>
              <span className="text-amber-400 font-bold text-lg">{gold} 🪙</span>
              {inventory.skipTickets > 0 && <span className="text-cyan-400 font-bold text-lg ml-2">🎫 {inventory.skipTickets}</span>}
            </div>

            {!showBundles && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-blue-400 uppercase tracking-widest">Free via Ad</div>
                  {hourlyAds.streak > 0 && (
                    <div className={`text-xs ${streakBonusActive ? 'text-amber-400 font-bold animate-pulse' : 'text-orange-400/60'}`}>⚡ Streak: {hourlyAds.streak}</div>
                  )}
                </div>

                {!canWatchAd() && (
                  <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-center">Ad limit reached. Resets in {timeUntilReset()}.</div>
                )}

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${(hourlyAds.count / AD_COOLDOWN.maxPerHour) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{hourlyAds.count}/{AD_COOLDOWN.maxPerHour}</span>
                </div>

                <div className="space-y-2">
                  <AdButton label="Watch Ad" reward="1 free Rotate Hint" icon="🔄" disabled={!canWatchAd()} skipAvailable={inventory.skipTickets > 0} onWatch={() => watchAd("rotateHint")} onSkip={() => useSkipTicket("rotateHint")} />
                  <AdButton label="Watch Ad" reward="2 free Peek charges" icon="👁️" disabled={!canWatchAd()} skipAvailable={inventory.skipTickets > 0} onWatch={() => watchAd("peek")} onSkip={() => useSkipTicket("peek")} />
                  <AdButton label="Watch Ad" reward="10 🪙 gold" icon="🪙" disabled={!canWatchAd()} skipAvailable={inventory.skipTickets > 0} onWatch={() => watchAd("gold")} onSkip={() => useSkipTicket("gold")} />
                </div>

                <div className="mt-3 text-xs text-gray-600 text-center">{dailyUsage.adsWatched} ads watched today • {adsRemainingThisHour()} left this hour</div>
                {streakBonusActive && <div className="mt-2 text-xs text-amber-400 text-center animate-pulse">🔥 Next ad reward ×2! Keep the streak alive!</div>}
              </div>
            )}

            {!showBundles && (
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Daily Free Hints</div>
                <div className="space-y-2">
                  {Object.entries(DAILY_ALLOWANCES).map(([type, allowance]) => {
                    if (allowance === 0) return null;
                    const used = dailyUsage[type as keyof DailyUsage] as number;
                    const remaining = Math.max(0, allowance - used);
                    const percent = (remaining / allowance) * 100;
                    return (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 capitalize">{type === "rotateHint" ? "Rotate" : type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }} />
                          </div>
                          <span className={`text-xs ${remaining > 0 ? 'text-cyan-400' : 'text-gray-600'}`}>{remaining}/{allowance}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-600">Resets daily at midnight</div>
              </div>
            )}

            {!showBundles && (
              <div className="space-y-3">
                <HintButton label="Rotate Piece" desc="Correct one piece's rotation" cost={getCost("rotateHint")} baseCost={BASE_COSTS.rotateHint} freeLeft={getFreeRemaining("rotateHint")} canAfford={canAfford(getCost("rotateHint"))} onClick={buyRotateHint} />
                <HintButton label="Place Piece" desc="Instantly solve one piece" cost={getCost("solvePiece")} baseCost={BASE_COSTS.solvePiece} freeLeft={getFreeRemaining("solvePiece")} canAfford={canAfford(getCost("solvePiece"))} onClick={buySolvePiece} />
                <HintButton label="Reveal All" desc="Solve entire puzzle — no XP reward" cost={getCost("fullSolve")} baseCost={BASE_COSTS.fullSolve} freeLeft={getFreeRemaining("fullSolve")} canAfford={canAfford(getCost("fullSolve"))} onClick={buyFullSolve} danger />
              </div>
            )}

            {showBundles && (
              <div className="space-y-3">
                {Object.entries(BUNDLES).map(([key, bundle]) => (
                  <button key={key} onClick={() => buyBundle(key as keyof typeof BUNDLES)} disabled={!canAfford(bundle.cost)} className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${canAfford(bundle.cost) ? 'hover:scale-[1.02]' : 'opacity-40 cursor-not-allowed'}`} style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <div className="text-left">
                      <div className="font-medium text-emerald-300">{bundle.label}</div>
                      <div className="text-xs text-gray-500">Save 🪙 {bundle.save}</div>
                    </div>
                    <div className={`font-bold ${canAfford(bundle.cost) ? 'text-emerald-400' : 'text-gray-600'}`}>🪙 {bundle.cost}</div>
                  </button>
                ))}
                <button onClick={() => setShowBundles(false)} className="w-full mt-4 py-3 rounded-2xl text-sm text-gray-400 hover:text-white transition-colors" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>← Back to Individual Hints</button>
              </div>
            )}

            <p className="mt-6 text-xs text-gray-600 text-center">Using hints reduces final XP reward. Solve without hints for maximum bonus.</p>
          </div>
        </div>
      )}

      {/* Puzzle Grid */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 select-none" style={{ width: "min(90vw, 600px)", aspectRatio: `${cols}/${rows}` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", filter: "grayscale(100%) brightness(0.3)" }} />
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: totalPieces }, (_, pos) => {
            const piece = getPieceAtPos(pos);
            if (!piece) return null;
            const row = Math.floor(piece.correctPos / cols);
            const col = piece.correctPos % cols;
            const isSelected = selectedPiece === piece.id;
            const isCorrectPos = piece.correctPos === piece.currentPos;
            const isCorrectRotation = piece.rotation === 0;
            const isFullyCorrect = isCorrectPos && isCorrectRotation;
            const displayRotation = isPeeking ? 0 : piece.rotation;
            const isFocused = focusedPiece === pos;

            return (
              <div
                key={pos}
                tabIndex={0}
                role="button"
                aria-label={`Piece ${pos + 1} of ${totalPieces}${isFullyCorrect ? ', correctly placed' : isCorrectPos ? ', correct position, needs rotation' : ', misplaced'}`}
                className={`relative border border-white/5 cursor-pointer transition-all duration-200 ${draggedPiece === piece.id ? 'opacity-50 scale-95' : ''} ${isSelected && !isPeeking ? 'ring-2 ring-amber-400/60 z-10' : ''} ${isFocused ? 'ring-2 ring-white/30' : ''} ${isFullyCorrect ? '' : 'hover:brightness-125'}`}
                draggable
                onDragStart={() => handleDragStart(piece.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(pos)}
                onClick={() => handlePieceClick(piece.id)}
                onDoubleClick={() => handleDoubleClick(piece.id)}
                onFocus={() => setFocusedPiece(pos)}
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${cols * 100}% ${rows * 100}%`,
                  backgroundPosition: `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
                  transform: `rotate(${displayRotation}deg)`,
                  filter: isPeeking && !isFullyCorrect ? 'brightness(1.3) saturate(1.2)' : 'none',
                  outline: 'none',
                }}
              >
                {rotationEnabled && !isFullyCorrect && !isPeeking && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/40 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </div>
                )}
                {isCorrectPos && !isCorrectRotation && !isPeeking && <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-amber-400/60" />}
                {isFullyCorrect && <div className="absolute inset-0 border border-cyan-400/30" />}
                {isPeeking && !isFullyCorrect && <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />}
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            <div className="text-4xl mb-4 animate-pulse">✦</div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">The Vision Restored</h3>
            <p className="text-gray-400 text-sm">The realm opens before you...</p>
            {xp > 0 && <p className="text-amber-400 text-sm mt-2">+{xp} XP earned</p>}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isComplete && (
        <div className="mt-6 text-sm text-gray-500 text-center max-w-md space-y-1">
          <p>Drag pieces to swap positions.</p>
          {rotationEnabled && <p className="text-amber-400/70">Click to select, click again to rotate. Double-click for instant rotate. Hold Peek to glimpse correct rotations.</p>}
          <p className="text-xs text-gray-600">Keyboard: Arrow keys to navigate, Enter to select/swap, R to rotate, Space to peek, Escape to cancel.</p>
        </div>
      )}

      {/* Progress dots */}
      <div className="mt-4 flex items-center gap-1.5 flex-wrap justify-center max-w-md">
        {Array.from({ length: totalPieces }, (_, i) => {
          const piece = pieces.find(p => p.correctPos === i);
          const isCorrect = piece?.currentPos === i && piece?.rotation === 0;
          return <div key={i} className={`w-2 h-2 rounded-full transition-colors ${isCorrect ? 'bg-cyan-400' : 'bg-white/10'}`} />;
        })}
      </div>

      {rotationEnabled && selectedPiece !== null && !isComplete && !isPeeking && (
        <div className="mt-4 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">Piece selected — click again to rotate, or drag to swap</div>
      )}
    </div>
  );
}

function HintButton({ label, desc, cost, baseCost, freeLeft, canAfford, onClick, danger }: {
  label: string; desc: string; cost: number; baseCost: number; freeLeft: number; canAfford: boolean; onClick: () => void; danger?: boolean;
}) {
  const isFree = cost === 0 && freeLeft > 0;
  return (
    <button onClick={onClick} disabled={!canAfford && !isFree} className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${canAfford || isFree ? 'hover:scale-[1.02]' : 'opacity-40 cursor-not-allowed'}`} style={{ background: danger ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)", border: danger ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.1)" }}>
      <div className="text-left">
        <div className={`font-medium ${danger ? 'text-red-300' : 'text-white'}`}>{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
        {freeLeft > 0 && <div className="text-xs text-cyan-400 mt-1">{freeLeft} free today</div>}
      </div>
      <div className={`font-bold ${isFree ? 'text-cyan-400' : canAfford ? (danger ? 'text-red-400' : 'text-amber-400') : 'text-gray-600'}`}>
        {isFree ? "FREE" : `🪙 ${cost}`}
        {baseCost !== cost && !isFree && <span className="text-xs text-gray-600 line-through ml-1">🪙 {baseCost}</span>}
      </div>
    </button>
  );
}

function AdButton({ label, reward, icon, disabled, skipAvailable, onWatch, onSkip }: {
  label: string; reward: string; icon: string; disabled: boolean; skipAvailable: boolean; onWatch: () => void; onSkip: () => void;
}) {
  return (
    <div className={`w-full p-3 rounded-xl transition-all ${disabled && !skipAvailable ? 'opacity-30' : 'bg-white/5 hover:bg-white/10'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="text-left">
            <div className="text-sm text-white">{label}</div>
            <div className="text-xs text-gray-500">Earn {reward}</div>
          </div>
        </div>
        <span className="text-xs text-blue-400 font-medium">{disabled && !skipAvailable ? "LIMIT" : "FREE"}</span>
      </div>
      {skipAvailable && (
        <button onClick={onSkip} className="w-full mt-2 py-2 rounded-lg text-xs text-cyan-300 hover:text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2" style={{ border: "1px dashed rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.05)" }}>
          <span>🎫</span>
          <span>Use Skip Ticket (instant, no ad)</span>
        </button>
      )}
      {!disabled && (
        <button onClick={onWatch} className="w-full mt-2 py-2 rounded-lg text-xs text-blue-300 hover:text-white transition-all hover:scale-[1.02]" style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>Watch Ad</button>
      )}
    </div>
  );
}