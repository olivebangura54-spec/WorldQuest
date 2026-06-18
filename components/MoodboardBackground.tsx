"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full moodboard-style illustrated background matching the Japan mountain scene:
 *   • Gradient sunset sky (deep purple → warm orange/pink)
 *   • Layered mountain ranges with atmospheric haze & snow caps
 *   • Cloud wisps drifting slowly
 *   • Birds in V-formation
 *   • Traveler silhouette with conical hat (right foreground)
 *   • Grass / reeds in foreground
 *   • Water reflection at base
 *   • Vignette darkening at edges
 *   • Parallax: moves at 35% of scroll speed
 */
export default function MoodboardBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const parallaxOffset = scrollY * 0.35;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ─── Parallax wrapper ─── */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: "130%",
          transform: `translate3d(0, ${-parallaxOffset}px, 0)`,
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* ── Sky gradient ── */}
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#12091f" />
              <stop offset="10%"  stopColor="#1c0f35" />
              <stop offset="20%"  stopColor="#2d1854" />
              <stop offset="30%"  stopColor="#4a1a50" />
              <stop offset="40%"  stopColor="#6e2858" />
              <stop offset="50%"  stopColor="#b04a62" />
              <stop offset="58%"  stopColor="#d87a52" />
              <stop offset="66%"  stopColor="#e89a50" />
              <stop offset="74%"  stopColor="#f2b84a" />
              <stop offset="82%"  stopColor="#f5c848" />
              <stop offset="90%"  stopColor="#e89a50" />
              <stop offset="100%" stopColor="#2a1040" />
            </linearGradient>

            {/* ── Sun glow ── */}
            <radialGradient id="sunGlow" cx="60%" cy="55%" r="30%">
              <stop offset="0%"  stopColor="#fff8e0" stopOpacity="0.6" />
              <stop offset="25%" stopColor="#ffe880" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#f5b74a" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* ── Mountain layers ── */}
            <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#6a3878" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#351a50" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mtnMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#4a2060" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#201038" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#2a1545" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#120a22" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#18102a" />
              <stop offset="100%" stopColor="#0a0818" />
            </linearGradient>

            {/* ── Cloud fills ── */}
            <radialGradient id="cloud1" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#d8a0c0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cloud2" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#f5c080" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cloud3" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#c890d8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* ── Warm cloud near mountains ── */}
            <radialGradient id="warmCloud" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#e8a070" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* ── Vignette ── */}
            <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
              <stop offset="35%" stopColor="transparent" stopOpacity="0" />
              <stop offset="100%" stopColor="#0a0818" stopOpacity="0.65" />
            </radialGradient>

            {/* ── Traveler hat ── */}
            <linearGradient id="hatGrad" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%"  stopColor="#d4a848" />
              <stop offset="60%" stopColor="#a07828" />
              <stop offset="100%" stopColor="#785818" />
            </linearGradient>

            {/* ── Water ── */}
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#4a2060" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#2a1545" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0a0818" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* ═══════ SKY ═══════ */}
          <rect width="1440" height="900" fill="url(#sky)" />
          <rect width="1440" height="900" fill="url(#sunGlow)" />

          {/* ═══════ STARS ═══════ */}
          <g opacity="0.55">
            {([
              [100,35,1.1],[250,60,0.7],[420,22,0.9],[580,48,0.6],[740,28,1.0],
              [900,55,0.8],[1060,18,1.2],[1220,42,0.5],[1370,30,0.9],[180,80,0.4],
              [480,72,0.7],[680,12,0.9],[880,65,0.6],[1020,38,0.8],[1280,75,0.5],
              [330,90,0.4],[530,52,1.0],[830,35,0.7],[1130,62,0.6],[1390,20,0.8],
              [65,52,0.5],[160,100,0.3],[300,40,0.7],[460,85,0.4],[620,25,0.8],
              [790,70,0.5],[940,15,0.9],[1100,48,0.6],[1260,80,0.4],[1410,35,0.7],
            ] as [number, number, number][]).map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="white"
                opacity={0.25 + (i % 5) * 0.1} />
            ))}
          </g>

          {/* ═══════ CLOUD WISPS (upper sky) ═══════ */}
          <ellipse cx="280" cy="200" rx="240" ry="38" fill="url(#cloud1)" opacity="0.45">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;18,-6;0,0" dur="24s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="850" cy="170" rx="200" ry="30" fill="url(#cloud3)" opacity="0.35">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;-14,5;0,0" dur="30s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1250" cy="230" rx="260" ry="32" fill="url(#cloud2)" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;20,-4;0,0" dur="27s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══════ FAR MOUNTAIN RANGE (main peak — Fuji-like) ═══════ */}
          <g>
            {/* Left far range */}
            <path d="M0,490 L80,420 L160,445 L260,385 L340,410 L420,365 L500,390 L580,355 L640,380 L640,560 L0,560 Z"
              fill="url(#mtnFar)" />

            {/* Main center-right peak */}
            <path d="M580,530 L780,280 L800,290 L850,320 L900,295 L960,340 L1010,315 L1080,380 L1130,360 L1220,430 L1300,400 L1440,440 L1440,570 L580,570 Z"
              fill="url(#mtnFar)" />

            {/* Snow caps */}
            <path d="M750,310 L780,280 L800,290 L825,305 L805,310 L775,315 Z"
              fill="rgba(255,255,255,0.4)" />
            <path d="M880,310 L900,295 L920,305 L910,310 L895,312 Z"
              fill="rgba(255,255,255,0.3)" />
            <path d="M990,330 L1010,315 L1030,325 L1020,330 L1005,332 Z"
              fill="rgba(255,255,255,0.2)" />

            {/* Warm sunset highlight on right face of main peak */}
            <path d="M780,280 L900,295 L960,340 L1010,315 L1080,380 L1130,360 L1220,430 L1300,400 L1440,440 L1440,570 L900,570 Z"
              fill="rgba(240,150,80,0.12)" />
          </g>

          {/* ═══════ WARM CLOUDS near mountain peaks ═══════ */}
          <ellipse cx="700" cy="320" rx="180" ry="30" fill="url(#warmCloud)" opacity="0.5">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;12,-3;0,0" dur="20s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1000" cy="350" rx="200" ry="28" fill="url(#cloud1)" opacity="0.35">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;-10,4;0,0" dur="26s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="500" cy="360" rx="160" ry="25" fill="url(#cloud3)" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;8,-2;0,0" dur="22s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══════ MID MOUNTAIN RANGE ═══════ */}
          <g>
            <path d="M0,550 L60,490 L140,515 L240,455 L340,480 L440,435 L540,460 L640,415 L740,445 L840,405 L940,435 L1040,395 L1140,425 L1240,390 L1340,415 L1440,400 L1440,610 L0,610 Z"
              fill="url(#mtnMid)" />
            {/* Highlight edge */}
            <path d="M640,415 L740,445 L840,405 L940,435 L1040,395 L1140,425 L1240,390 L1340,415 L1440,400"
              stroke="rgba(200,120,170,0.2)" strokeWidth="1.5" fill="none" />
          </g>

          {/* ═══════ MID-HEIGHT CLOUD WISPS ═══════ */}
          <ellipse cx="180" cy="460" rx="220" ry="28" fill="url(#cloud3)" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;12,-4;0,0" dur="28s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="680" cy="430" rx="180" ry="22" fill="url(#cloud1)" opacity="0.25">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;-10,3;0,0" dur="24s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1150" cy="450" rx="200" ry="25" fill="url(#warmCloud)" opacity="0.3">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;15,-5;0,0" dur="22s" repeatCount="indefinite" />
          </ellipse>

          {/* ═══════ NEAR MOUNTAIN RANGE ═══════ */}
          <g>
            <path d="M0,610 L100,545 L200,570 L320,520 L440,550 L560,510 L680,540 L800,500 L920,530 L1040,495 L1160,520 L1280,500 L1440,520 L1440,670 L0,670 Z"
              fill="url(#mtnNear)" />
          </g>

          {/* ═══════ WATER / LAKE REFLECTION ═══════ */}
          <rect x="0" y="630" width="1440" height="60" fill="url(#water)" opacity="0.5" />
          {/* Shimmer lines */}
          <g opacity="0.2">
            <line x1="80" y1="648" x2="320" y2="648" stroke="#f5b74a" strokeWidth="0.8">
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="480" y1="658" x2="680" y2="658" stroke="#e89a50" strokeWidth="0.6">
              <animate attributeName="opacity" values="0.12;0.3;0.12" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="880" y1="652" x2="1120" y2="652" stroke="#f5c060" strokeWidth="0.8">
              <animate attributeName="opacity" values="0.1;0.28;0.1" dur="3.5s" repeatCount="indefinite" />
            </line>
          </g>

          {/* ═══════ FOREGROUND GROUND ═══════ */}
          <path d="M0,670 L80,655 L180,662 L320,645 L460,658 L600,640 L740,652 L880,635 L1020,648 L1160,638 L1300,650 L1440,642 L1440,900 L0,900 Z"
            fill="url(#ground)" />

          {/* ═══════ GRASS / REEDS ═══════ */}
          <g opacity="0.75">
            {/* Left grass cluster */}
            <path d="M50,662 Q56,628 48,595" stroke="#2a5a3a" strokeWidth="2.5" fill="none" />
            <path d="M62,660 Q68,625 58,590" stroke="#1e4a2e" strokeWidth="2" fill="none" />
            <path d="M74,664 Q82,632 72,598" stroke="#2a5a3a" strokeWidth="2.5" fill="none" />
            <path d="M38,666 Q30,635 36,602" stroke="#1e4a2e" strokeWidth="2" fill="none" />
            <path d="M88,660 Q95,630 85,600" stroke="#2a5a3a" strokeWidth="2" fill="none" />

            {/* Right foreground grass (taller, more prominent — near traveler) */}
            <path d="M1280,648 Q1290,605 1275,565" stroke="#2a5a3a" strokeWidth="3" fill="none" />
            <path d="M1300,650 Q1310,610 1298,570" stroke="#1e4a2e" strokeWidth="2.5" fill="none" />
            <path d="M1320,645 Q1335,600 1318,558" stroke="#2a5a3a" strokeWidth="3" fill="none" />
            <path d="M1340,648 Q1350,608 1335,568" stroke="#1e4a2e" strokeWidth="2" fill="none" />
            <path d="M1260,652 Q1255,615 1265,578" stroke="#2a5a3a" strokeWidth="2.5" fill="none" />
            <path d="M1360,650 Q1370,612 1358,575" stroke="#1e4a2e" strokeWidth="2" fill="none" />

            {/* Scattered mid-ground grass tufts */}
            {[150, 300, 450, 600, 750, 900, 1050].map((x, i) => (
              <g key={i}>
                <path d={`M${x},655 Q${x+6},${620-i*2} ${x-2},${590-i*3}`}
                  stroke="#2a5a3a" strokeWidth="1.8" fill="none" />
                <path d={`M${x+18},658 Q${x+24},${625-i*2} ${x+14},${595-i*2}`}
                  stroke="#1e4a2e" strokeWidth="1.2" fill="none" />
              </g>
            ))}
          </g>

          {/* ═══════ ROCKS ═══════ */}
          <g>
            <ellipse cx="160" cy="668" rx="35" ry="14" fill="#1a1030" />
            <ellipse cx="1200" cy="660" rx="28" ry="11" fill="#1a1030" />
            <ellipse cx="1260" cy="666" rx="22" ry="9" fill="#150d28" />
          </g>

          {/* ═══════ TRAVELER SILHOUETTE (right side, seated on rock) ═══════ */}
          <g transform="translate(1190, 520)" opacity="0.95">
            {/* Cloak / body */}
            <path d="M0,90 Q-18,70 -24,35 Q-22,12 -12,0 Q0,-18 18,-6 Q30,6 34,30 Q36,55 30,90 Z"
              fill="#0e0a1c" />
            {/* Head */}
            <circle cx="10" cy="-12" r="15" fill="#0e0a1c" />
            {/* Conical hat */}
            <path d="M-20,-18 L10,-44 L40,-18 Z" fill="url(#hatGrad)" opacity="0.9" />
            <path d="M-20,-18 L10,-26 L40,-18 Z" fill="#0e0a1c" opacity="0.25" />
            {/* Hat rim */}
            <path d="M-22,-18 L42,-18" stroke="rgba(200,160,80,0.25)" strokeWidth="1.2" fill="none" />
            {/* Staff */}
            <line x1="34" y1="-6" x2="42" y2="90" stroke="#0e0a1c" strokeWidth="3.5" />
            {/* Pack */}
            <rect x="-22" y="18" width="16" height="28" rx="4" fill="#0e0a1c" />
            {/* Cloak fabric detail */}
            <path d="M-24,35 Q-30,58 -18,90" stroke="rgba(180,120,60,0.12)" strokeWidth="1" fill="none" />
            <path d="M34,30 Q38,55 28,90" stroke="rgba(180,120,60,0.08)" strokeWidth="1" fill="none" />
          </g>

          {/* ═══════ BIRDS (V-formation) ═══════ */}
          <g fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round">
            {/* Main V-formation (right of center) */}
            <path d="M820,195 Q826,189 832,195 Q838,189 844,195" />
            <path d="M850,183 Q855,178 860,183 Q865,178 870,183" />
            <path d="M878,192 Q882,188 886,192 Q890,188 894,192" />
            <path d="M800,205 Q804,200 808,205 Q812,200 816,205" />
            <path d="M905,200 Q908,196 911,200 Q914,196 917,200" />

            {/* Scattered birds */}
            <path d="M450,215 Q454,210 458,215 Q462,210 466,215" />
            <path d="M560,175 Q563,171 566,175 Q569,171 572,175" />
            <path d="M350,230 Q353,226 356,230 Q359,226 362,230" />
            <path d="M1000,165 Q1003,161 1006,165 Q1009,161 1012,165" />
            <path d="M1120,200 Q1123,196 1126,200 Q1129,196 1132,200" />
            <path d="M250,195 Q253,191 256,195 Q259,191 262,195" />
          </g>

          {/* ═══════ SUN DISC (warm glow behind mountains) ═══════ */}
          <circle cx="840" cy="380" r="50" fill="#fff8e0" opacity="0.2" />
          <circle cx="840" cy="380" r="38" fill="#fff8e0" opacity="0.12" />

          {/* ═══════ VIGNETTE ═══════ */}
          <rect width="1440" height="900" fill="url(#vignette)" />
        </svg>
      </div>

      {/* ─── Dark gradient overlay for text readability ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,8,24,0.3) 0%, rgba(10,8,24,0.15) 30%, rgba(10,8,24,0.05) 50%, rgba(10,8,24,0.2) 75%, rgba(10,8,24,0.55) 100%)",
        }}
      />

      {/* ─── Additional CSS vignette ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 55% 50%, transparent 25%, rgba(10,8,24,0.5) 100%)",
        }}
      />
    </div>
  );
}