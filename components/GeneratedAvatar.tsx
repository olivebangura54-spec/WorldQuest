"use client";

/**
 * GeneratedAvatar — Renders a stylized adventure/explorer SVG avatar.
 * Uses layered SVG silhouettes with adventure-themed parts.
 * NEVER shows raw photos.
 */

export type AvatarBase =
  | "pathfinder"
  | "treasure_hunter"
  | "mountain_scout"
  | "mystic_navigator"
  | "jungle_ranger";

export type AvatarHair =
  | "windswept"
  | "braided"
  | "bandana"
  | "hooded"
  | "bald_tattoos";

export type AvatarOutfit =
  | "leather"
  | "cloak"
  | "vest"
  | "robes"
  | "camo";

export type AvatarFrame =
  | "compass"
  | "map"
  | "rope"
  | "crystal"
  | "leaf";

export type AvatarAccessory =
  | "hat"
  | "compass"
  | "goggles"
  | "rope"
  | "lantern"
  | "backpack"
  | "dagger"
  | "journal";

export interface AvatarData {
  base: string;
  face?: string;
  hair?: string;
  outfit?: string;
  accessories?: string[];
  frame?: string;
  photoUrl?: string;
  detectedHair?: string;
  detectedSkin?: string;
  detectedEyes?: string;
}

/* ═══════════════════════════════════════════
   COLOR MAPS
   ═══════════════════════════════════════════ */

const HAIR_COLORS: Record<string, string> = {
  "Raven Black": "#1a1a2e",
  "Dark Brown": "#3d2314",
  "Chestnut": "#6b3a2a",
  "Auburn": "#8b3a2a",
  "Golden Blonde": "#c8a850",
  "Platinum Blonde": "#e8d8b0",
  "Copper Red": "#b5523a",
  "Silver": "#b8b8c8",
  "White": "#e8e8f0",
};

const SKIN_TONES: Record<string, string> = {
  "Porcelain": "#fde8d8",
  "Fair": "#f5d0a9",
  "Warm Beige": "#e0ac69",
  "Warm Bronze": "#c68642",
  "Caramel": "#a0642e",
  "Rich Brown": "#7a4422",
  "Deep Mahogany": "#4a2810",
  "Dark Ebony": "#2a1508",
};

const EYE_GLOWS: Record<string, string> = {
  "Deep Blue": "#3a6ea5",
  "Ocean Blue": "#4a90d9",
  "Emerald Green": "#2e8b57",
  "Hazel": "#8b7355",
  "Warm Brown": "#6b4423",
  "Dark Amber": "#5a3a1a",
  "Mystic Purple": "#6a3d8a",
  "Storm Grey": "#7a7a8a",
};

/* ═══════════════════════════════════════════
   ADVENTURE PALETTE PER BASE
   ═══════════════════════════════════════════ */

const BASE_PALETTES: Record<string, { primary: string; secondary: string; accent: string; bg: string }> = {
  pathfinder: { primary: "#8B6914", secondary: "#5C4033", accent: "#C4A265", bg: "#1a1a2e" },
  treasure_hunter: { primary: "#C49B3F", secondary: "#8B6508", accent: "#FFD700", bg: "#2a1f0e" },
  mountain_scout: { primary: "#6B8E6B", secondary: "#4A6741", accent: "#A8D5A2", bg: "#0e1a14" },
  mystic_navigator: { primary: "#4A6FA5", secondary: "#2E4A7A", accent: "#7EB8E6", bg: "#0e1428" },
  jungle_ranger: { primary: "#5B7A3A", secondary: "#3D5A20", accent: "#8FBF5F", bg: "#141a0e" },
};

/* ═══════════════════════════════════════════
   FRAME STYLES
   ═══════════════════════════════════════════ */

const FRAME_CONFIGS: Record<string, { color: string; glow: string }> = {
  compass: { color: "#C4A265", glow: "rgba(196,162,101,0.4)" },
  map: { color: "#D4A574", glow: "rgba(212,165,116,0.3)" },
  rope: { color: "#8B7355", glow: "rgba(139,115,85,0.3)" },
  crystal: { color: "#22d3ee", glow: "rgba(34,211,238,0.4)" },
  leaf: { color: "#22c55e", glow: "rgba(34,197,94,0.4)" },
};

