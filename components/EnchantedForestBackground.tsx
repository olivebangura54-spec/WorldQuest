"use client";

import { useEffect, useState } from "react";

/**
 * Dark blue enchanted forest background for auth pages.
 *   • Deep navy sky (#0a1628)
 *   • Silhouette trees on left and right
 *   • Deer silhouette in lower left
 *   • Misty/fog effect at bottom
 *   • Stars / light particles in sky
 *   • Subtle parallax on mouse move
 */
export default function EnchantedForestBackground() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

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

  const px = (mouse.x - 0.5) * 10;
  const py = (mouse.y - 0.5) * 6;

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* ─── Parallax wrapper ─── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${px}px, ${py}px, 0)`,
          willChange: "transform",
          transition: "transform 0.3s ease-out",
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sky gradient */}
            <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#060d1a" />
              <stop offset="20%"  stopColor="#0a1628" />
              <stop offset="50%"  stopColor="#0e1e38" />
              <stop offset="75%"  stopColor="#122848" />
              <stop offset="100%" stopColor="#0a1628" />
            </linearGradient>

            {/* Moon glow */}
            <radialGradient id="moonGlow" cx="75%" cy="15%" r="20%">
              <stop offset="0%"  stopColor="#c8d8f0" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#8090b0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Mist gradient */}
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="transparent" stopOpacity="0" />
              <stop offset="60%" stopColor="#0e1e38" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a1628" stopOpacity="0.8" />
            </linearGradient>

            {/* Tree gradient */}
            <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#0a1628" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#060d1a" stopOpacity="1" />
            </linearGradient>

            {/* Vignette */}
            <radialGradient id="authVignette" cx="50%" cy="50%" r="65%">
              <stop offset="30%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="#060d1a" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* ═══════ SKY ═══════ */}
          <rect width="1440" height="900" fill="url(#forestSky)" />
          <rect width="1440" height="900" fill="url(#moonGlow)" />

          {/* ═══════ STARS ═══════ */}
          <g opacity="0.6">
            {([
              [120,50,0.8],[280,30,0.6],[450,70,0.9],[620,25,0.5],[780,55,0.7],
              [950,40,0.8],[1100,60,0.6],[1250,20,0.9],[1380,45,0.7],[200,80,0.5],
              [500,35,0.7],[700,65,0.6],[900,15,0.8],[1050,50,0.5],[1300,75,0.6],
              [350,90,0.4],[550,45,0.7],[850,30,0.6],[1150,55,0.5],[1400,25,0.7],
              [80,70,0.5],[180,100,0.3],[320,55,0.6],[480,85,0.4],[640,35,0.7],
              [800,75,0.5],[960,20,0.6],[1120,45,0.5],[1280,85,0.4],[1420,35,0.6],
            ] as [number, number, number][]).map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="white"
                opacity={0.2 + (i % 5) * 0.08}>
                <animate attributeName="opacity"
                  values={`${0.15 + (i % 3) * 0.1};${0.35 + (i % 4) * 0.1};${0.15 + (i % 3) * 0.1}`}
                  dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          {/* ═══════ MOON ═══════ */}
          <circle cx="1080" cy="120" r="25" fill="#c8d8f0" opacity="0.15" />
          <circle cx="1080" cy="120" r="18" fill="#d8e8f8" opacity="0.1" />

          {/* ═══════ LEFT TREES (silhouette) ═══════ */}
          <g fill="url(#treeGrad)">
            {/* Tree 1 — tall pine */}
            <path d="M-20,900 L-20,400 L-10,350 L0,300 L10,350 L20,400 L20,900 Z" />
            <path d="M-30,900 L-30,450 L-15,380 L0,320 L15,380 L30,450 L30,900 Z" opacity="0.7" />
            {/* Tree 2 */}
            <path d="M40,900 L40,350 L50,280 L60,350 L60,900 Z" />
            <path d="M30,900 L30,400 L45,310 L60,400 L60,900 Z" opacity="0.6" />
            {/* Tree 3 — wider */}
            <path d="M80,900 L80,380 L95,290 L110,380 L110,900 Z" />
            <path d="M70,900 L70,420 L90,320 L110,420 L110,900 Z" opacity="0.5" />
            {/* Tree 4 */}
            <path d="M130,900 L130,420 L140,360 L150,420 L150,900 Z" />
            {/* Tree 5 — far left */}
            <path d="M-60,900 L-60,380 L-50,300 L-40,380 L-40,900 Z" opacity="0.8" />
            {/* Tree 6 */}
            <path d="M170,900 L170,450 L180,380 L190,450 L190,900 Z" opacity="0.6" />
            {/* Tree 7 — tall */}
            <path d="M210,900 L210,350 L220,270 L230,350 L230,900 Z" opacity="0.4" />
          </g>

          {/* ═══════ RIGHT TREES (silhouette) ═══════ */}
          <g fill="url(#treeGrad)">
            {/* Tree 1 */}
            <path d="M1300,900 L1300,380 L1310,300 L1320,380 L1320,900 Z" />
            <path d="M1290,900 L1290,420 L1310,330 L1330,420 L1330,900 Z" opacity="0.7" />
            {/* Tree 2 — tall pine */}
            <path d="M1350,900 L1350,350 L1360,280 L1370,350 L1370,900 Z" />
            <path d="M1340,900 L1340,400 L1355,310 L1370,400 L1370,900 Z" opacity="0.6" />
            {/* Tree 3 */}
            <path d="M1390,900 L1390,400 L1400,340 L1410,400 L1410,900 Z" />
            <path d="M1380,900 L1380,440 L1400,350 L1420,440 L1420,900 Z" opacity="0.5" />
            {/* Tree 4 — far right */}
            <path d="M1430,900 L1430,370 L1440,290 L1450,370 L1450,900 Z" opacity="0.8" />
            {/* Tree 5 */}
            <path d="M1260,900 L1260,420 L1270,360 L1280,420 L1280,900 Z" opacity="0.6" />
            {/* Tree 6 — tall */}
            <path d="M1220,900 L1220,350 L1230,270 L1240,350 L1240,900 Z" opacity="0.4" />
          </g>

          {/* ═══════ DEER SILHOUETTE (lower left) ═══════ */}
          <g transform="translate(180, 680)" opacity="0.25">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="35" ry="18" fill="#0a1628" />
            {/* Neck */}
            <path d="M20,-15 Q25,-35 22,-50" stroke="#0a1628" strokeWidth="8" fill="none" />
            {/* Head */}
            <ellipse cx="22" cy="-55" rx="10" ry="8" fill="#0a1628" />
            {/* Antlers */}
            <path d="M18,-62 Q12,-78 8,-85" stroke="#0a1628" strokeWidth="2.5" fill="none" />
            <path d="M18,-62 Q15,-72 20,-80" stroke="#0a1628" strokeWidth="2" fill="none" />
            <path d="M26,-62 Q30,-78 34,-85" stroke="#0a1628" strokeWidth="2.5" fill="none" />
            <path d="M26,-62 Q28,-72 24,-80" stroke="#0a1628" strokeWidth="2" fill="none" />
            {/* Legs */}
            <line x1="-15" y1="15" x2="-18" y2="50" stroke="#0a1628" strokeWidth="4" />
            <line x1="-5" y1="15" x2="-3" y2="50" stroke="#0a1628" strokeWidth="4" />
            <line x1="10" y1="15" x2="12" y2="50" stroke="#0a1628" strokeWidth="4" />
            <line x1="22" y1="15" x2="25" y2="50" stroke="#0a1628" strokeWidth="4" />
            {/* Tail */}
            <path d="M-35,0 Q-42,-5 -38,-10" stroke="#0a1628" strokeWidth="3" fill="none" />
          </g>

          {/* ═══════ GROUND / FOREST FLOOR ═══════ */}
          <path d="M0,750 Q200,720 400,740 Q600,710 800,730 Q1000,700 1200,720 Q1400,710 1440,730 L1440,900 L0,900 Z"
            fill="#060d1a" />

          {/* ═══════ MIST / FOG ═══════ */}
          <rect x="0" y="600" width="1440" height="300" fill="url(#mist)" />

          {/* Animated fog wisps */}
          <ellipse cx="300" cy="750" rx="400" ry="60" fill="#0e1e38" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;30,-5;0,0" dur="18s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="900" cy="780" rx="350" ry="50" fill="#0e1e38" opacity="0.25">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;-25,3;0,0" dur="22s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1200" cy="760" rx="300" ry="45" fill="#0e1e38" opacity="0.2">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;20,-4;0,0" dur="20s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══════ VIGNETTE ═══════ */}
          <rect width="1440" height="900" fill="url(#authVignette)" />
        </svg>
      </div>

      {/* ─── Subtle ambient glow ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,30,56,0.3) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}