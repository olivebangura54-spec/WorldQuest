"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const hoverRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.volume = soundEnabled ? volume * 0.5 : 0;
    }
    if (hoverRef.current) {
      hoverRef.current.volume = soundEnabled ? volume * 0.3 : 0;
    }
  }, [volume, soundEnabled]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current = null;
      }
      if (hoverRef.current) {
        hoverRef.current.pause();
        hoverRef.current = null;
      }
    };
  }, []);

  const enterRealm = useCallback(() => {
    ambientRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=ambient-pad-112198.mp3");
    ambientRef.current.volume = soundEnabled ? volume * 0.5 : 0;
    ambientRef.current.loop = true;
    if (soundEnabled) {
      ambientRef.current.play().catch(() => {});
    }

    const enterSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=magic-wand-6215.mp3");
    enterSound.volume = soundEnabled ? volume : 0;
    if (soundEnabled) {
      enterSound.play().catch(() => {});
    }

    setEntered(true);
    setTimeout(() => setIsVisible(true), 100);
  }, [soundEnabled, volume]);

  const playHoverSound = () => {
    if (!soundEnabled) return;
    if (!hoverRef.current) {
      hoverRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=soft-wind-whoosh-113127.mp3");
      hoverRef.current.volume = volume * 0.3;
    }
    hoverRef.current.currentTime = 0;
    hoverRef.current.play().catch(() => {});
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      if (ambientRef.current) {
        ambientRef.current.volume = next ? volume * 0.5 : 0;
        if (next && ambientRef.current.paused) {
          ambientRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleMainCTA = () => {
    if (user) router.push("/dashboard");
    else router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-[120%]"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/2c/17/25/2c17258341ea81413a28109e8ef8b4a0.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 70%",
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      <div className="fixed inset-0" style={{
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)"
      }} />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 1 + Math.random() * 3,
              height: 1 + Math.random() * 3,
              background: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#a78bfa" : "#67e8f9",
              opacity: 0.2 + Math.random() * 0.4,
              animation: `float ${5 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Sound Controls — visible after entering */}
      {entered && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
          {/* Volume Slider */}
          <div 
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(168,85,247,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(168,85,247,0.6) ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
            />
            <span className="text-xs text-purple-300 w-8 text-right">{Math.round(volume * 100)}%</span>
          </div>

          {/* Volume Button (shows/hides slider) */}
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(168,85,247,0.3)",
              backdropFilter: "blur(10px)",
            }}
            title="Volume"
          >
            {volume === 0 ? (
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : volume < 0.5 ? (
              <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(168,85,247,0.3)",
              backdropFilter: "blur(10px)",
            }}
            title={soundEnabled ? "Mute" : "Unmute"}
          >
            {soundEnabled ? (
              <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ═══════ ENTRANCE SCREEN ═══════ */}
      {!entered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}>
          <button
            onClick={enterRealm}
            className="group relative flex flex-col items-center gap-6 p-12 rounded-3xl transition-all duration-500 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow: "0 0 60px rgba(168,85,247,0.15), inset 0 0 60px rgba(168,85,247,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)";
              e.currentTarget.style.boxShadow = "0 0 80px rgba(168,85,247,0.3), inset 0 0 80px rgba(168,85,247,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
              e.currentTarget.style.boxShadow = "0 0 60px rgba(168,85,247,0.15), inset 0 0 60px rgba(168,85,247,0.05)";
            }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2))",
                border: "1px solid rgba(168,85,247,0.4)",
                boxShadow: "0 0 40px rgba(168,85,247,0.3)",
              }}>
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2" style={{
                textShadow: "0 0 30px rgba(168,85,247,0.5)"
              }}>
                Enter the Realm
              </h2>
              <p className="text-sm text-gray-400">Click to begin your journey</p>
            </div>

            <div className="flex items-center gap-2 text-purple-300 text-sm animate-pulse">
              <span>Tap to enter</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="text-center transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2))",
                border: "1px solid rgba(168,85,247,0.3)",
                boxShadow: "0 0 40px rgba(168,85,247,0.2)",
              }}>
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-2"
            style={{
              textShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(34,211,238,0.2), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            World<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">Quest</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-2 tracking-wide"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            Step Into the Unknown
          </p>

          <p className="text-sm text-gray-400 max-w-md mx-auto mb-10"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
            Embark on quests across mystical realms. Solve puzzles, forge alliances, and write your legend.
          </p>

          {/* CTA Buttons with hover sound */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleMainCTA}
              onMouseEnter={playHoverSound}
              className="group relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                boxShadow: "0 0 40px rgba(147,51,234,0.4), 0 0 80px rgba(6,182,212,0.2)",
              }}
            >
              <span className="flex items-center gap-2">
                Enter the Realm
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            {!user && (
              <Link
                href="/auth/signup"
                onMouseEnter={playHoverSound}
                className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Join the Adventure
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { transform: translate(20px, -15px); opacity: 0.5; }
          50% { transform: translate(-10px, 10px); opacity: 0.3; }
          75% { transform: translate(15px, 5px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}