/* ═══════════════════════════════════════════
   SVG SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function BaseSilhouette({ base, skinColor }: { base: string; skinColor: string }) {
  const palette = BASE_PALETTES[base] || BASE_PALETTES.pathfinder;

  switch (base) {
    case "treasure_hunter":
      return (
        <g>
          {/* Body */}
          <ellipse cx="100" cy="155" rx="38" ry="45" fill={palette.primary} />
          {/* Shoulders */}
          <ellipse cx="100" cy="125" rx="42" ry="18" fill={palette.primary} />
          {/* Neck */}
          <rect x="90" y="88" width="20" height="18" rx="4" fill={skinColor} />
          {/* Head */}
          <ellipse cx="100" cy="72" rx="28" ry="30" fill={skinColor} />
          {/* Fedora hat */}
          <ellipse cx="100" cy="48" rx="36" ry="8" fill={palette.secondary} />
          <path d="M72 48 Q80 28 100 24 Q120 28 128 48" fill={palette.secondary} />
          <rect x="80" y="44" width="40" height="5" rx="2" fill={palette.accent} opacity="0.6" />
          {/* Vest detail */}
          <path d="M82 115 L78 155 L100 160 L122 155 L118 115" fill={palette.secondary} opacity="0.5" />
          {/* Belt */}
          <rect x="78" y="140" width="44" height="5" rx="2" fill={palette.secondary} />
          <circle cx="100" cy="142" r="3" fill={palette.accent} />
        </g>
      );

    case "mountain_scout":
      return (
        <g>
          {/* Cloak body */}
          <path d="M60 160 Q60 110 78 100 L100 95 L122 100 Q140 110 140 160 Z" fill={palette.primary} />
          {/* Cloak drape */}
          <path d="M65 130 Q60 160 55 180 L100 175 L145 180 Q140 160 135 130" fill={palette.primary} opacity="0.7" />
          {/* Shoulders */}
          <ellipse cx="100" cy="108" rx="38" ry="14" fill={palette.secondary} />
          {/* Neck */}
          <rect x="90" y="85" width="20" height="16" rx="4" fill={skinColor} />
          {/* Head */}
          <ellipse cx="100" cy="70" rx="27" ry="29" fill={skinColor} />
          {/* Hood outline */}
          <path d="M70 72 Q70 35 100 30 Q130 35 130 72" fill="none" stroke={palette.secondary} strokeWidth="3" />
          {/* Belt */}
          <rect x="82" y="138" width="36" height="4" rx="2" fill={palette.secondary} />
          {/* Boot hints */}
          <rect x="78" y="168" width="14" height="10" rx="3" fill={palette.secondary} />
          <rect x="108" y="168" width="14" height="10" rx="3" fill={palette.secondary} />
        </g>
      );

    case "mystic_navigator":
      return (
        <g>
          {/* Robes */}
          <path d="M68 165 Q65 120 80 105 L100 100 L120 105 Q135 120 132 165 Z" fill={palette.primary} />
          {/* Inner robe */}
          <path d="M85 115 L82 165 L100 168 L118 165 L115 115" fill={palette.secondary} opacity="0.4" />
          {/* Shoulders */}
          <ellipse cx="100" cy="108" rx="36" ry="12" fill={palette.primary} />
          {/* Neck */}
          <rect x="91" y="86" width="18" height="16" rx="4" fill={skinColor} />
          {/* Head */}
          <ellipse cx="100" cy="70" rx="26" ry="28" fill={skinColor} />
          {/* Star chart on chest */}
          <circle cx="100" cy="130" r="8" fill="none" stroke={palette.accent} strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="130" r="4" fill={palette.accent} opacity="0.3" />
          <line x1="93" y1="125" x2="107" y2="135" stroke={palette.accent} strokeWidth="0.5" opacity="0.4" />
          <line x1="107" y1="125" x2="93" y2="135" stroke={palette.accent} strokeWidth="0.5" opacity="0.4" />
          {/* Star dots */}
          <circle cx="95" cy="122" r="1" fill={palette.accent} opacity="0.5" />
          <circle cx="106" cy="127" r="1" fill={palette.accent} opacity="0.5" />
          <circle cx="98" cy="137" r="1" fill={palette.accent} opacity="0.5" />
          {/* Sash */}
          <path d="M88 110 L100 115 L112 110" fill="none" stroke={palette.accent} strokeWidth="2" opacity="0.5" />
        </g>
      );

    case "jungle_ranger":
      return (
        <g>
          {/* Lean body */}
          <ellipse cx="100" cy="152" rx="34" ry="42" fill={palette.primary} />
          {/* Shoulders - asymmetric for machete arm */}
          <ellipse cx="100" cy="120" rx="40" ry="16" fill={palette.primary} />
          {/* Neck */}
          <rect x="91" y="88" width="18" height="16" rx="4" fill={skinColor} />
          {/* Head */}
          <ellipse cx="100" cy="72" rx="26" ry="28" fill={skinColor} />
          {/* Camo pattern */}
          <ellipse cx="88" cy="140" rx="8" ry="5" fill={palette.secondary} opacity="0.4" />
          <ellipse cx="112" cy="148" rx="6" ry="4" fill={palette.secondary} opacity="0.3" />
          <ellipse cx="95" cy="158" rx="7" ry="4" fill={palette.secondary} opacity="0.35" />
          {/* Utility belt */}
          <rect x="76" y="142" width="48" height="5" rx="2" fill={palette.secondary} />
          <rect x="74" y="140" width="8" height="8" rx="2" fill={palette.accent} opacity="0.5" />
          <rect x="118" y="140" width="8" height="8" rx="2" fill={palette.accent} opacity="0.5" />
          {/* Arm wraps */}
          <rect x="58" y="118" width="12" height="20" rx="4" fill={skinColor} opacity="0.7" />
          <rect x="130" y="118" width="12" height="20" rx="4" fill={skinColor} opacity="0.7" />
        </g>
      );

    default: // pathfinder
      return (
        <g>
          {/* Body */}
          <ellipse cx="100" cy="152" rx="36" ry="44" fill={palette.primary} />
          {/* Shoulders */}
          <ellipse cx="100" cy="122" rx="40" ry="16" fill={palette.primary} />
          {/* Neck */}
          <rect x="90" y="88" width="20" height="16" rx="4" fill={skinColor} />
          {/* Head */}
          <ellipse cx="100" cy="72" rx="28" ry="30" fill={skinColor} />
          {/* Leather vest */}
          <path d="M82 115 L78 155 L100 160 L122 155 L118 115" fill={palette.secondary} opacity="0.5" />
          {/* Vest straps */}
          <line x1="88" y1="105" x2="85" y2="145" stroke={palette.secondary} strokeWidth="2.5" opacity="0.6" />
          <line x1="112" y1="105" x2="115" y2="145" stroke={palette.secondary} strokeWidth="2.5" opacity="0.6" />
          {/* Belt */}
          <rect x="78" y="140" width="44" height="5" rx="2" fill={palette.secondary} />
          <circle cx="100" cy="142" r="3" fill={palette.accent} />
          {/* Compass on chest */}
          <circle cx="100" cy="128" r="6" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.7" />
          <line x1="100" y1="123" x2="100" y2="128" stroke={palette.accent} strokeWidth="1" opacity="0.6" />
          <line x1="100" y1="128" x2="104" y2="130" stroke={palette.accent} strokeWidth="1" opacity="0.6" />
        </g>
      );
  }
}

