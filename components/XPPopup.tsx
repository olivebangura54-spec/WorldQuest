"use client";

import { useEffect, useState } from "react";

export default function XPPopup({ amount, onComplete }: { amount: number, onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] border-2 border-blue-400 flex items-center space-x-3">
        <span className="text-2xl">✨</span>
        <span>+{amount} XP</span>
      </div>
    </div>
  );
}
