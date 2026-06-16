"use client";

import { useEffect, useState } from "react";

export default function XPPopup({ amount, onComplete }: { amount: number, onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ animation: 'slide-up 0.4s ease-out' }}>
      <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(59,130,246,0.4)] border border-blue-400/20">
        <span className="text-xl">✨</span>
        <span>+{amount} XP</span>
      </div>
    </div>
  );
}