function HairOverlay({ hair, hairColor, base }: { hair: string; hairColor: string; base: string }) {
  switch (hair) {
    case "windswept":
      return (
        <g>
          {/* Flowing messy hair */}
          <path
            d="M72 65 Q68 45 75 35 Q85 25 100 28 Q115 25 125 35 Q132 45 128 65"
            fill={hairColor}
          />
          {/* Wind-swept strands */}
          <path d="M72 55 Q60 50 55 42" fill="none" stroke={hairColor} strokeWidth="5" strokeLinecap="round" />
          <path d="M70 48 Q62 40 58 32" fill="none" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M128 52 Q136 46 140 38" fill="none" stroke={hairColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M126 46 Q132 38 135 30" fill="none" stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
          {/* Side tufts */}
          <path d="M73 60 Q68 58 66 65" fill={hairColor} />
          <path d="M127 60 Q132 58 134 65" fill={hairColor} />
        </g>
      );

    case "braided":
      return (
        <g>
          {/* Hair top */}
          <path
            d="M72 68 Q70 45 80 35 Q90 28 100 30 Q110 28 120 35 Q130 45 128 68"
            fill={hairColor}
          />
          {/* Center part */}
          <path d="M100 30 L100 42" stroke={hairColor} strokeWidth="2" opacity="0.5" />
          {/* Left braid */}
          <path
            d="M78 58 Q72 65 70 80 Q68 95 72 110"
            fill="none"
            stroke={hairColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Braid texture */}
          <path
            d="M78 58 Q72 65 70 80 Q68 95 72 110"
            fill="none"
            stroke={hairColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="6 4"
            opacity="0.3"
          />
          {/* Right braid */}
          <path
            d="M122 58 Q128 65 130 80 Q132 95 128 110"
            fill="none"
            stroke={hairColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M122 58 Q128 65 130 80 Q132 95 128 110"
            fill="none"
            stroke={hairColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="6 4"
            opacity="0.3"
          />
        </g>
      );

    case "bandana":
      return (
        <g>
          {/* Hair underneath */}
          <path
            d="M74 68 Q72 50 82 40 Q92 34 100 36 Q108 34 118 40 Q128 50 126 68"
            fill={hairColor}
          />
          {/* Bandana wrap */}
          <path
            d="M72 55 Q72 40 85 34 Q95 30 100 30 Q105 30 115 34 Q128 40 128 55"
            fill="#b5523a"
            opacity="0.85"
          />
          {/* Bandana knot tails */}
          <path d="M128 48 Q138 42 142 35" fill="none" stroke="#b5523a" strokeWidth="4" strokeLinecap="round" />
          <path d="M128 52 Q136 48 140 42" fill="none" stroke="#b5523a" strokeWidth="3" strokeLinecap="round" />
          {/* Bandana edge detail */}
          <path
            d="M72 55 Q72 40 85 34 Q95 30 100 30 Q105 30 115 34 Q128 40 128 55"
            fill="none"
            stroke="#8b3a2a"
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Hair showing below */}
          <path d="M74 58 Q72 65 74 72" fill={hairColor} opacity="0.7" />
          <path d="M126 58 Q128 65 126 72" fill={hairColor} opacity="0.7" />
        </g>
      );

    case "hooded":
      return (
        <g>
          {/* Hood */}
          <path
            d="M65 85 Q60 55 68 38 Q78 24 100 20 Q122 24 132 38 Q140 55 135 85"
            fill={BASE_PALETTES[base]?.secondary || "#5C4033"}
            opacity="0.9"
          />
          {/* Hood shadow/depth */}
          <path
            d="M72 82 Q68 55 76 42 Q85 32 100 30 Q115 32 124 42 Q132 55 128 82"
            fill={BASE_PALETTES[base]?.primary || "#8B6914"}
            opacity="0.6"
          />
          {/* Hair peeking */}
          <path d="M82 68 Q80 75 82 80" fill={hairColor} opacity="0.5" />
          <path d="M118 68 Q120 75 118 80" fill={hairColor} opacity="0.5" />
        </g>
      );

    case "bald_tattoos":
      return (
        <g>
          {/* Bald head - just the skin (no extra hair) */}
          {/* Tattoo marks */}
          <path d="M88 50 Q90 42 95 45" fill="none" stroke={BASE_PALETTES[base]?.accent || "#C4A265"} strokeWidth="1" opacity="0.5" />
          <path d="M105 48 Q108 42 112 46" fill="none" stroke={BASE_PALETTES[base]?.accent || "#C4A265"} strokeWidth="1" opacity="0.5" />
          <circle cx="100" cy="42" r="2" fill="none" stroke={BASE_PALETTES[base]?.accent || "#C4A265"} strokeWidth="1" opacity="0.4" />
          {/* Tribal marks */}
          <path d="M85 58 L82 52 L88 55" fill={BASE_PALETTES[base]?.accent || "#C4A265"} opacity="0.3" />
          <path d="M115 58 L118 52 L112 55" fill={BASE_PALETTES[base]?.accent || "#C4A265"} opacity="0.3" />
        </g>
      );

    default: // No hair / bald
      return null;
  }
}

function OutfitOverlay({ outfit, palette }: { outfit: string; palette: { primary: string; secondary: string; accent: string } }) {
  switch (outfit) {
    case "cloak":
      return (
        <g>
          {/* Cloak drape over shoulders */}
          <path
            d="M55 120 Q55 100 68 95 L100 90 L132 95 Q145 100 145 120 L148 170 L100 175 L52 170 Z"
            fill={palette.primary}
            opacity="0.7"
          />
          {/* Cloak clasp */}
          <circle cx="100" cy="98" r="4" fill={palette.accent} opacity="0.8" />
          {/* Map scroll hint */}
          <rect x="115" y="130" width="4" height="20" rx="2" fill={palette.accent} opacity="0.3" />
        </g>
      );

    case "vest":
      return (
        <g>
          {/* Vest overlay */}
          <path
            d="M80 108 L76 150 L100 155 L124 150 L120 108 Z"
            fill={palette.secondary}
            opacity="0.5"
          />
          {/* Vest front opening */}
          <line x1="100" y1="108" x2="100" y2="155" stroke={palette.primary} strokeWidth="2" opacity="0.3" />
          {/* Harness straps */}
          <line x1="85" y1="100" x2="95" y2="130" stroke={palette.accent} strokeWidth="2" opacity="0.4" />
          <line x1="115" y1="100" x2="105" y2="130" stroke={palette.accent} strokeWidth="2" opacity="0.4" />
        </g>
      );

    case "robes":
      return (
        <g>
          {/* Flowing robes */}
          <path
            d="M68 105 Q65 120 62 165 L100 170 L138 165 Q135 120 132 105"
            fill={palette.primary}
            opacity="0.6"
          />
          {/* Inner robe glow */}
          <path
            d="M88 115 L85 165 L100 168 L115 165 L112 115"
            fill={palette.accent}
            opacity="0.15"
          />
          {/* Star chart symbols */}
          <circle cx="95" cy="135" r="1.5" fill={palette.accent} opacity="0.4" />
          <circle cx="105" cy="140" r="1" fill={palette.accent} opacity="0.3" />
          <circle cx="100" cy="128" r="1.5" fill={palette.accent} opacity="0.4" />
          <path d="M92 132 L95 128 L98 132" fill="none" stroke={palette.accent} strokeWidth="0.5" opacity="0.3" />
        </g>
      );

    case "camo":
      return (
        <g>
          {/* Camo pattern overlay */}
          <ellipse cx="88" cy="135" rx="10" ry="6" fill={palette.secondary} opacity="0.35" />
          <ellipse cx="112" cy="142" rx="8" ry="5" fill={palette.secondary} opacity="0.3" />
          <ellipse cx="95" cy="155" rx="9" ry="5" fill={palette.secondary} opacity="0.25" />
          <ellipse cx="108" cy="128" rx="7" ry="4" fill={palette.secondary} opacity="0.3" />
          {/* Utility straps */}
          <path d="M85 110 L100 115 L115 110" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.4" />
        </g>
      );

    default: // leather
      return (
        <g>
          {/* Leather jacket */}
          <path
            d="M80 108 L76 148 L100 153 L124 148 L120 108 Z"
            fill={palette.secondary}
            opacity="0.45"
          />
          {/* Collar */}
          <path d="M85 105 L82 112 L100 115 L118 112 L115 105" fill={palette.secondary} opacity="0.3" />
          {/* Satchel strap */}
          <line x1="85" y1="100" x2="115" y2="145" stroke={palette.accent} strokeWidth="2" opacity="0.3" />
        </g>
      );
  }
}

function AccessoryOverlay({ accessory, palette }: { accessory: string; palette: { primary: string; secondary: string; accent: string } }) {
  switch (accessory) {
    case "hat":
      return (
        <g>
          {/* Explorer hat / pith helmet */}
          <ellipse cx="100" cy="42" rx="34" ry="8" fill={palette.secondary} />
          <path d="M72 42 Q78 26 100 22 Q122 26 128 42" fill={palette.secondary} />
          <rect x="82" y="38" width="36" height="4" rx="2" fill={palette.accent} opacity="0.5" />
        </g>
      );

    case "compass":
      return (
        <g>
          {/* Compass necklace on chest */}
          <circle cx="100" cy="125" r="7" fill="none" stroke={palette.accent} strokeWidth="1.5" opacity="0.8" />
          <circle cx="100" cy="125" r="4" fill="none" stroke={palette.accent} strokeWidth="0.8" opacity="0.5" />
          <line x1="100" y1="119" x2="100" y2="125" stroke={palette.accent} strokeWidth="1" opacity="0.7" />
          <line x1="100" y1="125" x2="105" y2="128" stroke="#e74c3c" strokeWidth="1" opacity="0.6" />
          {/* Chain */}
          <path d="M93 92 Q88 100 88 110 Q88 118 93 125" fill="none" stroke={palette.accent} strokeWidth="0.8" opacity="0.4" />
          <path d="M107 92 Q112 100 112 110 Q112 118 107 125" fill="none" stroke={palette.accent} strokeWidth="0.8" opacity="0.4" />
        </g>
      );

    case "goggles":
      return (
        <g>
          {/* Goggles on forehead */}
          <ellipse cx="90" cy="52" rx="9" ry="7" fill="none" stroke={palette.accent} strokeWidth="2" opacity="0.7" />
          <ellipse cx="110" cy="52" rx="9" ry="7" fill="none" stroke={palette.accent} strokeWidth="2" opacity="0.7" />
          <line x1="99" y1="52" x2="101" y2="52" stroke={palette.accent} strokeWidth="2" opacity="0.7" />
          {/* Lens glint */}
          <ellipse cx="88" cy="50" rx="3" ry="2" fill={palette.accent} opacity="0.15" />
          <ellipse cx="108" cy="50" rx="3" ry="2" fill={palette.accent} opacity="0.15" />
          {/* Strap */}
          <path d="M81 52 Q75 52 72 55" fill="none" stroke={palette.secondary} strokeWidth="1.5" opacity="0.5" />
          <path d="M119 52 Q125 52 128 55" fill="none" stroke={palette.secondary} strokeWidth="1.5" opacity="0.5" />
        </g>
      );

    case "rope":
      return (
        <g>
          {/* Rope coiled on shoulder */}
          <ellipse cx="130" cy="115" rx="10" ry="12" fill="none" stroke="#c4a265" strokeWidth="3" opacity="0.6" />
          <ellipse cx="130" cy="115" rx="6" ry="8" fill="none" stroke="#c4a265" strokeWidth="2.5" opacity="0.5" />
          <ellipse cx="130" cy="115" rx="3" ry="4" fill="none" stroke="#c4a265" strokeWidth="2" opacity="0.4" />
        </g>
      );

    case "lantern":
      return (
        <g>
          {/* Crystal lantern hanging */}
          <rect x="56" y="120" width="8" height="12" rx="2" fill={palette.accent} opacity="0.5" />
          <line x1="60" y1="115" x2="60" y2="120" stroke={palette.accent} strokeWidth="1" opacity="0.4" />
          {/* Glow */}
          <circle cx="60" cy="126" r="6" fill={palette.accent} opacity="0.1" />
          <circle cx="60" cy="126" r="3" fill={palette.accent} opacity="0.2" />
        </g>
      );

    case "backpack":
      return (
        <g>
          {/* Backpack visible on back/side */}
          <rect x="125" y="105" width="16" height="22" rx="4" fill={palette.secondary} opacity="0.6" />
          <rect x="127" y="107" width="12" height="8" rx="2" fill={palette.secondary} opacity="0.4" />
          {/* Straps */}
          <line x1="125" y1="108" x2="118" y2="102" stroke={palette.secondary} strokeWidth="1.5" opacity="0.5" />
        </g>
      );

    case "dagger":
      return (
        <g>
          {/* Dagger on belt */}
          <line x1="120" y1="142" x2="130" y2="155" stroke="#b0b0b0" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="118" y1="140" x2="122" y2="144" stroke={palette.accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        </g>
      );

    case "journal":
      return (
        <g>
          {/* Journal/book on belt/side */}
          <rect x="56" y="138" width="10" height="14" rx="1" fill="#8B7355" opacity="0.5" />
          <line x1="58" y1="140" x2="58" y2="150" stroke="#6b5a3e" strokeWidth="1" opacity="0.4" />
          <line x1="61" y1="142" x2="64" y2="142" stroke="#6b5a3e" strokeWidth="0.5" opacity="0.3" />
          <line x1="61" y1="144" x2="64" y2="144" stroke="#6b5a3e" strokeWidth="0.5" opacity="0.3" />
          <line x1="61" y1="146" x2="63" y2="146" stroke="#6b5a3e" strokeWidth="0.5" opacity="0.3" />
        </g>
      );

    default:
      return null;
  }
}

function FaceDetails({ skinColor, eyeColor }: { skinColor: string; eyeColor: string }) {
  return (
    <g>
      {/* Eyes */}
      {/* Eye whites */}
      <ellipse cx="90" cy="68" rx="5" ry="3.5" fill="white" opacity="0.9" />
      <ellipse cx="110" cy="68" rx="5" ry="3.5" fill="white" opacity="0.9" />
      {/* Iris */}
      <circle cx="91" cy="68" r="2.5" fill={eyeColor} />
      <circle cx="111" cy="68" r="2.5" fill={eyeColor} />
      {/* Pupil */}
      <circle cx="91" cy="68" r="1.2" fill="#111" />
      <circle cx="111" cy="68" r="1.2" fill="#111" />
      {/* Eye glint */}
      <circle cx="92" cy="67" r="0.8" fill="white" opacity="0.8" />
      <circle cx="112" cy="67" r="0.8" fill="white" opacity="0.8" />
      {/* Eye glow */}
      <ellipse cx="91" cy="68" rx="4" ry="3" fill={eyeColor} opacity="0.15" />
      <ellipse cx="111" cy="68" rx="4" ry="3" fill={eyeColor} opacity="0.15" />
      {/* Eyebrows */}
      <path d="M84 63 Q90 60 96 63" fill="none" stroke={skinColor} strokeWidth="1.5" opacity="0.4" />
      <path d="M104 63 Q110 60 116 63" fill="none" stroke={skinColor} strokeWidth="1.5" opacity="0.4" />
      {/* Nose */}
      <path d="M98 72 Q100 76 102 72" fill="none" stroke={skinColor} strokeWidth="1" opacity="0.3" />
      {/* Mouth */}
      <path d="M93 80 Q100 84 107 80" fill="none" stroke={skinColor} strokeWidth="1.2" opacity="0.35" />
    </g>
  );
}

function FrameOverlay({ frame, size }: { frame: string; size: number }) {
  const config = FRAME_CONFIGS[frame] || FRAME_CONFIGS.compass;

  switch (frame) {
    case "compass":
      return (
        <g>
          {/* Compass rose border */}
          <circle cx="100" cy="100" r="96" fill="none" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
          {/* Cardinal points */}
          <path d="M100 2 L103 10 L100 7 L97 10 Z" fill={config.color} opacity="0.5" />
          <path d="M100 198 L103 190 L100 193 L97 190 Z" fill={config.color} opacity="0.5" />
          <path d="M2 100 L10 103 L7 100 L10 97 Z" fill={config.color} opacity="0.5" />
          <path d="M198 100 L190 103 L193 100 L190 97 Z" fill={config.color} opacity="0.5" />
          {/* Diagonal ticks */}
          {[45, 135, 225, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 93 * Math.cos(rad);
            const y1 = 100 + 93 * Math.sin(rad);
            const x2 = 100 + 97 * Math.cos(rad);
            const y2 = 100 + 97 * Math.sin(rad);
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={config.color} strokeWidth="1" opacity="0.3" />;
          })}
          {/* Inner circle */}
          <circle cx="100" cy="100" r="90" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
        </g>
      );

    case "map":
      return (
        <g>
          {/* Map scroll border */}
          <rect x="4" y="4" width="192" height="192" rx="12" fill="none" stroke={config.color} strokeWidth="2" opacity="0.35" />
          <rect x="8" y="8" width="184" height="184" rx="10" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
          {/* Corner marks */}
          <path d="M10 20 L10 10 L20 10" fill="none" stroke={config.color} strokeWidth="2" opacity="0.4" />
          <path d="M180 10 L190 10 L190 20" fill="none" stroke={config.color} strokeWidth="2" opacity="0.4" />
          <path d="M10 180 L10 190 L20 190" fill="none" stroke={config.color} strokeWidth="2" opacity="0.4" />
          <path d="M180 190 L190 190 L190 180" fill="none" stroke={config.color} strokeWidth="2" opacity="0.4" />
          {/* Map path decoration */}
          <path d="M15 50 Q50 45 80 55 Q120 65 150 50 Q175 40 185 55" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.2" strokeDasharray="4 3" />
        </g>
      );

    case "rope":
      return (
        <g>
          {/* Rope knot border */}
          <circle cx="100" cy="100" r="95" fill="none" stroke={config.color} strokeWidth="3" opacity="0.3" strokeDasharray="8 4" />
          <circle cx="100" cy="100" r="92" fill="none" stroke={config.color} strokeWidth="1" opacity="0.2" />
          {/* Knot at top */}
          <circle cx="100" cy="5" r="5" fill="none" stroke={config.color} strokeWidth="2" opacity="0.4" />
          <circle cx="100" cy="5" r="2" fill={config.color} opacity="0.3" />
        </g>
      );

    case "crystal":
      return (
        <g>
          {/* Crystal border */}
          <circle cx="100" cy="100" r="96" fill="none" stroke={config.color} strokeWidth="1.5" opacity="0.4" />
          <circle cx="100" cy="100" r="93" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.2" />
          {/* Crystal points */}
          {[0, 60, 120, 180, 240, 300].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 100 + 96 * Math.cos(rad);
            const cy = 100 + 96 * Math.sin(rad);
            return (
              <g key={angle}>
                <polygon
                  points={`${cx},${cy - 6} ${cx + 3},${cy} ${cx},${cy + 6} ${cx - 3},${cy}`}
                  fill={config.color}
                  opacity="0.3"
                />
              </g>
            );
          })}
          {/* Glow ring */}
          <circle cx="100" cy="100" r="88" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.15" />
        </g>
      );

    case "leaf":
      return (
        <g>
          {/* Leaf border */}
          <circle cx="100" cy="100" r="95" fill="none" stroke={config.color} strokeWidth="1.5" opacity="0.35" />
          {/* Leaf decorations around border */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 100 + 95 * Math.cos(rad);
            const cy = 100 + 95 * Math.sin(rad);
            const rot = angle + 90;
            return (
              <g key={angle} transform={`translate(${cx},${cy}) rotate(${rot})`}>
                <path d="M0,-5 Q4,-2 0,5 Q-4,-2 0,-5" fill={config.color} opacity="0.4" />
              </g>
            );
          })}
          {/* Vine line */}
          <circle cx="100" cy="100" r="90" fill="none" stroke={config.color} strokeWidth="0.5" opacity="0.15" strokeDasharray="6 4" />
        </g>
      );

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

