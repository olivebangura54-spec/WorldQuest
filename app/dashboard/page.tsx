"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/userService";
import { checkAndUpdateStreak } from "@/services/streakService";
import { LEVEL_THRESHOLDS, calculateLevel } from "@/services/xpService";
import ProtectedRoute from "@/components/ProtectedRoute";
import SettingsPanel from "@/components/SettingsPanel";
import AvatarDisplay from "@/components/AvatarDisplay";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════
   ACHIEVEMENT BADGES — Forest Creatures
   ═══════════════════════════════════════════ */
const ACHIEVEMENTS = [
  { id: "first_quest", title: "First Steps", desc: "Complete your first quest", icon: "🦉", unlocked: false },
  { id: "streak_3", title: "Flame Keeper", desc: "Maintain a 3-day streak", icon: "🔥", unlocked: false },
  { id: "puzzle_5", title: "Puzzle Weaver", desc: "Solve 5 puzzles", icon: "🍄", unlocked: false },
  { id: "level_5", title: "Crystal Bearer", desc: "Reach level 5", icon: "💎", unlocked: false },
  { id: "chapter_1", title: "Chapter Initiate", desc: "Complete Chapter I", icon: "🌿", unlocked: false },
  { id: "rank_10", title: "Firefly Guide", desc: "Reach top 10", icon: "✨", unlocked: false },
];

/* ═══════════════════════════════════════════
   FIREFLY PARTICLE COMPONENT
   ═══════════════════════════════════════════ */
function Fireflies() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#22d3ee" : "#a855f7",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particle-firefly ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FALLING LEAVES
   ═══════════════════════════════════════════ */
