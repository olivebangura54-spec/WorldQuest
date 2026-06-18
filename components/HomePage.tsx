"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import MoodboardBackground from "./MoodboardBackground";

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
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 30 + Math.random() * 65,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]" aria-hidden="true">
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
   NAVBAR — moodboard style
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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Back button (moodboard style) */}
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Community", href: "/dashboard" },
            { label: "About", href: "/chapters" },
            { label: "Support", href: "/leaderboard" },
            { label: "Contact", href: "/dashboard" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Register button */}
        <Link
          href="/auth/signup"
          className="px-6 py-2.5 text-sm font-semibold text-white rounded-full border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════
   MAIN HOME PAGE — moodboard layout
   ══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#0d0b1a] overflow-hidden">
      <Navbar />

      {/* ─── Moodboard illustrated background (parallax) ─── */}
      <div className="absolute inset-0 z-0">
        <MoodboardBackground />
      </div>

      {/* ─── Firefly particles ─── */}
      <Fireflies />

      {/* ─── Hero content — left-aligned, vertically centered ─── */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto">

        {/* Small journey badge / breadcrumb */}
        <div
          className="flex items-center gap-3 mb-6"
          style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm text-white/50 tracking-wide">
            Journey to new frontiers &middot; Journey to Noto: Nature's Path
          </span>
        </div>

        {/* MASSIVE heading */}
        <div style={{ animation: "fade-in 1.2s ease-out" }}>
          <h1
            className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.85] mb-6"
            style={{ animation: "slide-up-heavy 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <span
              className="block text-white"
              style={{
                filter: "drop-shadow(0 0 40px rgba(255,255,255,0.1)) drop-shadow(0 4px 20px rgba(0,0,0,0.4))",
              }}
            >
              World
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee, #f0abfc)",
                animation: "hero-title-glow 4s ease-in-out infinite",
                filter: "drop-shadow(0 0 30px rgba(168,85,247,0.3)) drop-shadow(0 4px 20px rgba(0,0,0,0.3))",
              }}
            >
              Quest
            </span>
          </h1>
        </div>

        {/* Description text */}
        <p
          className="text-sm sm:text-base text-white/45 max-w-lg mb-10 leading-relaxed font-light"
          style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}
        >
          Explore ancient realms, discover hidden artifacts, and embark on quests
          that span across five mystical chapters. Your journey through breathtaking
          landscapes begins here.
        </p>

        {/* CTA Row */}
        <div
          className="flex items-center gap-5"
          style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both" }}
        >
          {/* Primary CTA */}
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(251,191,36,0.3)",
              boxShadow: "0 0 30px rgba(251,191,36,0.12), 0 0 60px rgba(251,191,36,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(251,191,36,0.25), 0 0 100px rgba(251,191,36,0.08)";
              e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)";
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(251,191,36,0.12), 0 0 60px rgba(251,191,36,0.04)";
              e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: "shimmer-line 2s ease-in-out infinite" }} />
            <span className="relative z-10 flex items-center gap-3">
              Start the journey
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>

          {/* Play button (moodboard style) */}
          <button
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            aria-label="Play preview"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}