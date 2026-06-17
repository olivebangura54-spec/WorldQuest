"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

/* ───────────── Particle System ───────────── */
function Particles() {
  const [particles, setParticles] = useState<
    { id: number; x: number; size: number; duration: number; delay: number; drift: number; color: string }[]
  >([]);

  useEffect(() => {
    const colors = [
      "rgba(245,158,11,0.6)",
      "rgba(59,130,246,0.4)",
      "rgba(139,92,246,0.4)",
      "rgba(6,182,212,0.3)",
      "rgba(255,255,255,0.3)",
    ];
    const arr = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-rise ${p.duration}s ${p.delay}s linear infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ───────────── Floating Orb ───────────── */
function FloatingOrb({
  className,
  color,
  size,
  animation,
}: {
  className?: string;
  color: string;
  size: string;
  animation: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-[80px] pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        animation,
      }}
      aria-hidden="true"
    />
  );
}

/* ───────────── Animated Counter ───────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black gradient-text-animated">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

/* ───────────── Chapter Node ───────────── */
function ChapterNode({
  chapter,
  title,
  status,
  delay,
}: {
  chapter: string;
  title: string;
  status: "unlocked" | "locked" | "current";
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay} direction="scale">
      <div className="flex items-center gap-4 group">
        <div className="relative flex-shrink-0">
          {/* Pulse ring for current */}
          {status === "current" && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/40" style={{ animation: "pulse-ring 2s ease-in-out infinite" }} />
          )}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              status === "unlocked"
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-gray-900 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                : status === "current"
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                : "bg-gray-800/80 text-gray-500 border border-gray-700"
            }`}
          >
            {status === "locked" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              chapter
            )}
          </div>
        </div>
        <div className="text-left">
          <p className={`font-semibold text-sm ${status === "locked" ? "text-gray-500" : "text-white"}`}>{title}</p>
          <p className={`text-xs ${status === "locked" ? "text-gray-600" : "text-gray-400"}`}>
            {status === "unlocked" ? "Completed" : status === "current" ? "In Progress" : "Locked"}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ───────────── Navbar ───────────── */
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
        scrolled ? "glass-enhanced shadow-2xl shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow duration-300">
            <svg className="w-5 h-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            World<span className="text-amber-400">Quest</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Community", "Leaderboard", "Chapters"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2.5 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl hover:from-amber-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:scale-95"
          >
            Play Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ───────────── MAIN HOMEPAGE ───────────── */
/* ══════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14]">
      <Navbar />

      {/* ───── HERO SECTION ───── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Layered atmospheric background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#070b14] to-[#070b14]" />
          <FloatingOrb className="top-[10%] left-[15%]" color="rgba(245,158,11,0.12)" size="500px" animation="float-slow 8s ease-in-out infinite" />
          <FloatingOrb className="top-[20%] right-[10%]" color="rgba(59,130,246,0.1)" size="400px" animation="drift-right 12s ease-in-out infinite" />
          <FloatingOrb className="bottom-[10%] left-[30%]" color="rgba(139,92,246,0.08)" size="350px" animation="drift-left 10s ease-in-out infinite" />
          <FloatingOrb className="top-[40%] right-[30%]" color="rgba(6,182,212,0.06)" size="300px" animation="float-medium 9s ease-in-out infinite" />

          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#070b14_80%)]" />

          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
        </div>

        {/* Particles */}
        <Particles />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Beta badge */}
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
            style={{ animation: "fade-in 0.6s ease-out" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animation: "pulse-ring 2s ease-in-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-medium text-amber-300/90 tracking-wide">Season 1 Now Live</span>
          </div>

          {/* Main Title */}
          <h1
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter mb-2 leading-[0.9]"
            style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">World</span>
            <span
              className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500"
              style={{ animation: "hero-title-glow 3s ease-in-out infinite" }}
            >
              Quest
            </span>
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 my-6" style={{ animation: "fade-in 1s ease-out 0.3s both" }}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
            <svg className="w-4 h-4 text-amber-400/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
            </svg>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both" }}
          >
            Embark on an epic journey across five mystical chapters. Solve puzzles, defeat challenges, and recover the legendary{" "}
            <span className="text-amber-400/90 font-semibold">Knowledge Crystals</span> to become a World Scholar.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both" }}
          >
            <Link
              href="/auth/signup"
              className="group relative px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-black text-lg rounded-2xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:scale-[0.97] overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: "shimmer-line 2s ease-in-out infinite" }} />
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Quest
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="group px-8 py-4 text-gray-400 hover:text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Trailer
              </span>
            </Link>
          </div>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 mt-16"
            style={{ animation: "slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both" }}
          >
            {[
              { icon: "🌍", label: "5 Epic Chapters" },
              { icon: "🧩", label: "50+ Puzzles" },
              { icon: "🏆", label: "Leaderboards" },
              { icon: "⚡", label: "XP & Rewards" },
              { icon: "📖", label: "Story-driven" },
            ].map((f, i) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-gray-400 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-gray-300 transition-all duration-300 cursor-default"
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "float 2s ease-in-out infinite" }}>
          <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ───── ABOUT SECTION ───── */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="badge-blue mb-4 inline-block">Discover</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                What is <span className="gradient-text">WorldQuest</span>?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                A gamified learning adventure that transforms education into an immersive journey through mystical worlds.
                Every question answered brings you closer to becoming a legendary World Scholar.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: "Story-Driven Learning",
                desc: "Dive into five captivating chapters where knowledge unlocks the path forward. Each chapter weaves education into an unforgettable narrative.",
                color: "from-blue-500 to-cyan-500",
                glow: "rgba(59,130,246,0.15)",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959V6.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.398c0-1.17.556-2.263 1.49-2.958a3.25 3.25 0 011.49-.652c.538 0 1.063.126 1.522.364a3.25 3.25 0 011.49.652c.934.695 1.49 1.788 1.49 2.958v.398z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75h-12a.75.75 0 01-.75-.75v-3a.75.75 0 01.297-.588c.358-.285.758-.52 1.188-.695a4.5 4.5 0 015.925 0c.43.175.83.41 1.188.695a.75.75 0 01.297.588v3a.75.75 0 01-.75.75z" />
                  </svg>
                ),
                title: "Puzzle Vault",
                desc: "Challenge yourself with riddles, logic puzzles, and brain teasers hidden in the Puzzle Vault. Earn XP and unlock rare rewards.",
                color: "from-purple-500 to-pink-500",
                glow: "rgba(139,92,246,0.15)",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.52m3.77-1.52a6.015 6.015 0 00-.5-1.728M12 12.75a3 3 0 01-3-3" />
                  </svg>
                ),
                title: "Compete & Rank",
                desc: "Climb the global leaderboard, earn achievements, and prove your mastery. Compete with scholars worldwide for the top spot.",
                color: "from-amber-400 to-orange-500",
                glow: "rgba(245,158,11,0.15)",
              },
            ].map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 120}>
                <div className="group relative rounded-3xl p-8 bg-[#0d1220]/80 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 magnetic-hover h-full">
                  {/* Glow background on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(400px circle at 50% 30%, ${feat.glow}, transparent 70%)` }}
                  />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                      {feat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{feat.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CHAPTER PROGRESSION ───── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
        <FloatingOrb className="top-1/4 left-0" color="rgba(139,92,246,0.08)" size="400px" animation="drift-right 14s ease-in-out infinite" />

        <div className="relative max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="badge-purple mb-4 inline-block">Journey</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Five Chapters. <span className="gradient-text">One Legend.</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Progress through mystical realms, each more challenging than the last. Only the worthy reach the final chapter.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Connecting path line */}
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-purple-500/30 to-gray-800/20 hidden md:block" />

            <div className="space-y-6">
              {[
                { ch: "I", title: "The Awakening", desc: "Discover the ancient realm and learn the basics", status: "unlocked" as const },
                { ch: "II", title: "The Crystal Caves", desc: "Navigate treacherous caverns of knowledge", status: "unlocked" as const },
                { ch: "III", title: "The Storm Peaks", desc: "Brave the elements and prove your wisdom", status: "current" as const },
                { ch: "IV", title: "The Shadow Realm", desc: "Face the ultimate test of understanding", status: "locked" as const },
                { ch: "V", title: "The Ascension", desc: "Claim your place among the World Scholars", status: "locked" as const },
              ].map((chapter, i) => (
                <ScrollReveal key={chapter.title} delay={i * 100}>
                  <div className={`relative flex items-center gap-6 p-6 rounded-2xl transition-all duration-300 ${
                    chapter.status === "current"
                      ? "bg-blue-500/5 border border-blue-500/20"
                      : chapter.status === "unlocked"
                      ? "bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]"
                      : "bg-white/[0.01] border border-white/[0.03] opacity-60"
                  }`}>
                    {/* Chapter number */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${
                      chapter.status === "unlocked"
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-gray-900 shadow-lg shadow-amber-500/20"
                        : chapter.status === "current"
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-gray-800/60 text-gray-600 border border-gray-700/50"
                    }`}>
                      {chapter.status === "locked" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        chapter.ch
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-bold ${chapter.status === "locked" ? "text-gray-500" : "text-white"}`}>
                          {chapter.title}
                        </h3>
                        {chapter.status === "current" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">Active</span>
                        )}
                        {chapter.status === "unlocked" && (
                          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className={`text-sm ${chapter.status === "locked" ? "text-gray-600" : "text-gray-400"}`}>
                        {chapter.desc}
                      </p>
                    </div>

                    {/* Arrow for unlocked/current */}
                    {chapter.status !== "locked" && (
                      <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS SECTION ───── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-enhanced rounded-3xl p-10 md:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { target: 5, suffix: "", label: "Epic Chapters" },
                { target: 50, suffix: "+", label: "Puzzles & Questions" },
                { target: 1000, suffix: "+", label: "Active Scholars" },
                { target: 95, suffix: "%", label: "Fun Guaranteed" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="space-y-2">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                    <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW TO PLAY ───── */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="badge-gold mb-4 inline-block">How to Play</span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Your Quest <span className="gradient-text-gold">Awaits</span>
            </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Three simple steps to begin your legendary adventure.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Scholar",
                desc: "Sign up and choose your path. Your journey through the mystical realms begins now.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Explore Chapters",
                desc: "Travel through five unique realms. Answer questions, solve puzzles, and earn XP along the way.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Become a Legend",
                desc: "Top the leaderboards, unlock achievements, and earn the title of World Scholar.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.52m3.77-1.52a6.015 6.015 0 00-.5-1.728M12 12.75a3 3 0 01-3-3" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 150}>
                <div className="group relative text-center p-8">
                  {/* Step number background */}
                  <div className="absolute top-4 right-6 text-8xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-500">
                    {item.step}
                  </div>

                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-6 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-300">
                      {item.icon}
                    </div>
                    <div className="text-xs font-bold text-amber-400/60 tracking-[0.3em] uppercase mb-2">Step {item.step}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA / BETA SIGN-UP ───── */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Dramatic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b14] via-[#0d1025] to-[#070b14]" />
          <FloatingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(245,158,11,0.1)" size="600px" animation="pulse-ring 6s ease-in-out infinite" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#070b14_70%)]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <ScrollReveal direction="scale">
            <div className="glass-enhanced rounded-[2rem] p-12 md:p-16 relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-500/30 rounded-tl-[2rem]" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-500/30 rounded-br-[2rem]" />

              <span className="badge-gold mb-6 inline-block">Limited Access</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Ready to Begin?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                Join the beta and be among the first to experience the ultimate learning adventure.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="group relative px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 font-black text-lg rounded-2xl transition-all duration-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:scale-[0.97] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100" style={{ animation: "shimmer-line 2s ease-in-out infinite" }} />
                  <span className="relative z-10">Join the Beta — Free</span>
                </Link>
                <Link
                  href="/leaderboard"
                  className="px-8 py-4 text-gray-400 hover:text-white font-semibold rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 hover:bg-white/5"
                >
                  View Leaderboard
                </Link>
              </div>

              <p className="text-xs text-gray-600 mt-6">No credit card required. Start playing in seconds.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative border-t border-white/[0.04] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-white">
                World<span className="text-amber-400">Quest</span>
              </span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6">
              {["Community", "Support", "Privacy", "Terms"].map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  {link}
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-600">&copy; 2026 WorldQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}