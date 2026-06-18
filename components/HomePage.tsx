"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════
   FIREFLY / EMBER PARTICLES
   ══════════════════════════════════════════════ */
function Fireflies() {
  const particles = useMemo(() => {
    const colors = [
      "rgba(251,191,36,0.7)",
      "rgba(251,146,36,0.5)",
      "rgba(240,171,252,0.4)",
      "rgba(255,255,255,0.3)",
      "rgba(168,85,247,0.4)",
    ];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 40 + Math.random() * 55,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `particle-firefly ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PARALLAX SUNSET BACKGROUND
   ══════════════════════════════════════════════ */
function SunsetBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base sky gradient — deep blue to warm sunset */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0d0b1a 0%, #1a1035 15%, #2d1b4e 25%, #4a1942 35%, #7c2d5a 45%, #c2556e 55%, #e8945a 65%, #f5b74a 75%, #f7c948 82%, #e8945a 90%, #4a1942 100%)",
        }}
      />

      {/* Stars in upper sky */}
      <div className="absolute top-0 left-0 right-0 h-[35%] overflow-hidden">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `sparkle ${3 + Math.random() * 4}s ${Math.random() * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouettes — far layer */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "55%" }}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,400 L0,280 Q120,180 240,220 Q360,140 480,200 Q560,120 680,180 Q780,100 900,160 Q1020,80 1140,140 Q1260,100 1380,180 L1440,160 L1440,400 Z"
          fill="rgba(30,15,50,0.7)"
        />
      </svg>

      {/* Mountain silhouettes — mid layer */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "45%" }}
        viewBox="0 0 1440 350"
        preserveAspectRatio="none"
      >
        <path
          d="M0,350 L0,250 Q180,160 360,200 Q500,120 660,180 Q800,100 960,170 Q1100,90 1260,150 Q1380,120 1440,180 L1440,350 Z"
          fill="rgba(25,12,45,0.85)"
        />
      </svg>

      {/* Warm glow at horizon */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "25%",
          height: "30%",
          background: "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(245,183,74,0.25) 0%, rgba(232,148,90,0.15) 40%, transparent 70%)",
        }}
      />

      {/* Front silhouette — dark ground */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "20%" }}
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 L0,60 Q100,40 200,55 Q300,30 400,50 Q500,20 600,45 Q700,25 800,40 Q900,15 1000,35 Q1100,20 1200,45 Q1300,30 1440,50 L1440,150 Z"
          fill="#0d0b1a"
        />
        {/* Grass/rock details */}
        <path
          d="M0,60 Q50,50 80,58 Q120,42 160,55 Q200,35 240,52 Q280,38 320,50 Q360,30 400,48 Q440,35 480,50 Q520,32 560,45 Q600,28 640,42 Q680,30 720,45 Q760,25 800,40 Q840,30 880,45 Q920,20 960,38 Q1000,28 1040,42 Q1080,22 1120,40 Q1160,30 1200,45 Q1240,28 1280,42 Q1320,32 1360,48 Q1400,35 1440,50 L1440,150 L0,150 Z"
          fill="#0d0b1a"
        />
      </svg>

      {/* Floating cloud wisps */}
      <div
        className="absolute left-[10%] w-[300px] h-[60px] rounded-full opacity-20"
        style={{
          top: "30%",
          background: "radial-gradient(ellipse, rgba(200,120,180,0.4), transparent)",
          filter: "blur(30px)",
          animation: "drift-right 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[15%] w-[250px] h-[50px] rounded-full opacity-15"
        style={{
          top: "35%",
          background: "radial-gradient(ellipse, rgba(245,183,74,0.3), transparent)",
          filter: "blur(25px)",
          animation: "drift-left 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-[40%] w-[400px] h-[40px] rounded-full opacity-10"
        style={{
          top: "28%",
          background: "radial-gradient(ellipse, rgba(168,85,247,0.3), transparent)",
          filter: "blur(35px)",
          animation: "drift-right 30s ease-in-out infinite",
        }}
      />

      {/* Subtle warm vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center 60%, transparent 30%, rgba(13,11,26,0.5) 80%)",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-2xl shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight font-[family-name:var(--font-cinzel)]">
            World<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Quest</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Community", href: "/dashboard" },
            { label: "Leaderboard", href: "/leaderboard" },
            { label: "Chapters", href: "/chapters" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative group font-medium"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:scale-95"
          >
            Play Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════
   MAIN HOME PAGE
   ══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden bg-[#0d0b1a]">
      <Navbar />

      {/* Parallax sunset background */}
      <SunsetBackground />

      {/* Firefly particles */}
      <Fireflies />

      {/* Hero content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Massive WorldQuest title */}
        <div style={{ animation: "fade-in 1.2s ease-out" }}>
          <h1
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] mb-4"
            style={{ animation: "slide-up-heavy 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              World
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee, #f0abfc)",
                animation: "hero-title-glow 4s ease-in-out infinite",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.3))",
              }}
            >
              Quest
            </span>
          </h1>
        </div>

        {/* Muted tagline */}
        <p
          className="text-sm sm:text-base text-white/40 max-w-md mb-10 tracking-wide font-light"
          style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}
        >
          Embark on an epic journey across five mystical chapters
        </p>

        {/* Begin Your Quest — PRIMARY CTA */}
        <div style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both" }}>
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(251,191,36,0.3)",
              boxShadow: "0 0 30px rgba(251,191,36,0.15), 0 0 60px rgba(251,191,36,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(251,191,36,0.3), 0 0 100px rgba(251,191,36,0.1)";
              e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(251,191,36,0.15), 0 0 60px rgba(251,191,36,0.05)";
              e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: "shimmer-line 2s ease-in-out infinite" }} />
            <span className="relative z-10 flex items-center gap-3">
              Begin Your Quest
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}