interface GeneratedAvatarProps {
  avatarData: AvatarData;
  size?: number;
  showFrame?: boolean;
  className?: string;
}

export default function GeneratedAvatar({
  avatarData,
  size = 80,
  showFrame = true,
  className = "",
}: GeneratedAvatarProps) {
  const base = (avatarData.base || "pathfinder") as AvatarBase;
  const hair = (avatarData.hair || "windswept") as AvatarHair;
  const outfit = (avatarData.outfit || "leather") as AvatarOutfit;
  const frame = (avatarData.frame || "compass") as AvatarFrame;
  const accessories = avatarData.accessories || [];

  const skinColor = avatarData.detectedSkin ? (SKIN_TONES[avatarData.detectedSkin] || "#e0ac69") : "#e0ac69";
  const hairColor = avatarData.detectedHair ? (HAIR_COLORS[avatarData.detectedHair] || "#3d2314") : "#3d2314";
  const eyeColor = avatarData.detectedEyes ? (EYE_GLOWS[avatarData.detectedEyes] || "#6b4423") : "#6b4423";

  const palette = BASE_PALETTES[base] || BASE_PALETTES.pathfinder;
  const frameConfig = FRAME_CONFIGS[frame] || FRAME_CONFIGS.compass;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      {showFrame && frame !== "compass" && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 20px ${frameConfig.glow}, 0 0 40px ${frameConfig.glow}`,
            animation: "avatar-pulse 3s ease-in-out infinite",
          }}
        />
      )}

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="rounded-full overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${palette.bg}, #0a0a15)`,
        }}
      >
        <defs>
          {/* Radial gradient for depth */}
          <radialGradient id="bg-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={palette.bg} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0a0a15" stopOpacity="1" />
          </radialGradient>
          {/* Glow filter for eyes */}
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Ambient light */}
          <radialGradient id="ambient" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <circle cx="100" cy="100" r="100" fill="url(#bg-grad)" />
        <circle cx="100" cy="100" r="100" fill="url(#ambient)" />

        {/* Frame (behind character) */}
        {showFrame && <FrameOverlay frame={frame} size={size} />}

        {/* Base character silhouette */}
        <BaseSilhouette base={base} skinColor={skinColor} />

        {/* Outfit overlay */}
        <OutfitOverlay outfit={outfit} palette={palette} />

        {/* Hair overlay */}
        <HairOverlay hair={hair} hairColor={hairColor} base={base} />

        {/* Face details with eye glow */}
        <g filter="url(#eye-glow)">
          <FaceDetails skinColor={skinColor} eyeColor={eyeColor} />
        </g>

        {/* Accessories */}
        {accessories.map((acc) => (
          <AccessoryOverlay key={acc} accessory={acc} palette={palette} />
        ))}

        {/* Clip circle for round avatar */}
        <circle cx="100" cy="100" r="98" fill="none" stroke={frameConfig.color} strokeWidth={showFrame ? "2" : "0"} opacity="0.5" />
      </svg>

      <style jsx>{`
        @keyframes avatar-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}