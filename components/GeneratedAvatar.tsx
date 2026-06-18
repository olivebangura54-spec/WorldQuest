"use client";

/**
 * GeneratedAvatar — Renders a stylized fantasy avatar from avatar data.
 * Uses the base emoji character with frame effects and color accents.
 * Never shows raw photos.
 */

export interface AvatarData {
  base: string;        // emoji character (🛡️, 🧙, 🏹, 🧑‍🦱, etc.)
  face?: string;       // face emoji (😊, 😎, etc.)
  hair?: string;       // hair style label
  outfit?: string;     // outfit label
  accessories?: string[];
  frame?: string;      // frame style name
  photoUrl?: string;   // stored for reference only, NOT displayed
  detectedHair?: string;
  detectedSkin?: string;
  detectedEyes?: string;
}

const FRAME_STYLES: Record<string, { border: string; shadow: string; bg?: string }> = {
  None: { border: "2px solid rgba(255,255,255,0.15)", shadow: "none" },
  Wood: { border: "3px solid #b45309", shadow: "0 0 8px rgba(180,83,9,0.3)" },
  Crystal: { border: "2px solid #22d3ee", shadow: "0 0 16px rgba(34,211,238,0.4), 0 0 32px rgba(34,211,238,0.15)" },
  Fire: { border: "2px solid #f97316", shadow: "0 0 16px rgba(249,115,22,0.4), 0 0 32px rgba(249,115,22,0.15)" },
  Ice: { border: "2px solid #93c5fd", shadow: "0 0 16px rgba(147,197,253,0.4), 0 0 32px rgba(147,197,253,0.15)" },
  Nature: { border: "2px solid #22c55e", shadow: "0 0 16px rgba(34,197,94,0.4), 0 0 32px rgba(34,197,94,0.15)" },
  Shadow: { border: "2px solid #581c87", shadow: "0 0 16px rgba(88,28,135,0.4), 0 0 32px rgba(88,28,135,0.15)" },
  Light: { border: "2px solid #fde047", shadow: "0 0 20px rgba(253,224,71,0.5), 0 0 40px rgba(253,224,71,0.2)" },
};

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

interface GeneratedAvatarProps {
  avatarData: AvatarData;
  size?: number;          // pixel size (default 80)
  showFrame?: boolean;    // whether to show frame effect (default true)
  className?: string;
}

export default function GeneratedAvatar({
  avatarData,
  size = 80,
  showFrame = true,
  className = "",
}: GeneratedAvatarProps) {
  const frame = showFrame ? (FRAME_STYLES[avatarData.frame || "None"] || FRAME_STYLES.None) : FRAME_STYLES.None;
  const skinColor = avatarData.detectedSkin ? (SKIN_TONES[avatarData.detectedSkin] || "#e0ac69") : "#e0ac69";
  const hairColor = avatarData.detectedHair ? (HAIR_COLORS[avatarData.detectedHair] || "#3d2314") : "#3d2314";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      {showFrame && avatarData.frame && avatarData.frame !== "None" && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: frame.shadow,
            animation: "avatar-pulse 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Main avatar circle */}
      <div
        className="w-full h-full rounded-full flex items-center justify-center overflow-hidden relative"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${skinColor}22, rgba(26,22,37,0.95))`,
          border: frame.border,
          boxShadow: frame.shadow !== "none" ? frame.shadow : undefined,
        }}
      >
        {/* Accent ring from hair color */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 180deg, transparent 60%, ${hairColor}30 80%, transparent 100%)`,
          }}
        />

        {/* Base character emoji */}
        <span
          className="relative z-10 select-none"
          style={{ fontSize: size * 0.5 }}
          role="img"
          aria-label="Avatar"
        >
          {avatarData.base || "🧑"}
        </span>

        {/* Face overlay (if different from base) */}
        {avatarData.face && avatarData.face !== "None" && (
          <span
            className="absolute z-20 select-none"
            style={{
              fontSize: size * 0.2,
              bottom: size * 0.15,
              right: size * 0.15,
            }}
            role="img"
            aria-label="Expression"
          >
            {avatarData.face}
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes avatar-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}