function FallingLeaves() {
  const leaves = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    size: 8 + Math.random() * 10,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 8,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {leaves.map((l) => (
        <div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.x}%`,
            top: "-5%",
            width: l.size,
            height: l.size,
            animation: `leaf-fall ${l.duration}s linear ${l.delay}s infinite`,
            opacity: 0.15,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: "100%", height: "100%", transform: `rotate(${l.rotate}deg)` }}>
            <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 10 10 10 10s10-4.5 10-10C22 6.5 17.5 2 12 2z" fill="rgba(74,222,128,0.6)" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes leaf-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.15; }
          25% { transform: translateY(25vh) translateX(15px) rotate(90deg); opacity: 0.12; }
          50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); opacity: 0.1; }
          75% { transform: translateY(75vh) translateX(20px) rotate(270deg); opacity: 0.05; }
          100% { transform: translateY(105vh) translateX(5px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ENCHANTED FOREST BACKGROUND SVG
   ═══════════════════════════════════════════ */
function EnchantedBackground({ mouse }: { mouse: { x: number; y: number } }) {
  const px = (mouse.x - 0.5) * 8;
  const py = (mouse.y - 0.5) * 5;

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${px}px, ${py}px, 0)`,
          willChange: "transform",
          transition: "transform 0.4s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Deep twilight sky */}
            <linearGradient id="dDashboardSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060818" />
              <stop offset="15%" stopColor="#0a0e1a" />
              <stop offset="35%" stopColor="#0f1530" />
              <stop offset="55%" stopColor="#141e3d" />
              <stop offset="75%" stopColor="#1a1540" />
              <stop offset="100%" stopColor="#0d0b1a" />
            </linearGradient>

            {/* Purple-pink horizon glow */}
            <radialGradient id="dHorizonGlow" cx="50%" cy="65%" r="40%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Moon glow */}
            <radialGradient id="dMoonGlow" cx="80%" cy="12%" r="15%">
              <stop offset="0%" stopColor="#c8d8f0" stopOpacity="0.2" />
              <stop offset="40%" stopColor="#8090b0" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Mist */}
            <linearGradient id="dMist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" stopOpacity="0" />
              <stop offset="60%" stopColor="#0d0b1a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a0e1a" stopOpacity="0.9" />
            </linearGradient>

            {/* Tree silhouette */}
            <linearGradient id="dTreeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0e1a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#060818" stopOpacity="1" />
            </linearGradient>

            {/* Vignette */}
            <radialGradient id="dVignette" cx="50%" cy="50%" r="70%">
              <stop offset="20%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="#060818" stopOpacity="0.7" />
            </radialGradient>

            {/* Mushroom glow */}
            <radialGradient id="mushroomGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>

            {/* Warm glow for mushrooms */}
            <radialGradient id="mushroomWarm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f0abfc" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ═══════ SKY ═══════ */}
          <rect width="1440" height="900" fill="url(#dDashboardSky)" />
          <rect width="1440" height="900" fill="url(#dHorizonGlow)" />
          <rect width="1440" height="900" fill="url(#dMoonGlow)" />

          {/* ═══════ STARS ═══════ */}
          <g opacity="0.5">
            {([
              [120,50,0.8],[280,30,0.6],[450,70,0.9],[620,25,0.5],[780,55,0.7],
              [950,40,0.8],[1100,60,0.6],[1250,20,0.9],[1380,45,0.7],[200,80,0.5],
              [500,35,0.7],[700,65,0.6],[900,15,0.8],[1050,50,0.5],[1300,75,0.6],
              [350,90,0.4],[550,45,0.7],[850,30,0.6],[1150,55,0.5],[1400,25,0.7],
            ] as [number, number, number][]).map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.15 + (i % 5) * 0.06}>
                <animate attributeName="opacity"
                  values={`${0.1 + (i % 3) * 0.06};${0.3 + (i % 4) * 0.08};${0.1 + (i % 3) * 0.06}`}
                  dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          {/* ═══════ MOON ═══════ */}
          <circle cx="1150" cy="100" r="22" fill="#c8d8f0" opacity="0.12" />
          <circle cx="1150" cy="100" r="16" fill="#d8e8f8" opacity="0.08" />

          {/* ═══════ LEFT TREES — Whimsical Forest ═══════ */}
          <g fill="url(#dTreeGrad)">
            {/* Large foreground tree */}
            <path d="M-40,900 L-40,300 Q-30,200 0,150 Q30,200 40,300 L40,900 Z" />
            {/* Branch left */}
            <path d="M-20,350 Q-80,300 -100,280 Q-60,310 -20,350 Z" opacity="0.8" />
            {/* Branch right */}
            <path d="M10,320 Q70,260 90,240 Q50,280 10,320 Z" opacity="0.7" />

            {/* Second tree */}
            <path d="M60,900 L60,380 Q70,300 85,260 Q100,300 110,380 L110,900 Z" opacity="0.85" />

            {/* Tall pine */}
            <path d="M-80,900 L-80,420 L-70,340 L-60,420 L-60,900 Z" opacity="0.7" />
            <path d="M-90,900 L-90,470 L-75,380 L-60,470 L-60,900 Z" opacity="0.5" />

            {/* Far left tree */}
            <path d="M-120,900 L-120,380 L-110,300 L-100,380 L-100,900 Z" opacity="0.6" />

            {/* Small trees */}
            <path d="M130,900 L130,450 L140,390 L150,450 L150,900 Z" opacity="0.5" />
            <path d="M180,900 L180,500 L188,440 L196,500 L196,900 Z" opacity="0.35" />
          </g>

          {/* ═══════ RIGHT TREES — Whimsical Forest ═══════ */}
          <g fill="url(#dTreeGrad)">
            {/* Large right foreground tree */}
            <path d="M1380,900 L1380,280 Q1395,180 1420,140 Q1445,180 1460,280 L1460,900 Z" />
            {/* Branch */}
            <path d="M1390,340 Q1340,280 1320,260 Q1360,290 1390,340 Z" opacity="0.8" />

            {/* Second tree */}
            <path d="M1300,900 L1300,360 Q1310,290 1325,260 Q1340,290 1350,360 L1350,900 Z" opacity="0.85" />

            {/* Tall pine right */}
            <path d="M1260,900 L1260,400 L1270,320 L1280,400 L1280,900 Z" opacity="0.6" />
            <path d="M1250,900 L1250,450 L1265,360 L1280,450 L1280,900 Z" opacity="0.4" />

            {/* Far right */}
            <path d="M1420,900 L1420,420 L1430,360 L1440,420 L1440,900 Z" opacity="0.7" />
            <path d="M1220,900 L1220,480 L1230,420 L1240,480 L1240,900 Z" opacity="0.4" />
          </g>

          {/* ═══════ GLOWING MUSHROOMS ═══════ */}
          {/* Left mushroom cluster */}
          <g transform="translate(150, 720)">
            <ellipse cx="0" cy="0" rx="30" ry="15" fill="url(#mushroomGlow)" />
            <ellipse cx="0" cy="-5" rx="12" ry="8" fill="#7c3aed" opacity="0.6" />
            <rect x="-2" y="-5" width="4" height="15" fill="#4c1d95" opacity="0.5" rx="1" />
            <circle cx="-3" cy="-7" r="1.5" fill="#f0abfc" opacity="0.8">
              <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="3" cy="-4" r="1" fill="#f0abfc" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Right mushroom cluster */}
          <g transform="translate(1250, 730)">
            <ellipse cx="0" cy="0" rx="25" ry="12" fill="url(#mushroomGlow)" />
            <ellipse cx="0" cy="-4" rx="10" ry="7" fill="#6d28d9" opacity="0.5" />
            <rect x="-1.5" y="-4" width="3" height="12" fill="#4c1d95" opacity="0.4" rx="1" />
            <circle cx="0" cy="-6" r="1.2" fill="#c084fc" opacity="0.7">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Small mushroom */}
          <g transform="translate(300, 740)">
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="url(#mushroomWarm)" />
            <ellipse cx="0" cy="-3" rx="5" ry="3.5" fill="#a855f7" opacity="0.4" />
            <rect x="-1" y="-3" width="2" height="6" fill="#7c3aed" opacity="0.3" rx="0.5" />
          </g>

          {/* ═══════ GROUND / FOREST FLOOR ═══════ */}
          <path d="M0,760 Q200,730 400,750 Q600,720 800,740 Q1000,710 1200,730 Q1400,720 1440,740 L1440,900 L0,900 Z"
            fill="#060818" />

          {/* ═══════ WHIMSICAL HOUSE (right side, like moodboard) ═══════ */}
          <g transform="translate(1180, 600)" opacity="0.3">
            {/* House body */}
            <rect x="0" y="20" width="40" height="35" fill="#1a1540" rx="2" />
            {/* Roof */}
            <path d="M-5,20 L20,0 L45,20 Z" fill="#141025" />
            {/* Window glow */}
            <rect x="10" y="30" width="8" height="8" fill="#fbbf24" opacity="0.4" rx="1">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
            </rect>
            <rect x="24" y="30" width="8" height="8" fill="#a855f7" opacity="0.3" rx="1">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" />
            </rect>
            {/* Chimney */}
            <rect x="30" y="5" width="6" height="15" fill="#141025" />
          </g>

          {/* ═══════ MIST / FOG ═══════ */}
          <rect x="0" y="620" width="1440" height="280" fill="url(#dMist)" />

          {/* Animated fog wisps */}
          <ellipse cx="300" cy="770" rx="400" ry="55" fill="#0f1530" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;30,-5;0,0" dur="18s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="900" cy="790" rx="350" ry="45" fill="#0f1530" opacity="0.25">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;-25,3;0,0" dur="22s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1200" cy="775" rx="300" ry="40" fill="#0f1530" opacity="0.2">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;20,-4;0,0" dur="20s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══════ VIGNETTE ═══════ */}
          <rect width="1440" height="900" fill="url(#dVignette)" />
        </svg>
      </div>

      {/* Ambient purple glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(15,21,48,0.4) 0%, transparent 70%)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   STAT CARD — Faeria-style Ornate
   ═══════════════════════════════════════════ */
function StatCard({ icon, value, label, color, delay }: {
  icon: string; value: string; label: string; color: string; delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl p-5 text-center transition-all duration-500 cursor-default overflow-hidden"
      style={{
        background: "rgba(13,11,26,0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(139,92,246,0.12)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        boxShadow: `0 0 30px rgba(139,92,246,0.03)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 0 30px ${color}15, inset 0 0 30px ${color}08`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.12)";
        e.currentTarget.style.boxShadow = "0 0 30px rgba(139,92,246,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Ornate top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l rounded-tl" style={{ borderColor: `${color}25` }} />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r rounded-tr" style={{ borderColor: `${color}25` }} />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l rounded-bl" style={{ borderColor: `${color}15` }} />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r rounded-br" style={{ borderColor: `${color}15` }} />

      {/* Icon */}
      <div className="text-3xl mb-2" style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}>
        {icon}
      </div>

      {/* Value */}
      <div className="text-2xl font-black font-[family-name:var(--font-cinzel)]" style={{ color }}>
        {value}
      </div>

      {/* Label */}
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mt-1.5 font-semibold">
        {label}
      </div>

      {/* Hover inner glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   ACHIEVEMENT BADGE
   ═══════════════════════════════════════════ */
function AchievementBadge({ achievement, delay }: {
  achievement: { id: string; title: string; desc: string; icon: string; unlocked: boolean };
  delay: number;
}) {
  return (
    <div
      className="group relative rounded-xl p-4 text-center transition-all duration-500 cursor-default overflow-hidden"
      style={{
        background: achievement.unlocked ? "rgba(139,92,246,0.08)" : "rgba(13,11,26,0.5)",
        border: `1px solid ${achievement.unlocked ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.03)"}`,
        boxShadow: achievement.unlocked ? "0 0 20px rgba(139,92,246,0.08)" : "none",
        opacity: achievement.unlocked ? 1 : 0.35,
        animation: `stagger-fade-in 0.6s ease-out ${delay}ms both`,
      }}
      onMouseEnter={(e) => {
        if (achievement.unlocked) {
          e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(139,92,246,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = achievement.unlocked ? "0 0 20px rgba(139,92,246,0.08)" : "none";
      }}
    >
      {/* Ornate corner */}
      {achievement.unlocked && (
        <>
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-purple-500/20 rounded-tl-xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-500/15 rounded-br-xl" />
        </>
      )}

      {/* Icon */}
      <div
        className="text-3xl mb-2 transition-all duration-300"
        style={{
          filter: achievement.unlocked ? "none" : "grayscale(1) brightness(0.5)",
          animation: achievement.unlocked ? "float 4s ease-in-out infinite" : "none",
        }}
      >
        {achievement.icon}
      </div>

      {/* Title */}
      <div className="text-[10px] font-bold text-white truncate">{achievement.title}</div>
      <div className="text-[8px] text-gray-600 mt-0.5 truncate">{achievement.desc}</div>

      {/* Mist overlay for locked */}
      {!achievement.unlocked && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(180deg, transparent 30%, rgba(13,11,26,0.4) 100%)",
        }} />
      )}

      {/* Glow for unlocked */}
      {achievement.unlocked && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   RECENT JOURNEY CARD
   ═══════════════════════════════════════════ */
function RecentJourneyCard({ puzzle, index }: { puzzle: string; index: number }) {
  return (
    <div
      className="group rounded-xl p-4 transition-all duration-300 cursor-default overflow-hidden"
      style={{
        background: "rgba(13,11,26,0.6)",
        border: "1px solid rgba(139,92,246,0.1)",
        animation: `stagger-fade-in 0.5s ease-out ${0.3 + index * 0.1}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)";
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ background: "rgba(139,92,246,0.1)" }}>
          🧩
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{puzzle}</div>
          <div className="text-[10px] text-gray-500">Completed</div>
        </div>
        <div className="text-xs font-bold" style={{ color: "#a855f7" }}>+XP</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROFILE SETTINGS PANEL
   ═══════════════════════════════════════════ */
function ProfileSettingsPanel({
  isOpen,
  onClose,
  profile,
  xpProgress,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  xpProgress: number;
}) {
  if (!isOpen || !profile) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fade-in 0.2s ease-out" }}
      />

      {/* Panel slides from left */}
      <div
        className="fixed top-0 left-0 bottom-0 z-[70] w-full max-w-sm overflow-y-auto"
        style={{
          background: "rgba(10,14,26,0.95)",
          backdropFilter: "blur(32px)",
          borderRight: "1px solid rgba(139,92,246,0.15)",
          boxShadow: "20px 0 60px rgba(139,92,246,0.08)",
          animation: "slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="p-6">
          {/* Close button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-[family-name:var(--font-cinzel)] gradient-text">Profile</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Avatar preview */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.3))",
                  padding: "3px",
                  boxShadow: "0 0 30px rgba(139,92,246,0.2)",
                }}>
                <div className="w-full h-full rounded-full bg-[#0d0b1a] overflow-hidden">
                  <AvatarDisplay
                    avatar={profile.avatar || ""}
                    avatarData={profile.avatarData}
                    fallbackName={profile.characterName}
                    size={128}
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                  boxShadow: "0 0 15px rgba(139,92,246,0.4)",
                }}>
                {profile.level}
              </div>
            </div>

            <h3 className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-white">{profile.characterName}</h3>
            <span className="badge-gold mt-2">{profile.title}</span>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <span className="text-sm text-gray-400">Level</span>
              <span className="text-sm font-bold text-white">{profile.level}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <span className="text-sm text-gray-400">Total XP</span>
              <span className="text-sm font-bold" style={{ color: "#a855f7" }}>{profile.xp.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <span className="text-sm text-gray-400">Streak</span>
              <span className="text-sm font-bold text-orange-400">{profile.streak} days 🔥</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <span className="text-sm text-gray-400">Puzzles Solved</span>
              <span className="text-sm font-bold" style={{ color: "#22d3ee" }}>{profile.puzzlesCompleted.length}</span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Level {profile.level} Progress</span>
              <span className="text-xs text-gray-500 font-mono">{Math.round(xpProgress)}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{
                width: `${xpProgress}%`,
                background: "linear-gradient(90deg, #8b5cf6, #22d3ee)",
                boxShadow: "0 0 15px rgba(139,92,246,0.4)",
              }} />
            </div>
          </div>

          {/* Edit buttons */}
          <div className="space-y-3">
            <Link href="/profile"
              className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.08))",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#c4b5fd",
              }}
              onClick={onClose}
            >
              Edit Avatar & Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const router = useRouter();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          await checkAndUpdateStreak(user.uid);
          const data = await getUserProfile(user.uid);
          if (data) {
            setProfile(data);
            setAchievements((prev) =>
              prev.map((a) => ({
                ...a,
                unlocked: data.achievements.includes(a.id),
              }))
            );
          } else {
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0e1a" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-cyan-500/10 border-b-cyan-400" style={{ animationDirection: "reverse", animationDuration: "2s" }} />
          </div>
          <span className="text-sm font-[family-name:var(--font-cinzel)] font-semibold" style={{ color: "rgba(139,92,246,0.6)" }}>
            Entering the Enchanted Sanctum...
          </span>
        </div>
      </div>
    );
  }

  const xpProgress = profile
    ? (() => {
        const currentLevel = calculateLevel(profile.xp);
        const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
        const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        const xpInLevel = profile.xp - currentThreshold;
        const xpNeeded = nextThreshold - currentThreshold;
        return xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
      })()
    : 0;

  const recentPuzzles = profile?.puzzlesCompleted?.slice(-5).reverse() || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#0a0e1a" }}>
        {/* ═══════ ENCHANTED FOREST BACKGROUND ═══════ */}
        <EnchantedBackground mouse={mouse} />
        <Fireflies />
        <FallingLeaves />

        {/* ═══════ MAIN CONTENT ═══════ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* ─── HEADER ─── */}
          <header className="flex items-center justify-between mb-8" style={{ animation: "slide-up 0.6s ease-out" }}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.3))",
                  boxShadow: "0 0 20px rgba(139,92,246,0.15)",
                }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-cinzel)]">
                World<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Quest</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {profile && (
                <span className="hidden sm:inline-flex badge-purple text-[10px]">
                  {profile.title}
                </span>
              )}
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white transition-all text-sm"
                style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </header>

          {/* ─── MAIN LAYOUT: AVATAR LEFT + CONTENT RIGHT ─── */}
          {profile && (
            <div className="flex flex-col lg:flex-row gap-8 mb-10" style={{ animation: "slide-up 0.6s ease-out 0.1s both" }}>

              {/* ═══════ LEFT: AVATAR AREA (Faeria creature position) ═══════ */}
              <div className="lg:w-72 shrink-0 flex flex-col items-center">
                {/* Avatar — Large, floating, clickable */}
                <button
                  onClick={() => setProfileOpen(true)}
                  className="group relative cursor-pointer focus:outline-none"
                  style={{ animation: "float 5s ease-in-out infinite" }}
                  aria-label="Open Profile Settings"
                >
                  {/* Enchanted forest frame — outer ring */}
                  <div className="relative w-48 h-48">
                    {/* Rotating glow ring */}
                    <div className="absolute inset-0 rounded-full" style={{
                      background: "conic-gradient(from 0deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2), rgba(240,171,252,0.2), rgba(139,92,246,0.3))",
                      animation: "rotate-slow 12s linear infinite",
                      padding: "3px",
                      borderRadius: "50%",
                    }}>
                      <div className="w-full h-full rounded-full" style={{ background: "#0a0e1a" }} />
                    </div>

                    {/* Avatar image */}
                    <div className="absolute inset-[4px] rounded-full overflow-hidden"
                      style={{
                        boxShadow: "0 0 40px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.1)",
                      }}>
                      <AvatarDisplay
                        avatar={profile.avatar || ""}
                        avatarData={profile.avatarData}
                        fallbackName={profile.characterName}
                        size={188}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Level crystal orb — bottom right */}
                    <div className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white z-10"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                        boxShadow: "0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(34,211,238,0.2)",
                        border: "2px solid rgba(10,14,26,0.8)",
                      }}>
                      {profile.level}
                    </div>

                    {/* Hover glow burst */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: "0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(34,211,238,0.15), inset 0 0 60px rgba(139,92,246,0.1)",
                      }} />

                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        border: "1px solid rgba(139,92,246,0.15)",
                        animation: "pulse-ring 3s ease-in-out infinite",
                      }} />
                  </div>
                </button>

                {/* Explorer Name */}
                <div className="mt-5 text-center">
                  <h2 className="text-xl font-bold font-[family-name:var(--font-cinzel)] text-white">
                    {profile.characterName}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="badge-purple text-[10px]">{profile.title}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    Tap to view profile
                  </p>
                </div>

                {/* XP Progress — below avatar on left */}
                <div className="w-full mt-5 px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Level {profile.level}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{Math.round(xpProgress)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden relative" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.08)" }}>
                    <div className="h-full rounded-full transition-all duration-1000 ease-out relative" style={{
                      width: `${xpProgress}%`,
                      background: "linear-gradient(90deg, #8b5cf6, #22d3ee, #f0abfc)",
                      boxShadow: "0 0 20px rgba(139,92,246,0.4)",
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: "shimmer-line 3s ease-in-out infinite" }} />
                    </div>
                  </div>
                  <div className="text-[9px] text-gray-600 mt-1 text-center">
                    {profile.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>

              {/* ═══════ RIGHT: CONTENT AREA ═══════ */}
              <div className="flex-1 min-w-0">

                {/* ─── WELCOME + QUICK STATS ─── */}
                <div className="rounded-2xl p-6 mb-6" style={{
                  background: "rgba(13,11,26,0.6)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(139,92,246,0.1)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.03)",
                }}>
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-purple-500/15 rounded-tl-2xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/10 rounded-br-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-2xl font-bold font-[family-name:var(--font-cinzel)] text-white">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">{profile.characterName}</span>
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">Your enchanted journey continues...</p>
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-black" style={{ color: "#a855f7" }}>{profile.xp.toLocaleString()}</span>
                      <span className="text-gray-500">XP</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-sm">
                      <span>🔥</span>
                      <span className="font-bold text-orange-400">{profile.streak}</span>
                      <span className="text-gray-500">Streak</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-sm">
                      <span>🧩</span>
                      <span className="font-bold" style={{ color: "#22d3ee" }}>{profile.puzzlesCompleted.length}</span>
                      <span className="text-gray-500">Puzzles</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-sm">
                      <span>📖</span>
                      <span className="font-bold" style={{ color: "#4ade80" }}>Ch. {profile.currentChapter}</span>
                      <span className="text-gray-500">Chapter</span>
                    </div>
                  </div>
                </div>

                {/* ─── STATS GRID — Faeria-style ornate cards ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Total XP", value: profile.xp.toLocaleString(), icon: "💎", color: "#a855f7" },
                    { label: "Level", value: `${profile.level}`, icon: "🔮", color: "#22d3ee" },
                    { label: "Puzzles Solved", value: `${profile.puzzlesCompleted.length}`, icon: "🧩", color: "#f0abfc" },
                    { label: "Streak", value: `${profile.streak} days`, icon: "🔥", color: "#fbbf24" },
                    { label: "Countries", value: `${profile.puzzlesCompleted.length}`, icon: "🌍", color: "#4ade80" },
                    { label: "Passport Stamps", value: `${profile.chaptersCompleted.length}`, icon: "📜", color: "#fb923c" },
                  ].map((stat, i) => (
                    <StatCard
                      key={stat.label}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                      color={stat.color}
                      delay={200 + i * 80}
                    />
                  ))}
                </div>

                {/* ─── ACHIEVEMENTS ─── */}
                <div className="mb-6" style={{ animation: "slide-up 0.6s ease-out 0.4s both" }}>
                  <h3 className="text-sm text-gray-500 uppercase tracking-[0.15em] font-semibold mb-3 font-[family-name:var(--font-cinzel)]">
                    ✦ Achievements
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {achievements.map((achievement, i) => (
                      <AchievementBadge key={achievement.id} achievement={achievement} delay={400 + i * 60} />
                    ))}
                  </div>
                </div>

                {/* ─── RECENT ACTIVITY ─── */}
                {recentPuzzles.length > 0 && (
                  <div className="mb-6" style={{ animation: "slide-up 0.6s ease-out 0.5s both" }}>
                    <h3 className="text-sm text-gray-500 uppercase tracking-[0.15em] font-semibold mb-3 font-[family-name:var(--font-cinzel)]">
                      ✦ Recent Journeys
                    </h3>
                    <div className="space-y-2">
                      {recentPuzzles.map((puzzle, i) => (
                        <RecentJourneyCard key={puzzle} puzzle={puzzle} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── QUICK ACTIONS ─── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation: "slide-up 0.6s ease-out 0.6s both" }}>
                  {/* Continue Quest — Primary, large, glowing */}
                  <Link
                    href="/adventure"
                    className="group relative col-span-2 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))",
                      border: "1px solid rgba(139,92,246,0.25)",
                      boxShadow: "0 0 40px rgba(139,92,246,0.06)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(139,92,246,0.05)";
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.06)";
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
                    }}
                  >
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: "rgba(139,92,246,0.15)" }}>
                        ⚔️
                      </div>
                      <h3 className="text-lg font-bold font-[family-name:var(--font-cinzel)] mb-1">Continue Quest</h3>
                      <p className="text-sm text-gray-400">Resume your adventure</p>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity">⚔️</div>
                    {/* Ornate border glow */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-purple-500/20 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-cyan-500/15 rounded-br-2xl pointer-events-none" />
                  </Link>

                  {/* World Map */}
                  <Link
                    href="/chapters"
                    className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(13,11,26,0.6)",
                      border: "1px solid rgba(139,92,246,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2" style={{ background: "rgba(139,92,246,0.08)" }}>
                      🗺️
                    </div>
                    <h3 className="text-sm font-bold font-[family-name:var(--font-cinzel)]">World Map</h3>
                  </Link>

                  {/* Puzzle Vault */}
                  <Link
                    href="/puzzle-vault"
                    className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(13,11,26,0.6)",
                      border: "1px solid rgba(139,92,246,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(34,211,238,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(139,92,246,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2" style={{ background: "rgba(34,211,238,0.08)" }}>
                      🧩
                    </div>
                    <h3 className="text-sm font-bold font-[family-name:var(--font-cinzel)]">Puzzle Vault</h3>
                  </Link>
                </div>

                {/* ─── SECONDARY ACTIONS ROW ─── */}
                <div className="grid grid-cols-2 gap-3 mt-3" style={{ animation: "slide-up 0.6s ease-out 0.7s both" }}>
                  <Link
                    href="/leaderboard"
                    className="group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                    style={{
                      background: "rgba(13,11,26,0.5)",
                      border: "1px solid rgba(251,191,36,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(251,191,36,0.25)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(251,191,36,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(251,191,36,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(251,191,36,0.08)" }}>
                      🏆
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Leaderboard</h3>
                      <p className="text-[10px] text-gray-500">Global ranking</p>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    className="group rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                    style={{
                      background: "rgba(13,11,26,0.5)",
                      border: "1px solid rgba(74,222,128,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(74,222,128,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(74,222,128,0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(74,222,128,0.08)" }}>
                      📜
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Passport</h3>
                      <p className="text-[10px] text-gray-500">Your stamps</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════ PANELS ═══════ */}
        <ProfileSettingsPanel
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          profile={profile}
          xpProgress={xpProgress}
        />

        <SettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    </ProtectedRoute>
  );
}