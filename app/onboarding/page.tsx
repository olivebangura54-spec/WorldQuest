"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createUserProfile, checkExplorerNameUnique } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";
import EnchantedForestBackground from "@/components/EnchantedForestBackground";
import GeneratedAvatar from "@/components/GeneratedAvatar";

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const ADVENTURE_BASES = [
  { id: "pathfinder", label: "Pathfinder", desc: "Rugged explorer with compass" },
  { id: "treasure_hunter", label: "Treasure Hunter", desc: "Hat, map, satchel" },
  { id: "mountain_scout", label: "Mountain Scout", desc: "Cloak, boots, climbing gear" },
  { id: "mystic_navigator", label: "Mystic Navigator", desc: "Robes, star chart, crystal lens" },
  { id: "jungle_ranger", label: "Jungle Ranger", desc: "Camouflage, machete, tribal accents" },
];

const AVATAR_TABS = ["Base", "Hair", "Outfit", "Accessories", "Frame"] as const;

const AVATAR_OPTIONS: Record<string, string[]> = {
  Base: ["pathfinder", "treasure_hunter", "mountain_scout", "mystic_navigator", "jungle_ranger"],
  Hair: ["windswept", "braided", "bandana", "hooded", "bald_tattoos"],
  Outfit: ["leather", "cloak", "vest", "robes", "camo"],
  Accessories: ["hat", "compass", "goggles", "rope", "lantern", "backpack", "dagger", "journal"],
  Frame: ["compass", "map", "rope", "crystal", "leaf"],
};

const BASE_LABELS: Record<string, string> = {
  pathfinder: "Pathfinder",
  treasure_hunter: "Treasure Hunter",
  mountain_scout: "Mountain Scout",
  mystic_navigator: "Mystic Navigator",
  jungle_ranger: "Jungle Ranger",
};

const HAIR_LABELS: Record<string, string> = {
  windswept: "Windswept",
  braided: "Braided",
  bandana: "Bandana",
  hooded: "Hooded",
  bald_tattoos: "Bald & Tattoos",
};

const OUTFIT_LABELS: Record<string, string> = {
  leather: "Leather Jacket",
  cloak: "Cloak",
  vest: "Vest + Harness",
  robes: "Mystic Robes",
  camo: "Camouflage",
};

const ACCESSORY_LABELS: Record<string, string> = {
  hat: "Explorer Hat",
  compass: "Compass Necklace",
  goggles: "Goggles",
  rope: "Rope Coil",
  lantern: "Crystal Lantern",
  backpack: "Backpack",
  dagger: "Dagger",
  journal: "Journal",
};

const FRAME_LABELS: Record<string, string> = {
  compass: "Compass Rose",
  map: "Map Scroll",
  rope: "Rope Knot",
  crystal: "Crystal",
  leaf: "Jungle Leaf",
};

const FRAME_STYLES: Record<string, string> = {
  compass: "border-amber-700 border-4",
  map: "border-amber-600 border-2 shadow-[0_0_12px_rgba(212,165,116,0.3)]",
  rope: "border-amber-800 border-2 shadow-[0_0_12px_rgba(139,115,85,0.3)]",
  crystal: "border-cyan-400 border-2 shadow-[0_0_12px_rgba(34,211,238,0.4)]",
  leaf: "border-green-500 border-2 shadow-[0_0_12px_rgba(34,197,94,0.4)]",
};

/* ═══════════════════════════════════════════
   COLOR MAPS FOR PHOTO ANALYSIS
   ═══════════════════════════════════════════ */

interface ColorMatch {
  label: string;
  hex: string;
  match: (r: number, g: number, b: number) => boolean;
}

const HAIR_COLOR_MAP: ColorMatch[] = [
  { label: "Raven Black", hex: "#1a1a2e", match: (r, g, b) => r < 50 && g < 50 && b < 60 },
  { label: "Dark Brown", hex: "#3d2314", match: (r, g, b) => r < 80 && g < 50 && b < 30 },
  { label: "Chestnut", hex: "#6b3a2a", match: (r, g, b) => r >= 80 && r < 140 && g < 70 && b < 50 },
  { label: "Auburn", hex: "#8b3a2a", match: (r, g, b) => r >= 100 && g < 60 && b < 50 && r > g },
  { label: "Golden Blonde", hex: "#c8a850", match: (r, g, b) => r >= 160 && g >= 130 && b < 100 },
  { label: "Platinum Blonde", hex: "#e8d8b0", match: (r, g, b) => r >= 200 && g >= 180 && b >= 140 },
  { label: "Copper Red", hex: "#b5523a", match: (r, g, b) => r >= 140 && g < 80 && b < 60 },
  { label: "Silver", hex: "#b8b8c8", match: (r, g, b) => r >= 150 && g >= 150 && b >= 160 && Math.abs(r - g) < 30 },
  { label: "White", hex: "#e8e8f0", match: (r, g, b) => r >= 200 && g >= 200 && b >= 200 },
];

const SKIN_COLOR_MAP: ColorMatch[] = [
  { label: "Porcelain", hex: "#fde8d8", match: (r, g, b) => r >= 230 && g >= 200 && b >= 180 },
  { label: "Fair", hex: "#f5d0a9", match: (r, g, b) => r >= 200 && g >= 160 && b >= 120 && r < 240 },
  { label: "Warm Beige", hex: "#e0ac69", match: (r, g, b) => r >= 170 && g >= 130 && b >= 80 && r < 220 },
  { label: "Warm Bronze", hex: "#c68642", match: (r, g, b) => r >= 140 && g >= 90 && b >= 50 && r < 190 },
  { label: "Caramel", hex: "#a0642e", match: (r, g, b) => r >= 110 && g >= 70 && b >= 30 && r < 160 },
  { label: "Rich Brown", hex: "#7a4422", match: (r, g, b) => r >= 80 && g >= 50 && b >= 20 && r < 130 },
  { label: "Deep Mahogany", hex: "#4a2810", match: (r, g, b) => r >= 50 && g >= 25 && b >= 10 && r < 90 },
  { label: "Dark Ebony", hex: "#2a1508", match: (r, g, b) => r < 60 && g < 40 && b < 25 },
];

const EYE_COLOR_MAP: ColorMatch[] = [
  { label: "Deep Blue", hex: "#3a6ea5", match: (r, g, b) => b > r && b > g && b > 80 },
  { label: "Ocean Blue", hex: "#4a90d9", match: (r, g, b) => b > 100 && b > r * 1.2 && g < b },
  { label: "Emerald Green", hex: "#2e8b57", match: (r, g, b) => g > r && g > b && g > 80 },
  { label: "Hazel", hex: "#8b7355", match: (r, g, b) => r > 80 && g > 60 && b < 60 && Math.abs(r - g) < 60 },
  { label: "Warm Brown", hex: "#6b4423", match: (r, g, b) => r > 60 && g > 30 && b < 50 && r > b * 1.5 },
  { label: "Dark Amber", hex: "#5a3a1a", match: (r, g, b) => r > 50 && g > 30 && b < 40 && r < 120 },
  { label: "Mystic Purple", hex: "#6a3d8a", match: (r, g, b) => r > 60 && b > 80 && g < 50 },
  { label: "Storm Grey", hex: "#7a7a8a", match: (r, g, b) => Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 60 && r < 160 },
];

/* ═══════════════════════════════════════════
   COLOR EXTRACTION UTILITIES
   ═══════════════════════════════════════════ */

interface DetectedColors {
  hair: { color: string; label: string };
  skin: { color: string; label: string };
  eyes: { color: string; label: string };
  base: string;
}

function rgbToLabel(
  r: number, g: number, b: number,
  colorMap: ColorMatch[]
): { color: string; label: string } {
  for (const entry of colorMap) {
    if (entry.match(r, g, b)) {
      return { color: entry.hex, label: entry.label };
    }
  }
  return { color: `rgb(${r},${g},${b})`, label: "Mystic" };
}

function getAverageColor(
  imageData: ImageData, startX: number, startY: number, width: number, height: number
): [number, number, number] {
  const data = imageData.data;
  const imgWidth = imageData.width;
  let r = 0, g = 0, b = 0, count = 0;

  for (let y = startY; y < startY + height && y < imageData.height; y++) {
    for (let x = startX; x < startX + width && x < imgWidth; x++) {
      const idx = (y * imgWidth + x) * 4;
      r += data[idx];
      g += data[idx + 1];
      b += data[idx + 2];
      count++;
    }
  }

  if (count === 0) return [128, 128, 128];
  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
}

function getDominantColor(
  imageData: ImageData, startX: number, startY: number, width: number, height: number
): [number, number, number] {
  const data = imageData.data;
  const imgWidth = imageData.width;
  const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

  for (let y = startY; y < startY + height && y < imageData.height; y++) {
    for (let x = startX; x < startX + width && x < imgWidth; x++) {
      const idx = (y * imgWidth + x) * 4;
      const r = Math.round(data[idx] / 32) * 32;
      const g = Math.round(data[idx + 1] / 32) * 32;
      const b = Math.round(data[idx + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      if (!buckets[key]) buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
      buckets[key].r += data[idx];
      buckets[key].g += data[idx + 1];
      buckets[key].b += data[idx + 2];
      buckets[key].count++;
    }
  }

  let maxCount = 0;
  let dominant = { r: 128, g: 128, b: 128 };
  for (const bucket of Object.values(buckets)) {
    if (bucket.count > maxCount) {
      maxCount = bucket.count;
      dominant = {
        r: Math.round(bucket.r / bucket.count),
        g: Math.round(bucket.g / bucket.count),
        b: Math.round(bucket.b / bucket.count),
      };
    }
  }
  return [dominant.r, dominant.g, dominant.b];
}

function extractColorsFromPhoto(imageUrl: string): Promise<DetectedColors> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("No canvas context")); return; }

        const size = 200;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);

        // Hair: top 20% — dominant color
        const [hr, hg, hb] = getDominantColor(imageData, 0, 0, size, Math.round(size * 0.2));
        const hair = rgbToLabel(hr, hg, hb, HAIR_COLOR_MAP);

        // Skin: center 30% — average color
        const skinStartY = Math.round(size * 0.35);
        const skinHeight = Math.round(size * 0.3);
        const [sr, sg, sb] = getAverageColor(
          imageData, Math.round(size * 0.3), skinStartY, Math.round(size * 0.4), skinHeight
        );
        const skin = rgbToLabel(sr, sg, sb, SKIN_COLOR_MAP);

        // Eyes: upper center region
        const eyeY = Math.round(size * 0.38);
        const [er, eg, eb] = getAverageColor(
          imageData, Math.round(size * 0.35), eyeY, Math.round(size * 0.3), Math.round(size * 0.08)
        );
        const eyes = rgbToLabel(er, eg, eb, EYE_COLOR_MAP);

        // Determine adventure base character from color analysis
        const brightness = (sr * 0.299 + sg * 0.587 + sb * 0.114) / 255;
        const warmth = (sr - sb) / 255;
        const contrast = Math.abs(hr - sr) + Math.abs(hg - sg) + Math.abs(hb - sb);

        let base = "pathfinder";
        if (warmth > 0.15) base = "treasure_hunter";          // warm → golden, desert
        else if (warmth < 0.05 && brightness > 0.5) base = "mystic_navigator"; // cool → blue, starry
        else if (contrast > 150) base = "jungle_ranger";       // high contrast → bold
        else if (brightness < 0.4) base = "mountain_scout";    // soft → earthy
        else base = "pathfinder";                               // neutral → balanced

        resolve({ hair, skin, eyes, base });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}

/* ═══════════════════════════════════════════
   NAME VALIDATION
   ═══════════════════════════════════════════ */

interface NameValidation {
  valid: boolean;
  error: string;
}

function validateExplorerName(name: string): NameValidation {
  const trimmed = name.trim();
  if (trimmed.length < 3) return { valid: false, error: "Name must be at least 3 characters" };
  if (trimmed.length > 20) return { valid: false, error: "Name must be 20 characters or less" };
  if (name !== trimmed) return { valid: false, error: "No leading or trailing spaces" };
  if (!/[a-zA-Z]/.test(name)) return { valid: false, error: "Name must contain at least 1 letter" };
  if (/\s{2,}/.test(name)) return { valid: false, error: "No consecutive spaces" };
  if (/[_.\-']{2,}/.test(name)) return { valid: false, error: "No consecutive special characters" };
  if (/^[_.\-']/.test(name)) return { valid: false, error: "Name cannot start with a special character" };
  if (/[_.\-']$/.test(name)) return { valid: false, error: "Name cannot end with a special character" };
  return { valid: true, error: "" };
}

function generateSuggestions(name: string): string[] {
  const base = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "Explorer";
  return [`${base}_1`, `The_${base}`, `${base}_X`, `${base}_007`, `x${base}x`];
}

/* ═══════════════════════════════════════════
   ESSENCE SPINNER COMPONENT
   ═══════════════════════════════════════════ */

function EssenceSpinner() {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      {/* Crystal spinner */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent, rgba(168,85,247,0.6), transparent, rgba(34,211,238,0.6), transparent)",
            animation: "spin 1.5s linear infinite",
          }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{ background: "rgba(15,10,30,0.9)" }}
        >
          <span className="text-3xl" style={{ animation: "pulse-glow 1.5s ease-in-out infinite" }}>🔮</span>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p
          className="text-sm font-medium"
          style={{ color: "#c4b5fd", textShadow: "0 0 20px rgba(168,85,247,0.4)" }}
        >
          The realm is forging your adventurer...
        </p>
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.15); filter: brightness(1.4); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COLOR TAG COMPONENT
   ═══════════════════════════════════════════ */

function ColorTag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#e2e8f0",
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{
          background: color,
          boxShadow: `0 0 6px ${color}55`,
        }}
      />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════
   AVATAR BUILDER COMPONENT
   ═══════════════════════════════════════════ */

interface AvatarState {
  base: string;
  hair: string;
  outfit: string;
  accessory: string;
  frame: string;
}

function getLabelForOption(tab: string, value: string): string {
  if (tab === "Base") return BASE_LABELS[value] || value;
  if (tab === "Hair") return HAIR_LABELS[value] || value;
  if (tab === "Outfit") return OUTFIT_LABELS[value] || value;
  if (tab === "Accessories") return ACCESSORY_LABELS[value] || value;
  if (tab === "Frame") return FRAME_LABELS[value] || value;
  return value;
}

function AvatarBuilder({
  avatar,
  setAvatar,
  onBack,
  onNext,
}: {
  avatar: AvatarState;
  setAvatar: (a: AvatarState) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<(typeof AVATAR_TABS)[number]>("Base");

  const tabMap: Record<string, keyof AvatarState> = {
    Base: "base",
    Hair: "hair",
    Outfit: "outfit",
    Accessories: "accessory",
    Frame: "frame",
  };

  const handleSelect = (value: string) => {
    setAvatar({ ...avatar, [tabMap[activeTab]]: value });
  };

  const handleRandomize = () => {
    const accessories = AVATAR_OPTIONS.Accessories;
    setAvatar({
      base: AVATAR_OPTIONS.Base[Math.floor(Math.random() * AVATAR_OPTIONS.Base.length)],
      hair: AVATAR_OPTIONS.Hair[Math.floor(Math.random() * AVATAR_OPTIONS.Hair.length)],
      outfit: AVATAR_OPTIONS.Outfit[Math.floor(Math.random() * AVATAR_OPTIONS.Outfit.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
      frame: AVATAR_OPTIONS.Frame[Math.floor(Math.random() * AVATAR_OPTIONS.Frame.length)],
    });
  };

  return (
    <div className="space-y-5">
      {/* Preview — render SVG adventure avatar */}
      <div className="flex justify-center">
        <div style={{ animation: "avatar-float 3s ease-in-out infinite" }}>
          <GeneratedAvatar
            avatarData={{
              base: avatar.base,
              hair: avatar.hair,
              outfit: avatar.outfit,
              accessories: avatar.accessory !== "None" ? [avatar.accessory] : [],
              frame: avatar.frame,
            }}
            size={96}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {AVATAR_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab
                ? "bg-purple-500/30 text-purple-300 border border-purple-400/40"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_OPTIONS[activeTab].map((option) => {
          const currentValue = avatar[tabMap[activeTab]];
          const isSelected = currentValue === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-purple-500/25 border border-purple-400/50 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {getLabelForOption(activeTab, option)}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleRandomize}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 transition-all"
        >
          🎲 Random
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #9333ea, #06b6d4)" }}
        >
          Save Avatar
        </button>
      </div>

      <style jsx>{`
        @keyframes avatar-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN ONBOARDING PAGE
   ═══════════════════════════════════════════ */

type EssenceStep = "upload" | "analyzing" | "preview" | "builder" | "random-preview";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();

  /* ─── Multi-step state ─── */
  const [step, setStep] = useState<1 | 2 | 3>(1);

  /* ─── Step 1: Name ─── */
  const [name, setName] = useState("");
  const [nameValidation, setNameValidation] = useState<NameValidation>({ valid: false, error: "" });
  const [nameChecked, setNameChecked] = useState(false);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [nameChecking, setNameChecking] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Step 2: Essence Capture ─── */
  const [essenceStep, setEssenceStep] = useState<EssenceStep>("upload");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [detectedColors, setDetectedColors] = useState<DetectedColors | null>(null);
  const [analysisError, setAnalysisError] = useState(false);
  const [avatarType, setAvatarType] = useState<"auto-generated" | "manual" | "random">("auto-generated");
  const [avatarOrigin, setAvatarOrigin] = useState<"photo" | "random" | null>(null);
  const [avatarBuilder, setAvatarBuilder] = useState<AvatarState>({
    base: "pathfinder",
    hair: "windswept",
    outfit: "leather",
    accessory: "compass",
    frame: "compass",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Step 3: Confirm ─── */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ═══════════════════════════════════════════
     NAME VALIDATION + UNIQUENESS
     ═══════════════════════════════════════════ */

  const checkUniqueness = useCallback(async (nameToCheck: string) => {
    const trimmed = nameToCheck.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      setNameAvailable(null);
      setNameChecking(false);
      return;
    }
    setNameChecking(true);
    try {
      const isUnique = await checkExplorerNameUnique(trimmed);
      setNameAvailable(isUnique);
      if (!isUnique) {
        setSuggestions(generateSuggestions(trimmed));
      } else {
        setSuggestions([]);
      }
    } catch {
      setNameAvailable(true);
      setSuggestions([]);
    } finally {
      setNameChecking(false);
    }
  }, []);

  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9_.' \-]/g, "");
    setName(cleaned);

    const validation = validateExplorerName(cleaned);
    setNameValidation(validation);
    setNameChecked(false);
    setNameAvailable(null);
    setSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (validation.valid) {
      debounceRef.current = setTimeout(() => {
        checkUniqueness(cleaned);
        setNameChecked(true);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const nameInputState = () => {
    if (!name) return "idle";
    if (!nameValidation.valid) return "invalid";
    if (nameChecking) return "checking";
    if (nameChecked && nameAvailable === false) return "taken";
    if (nameChecked && nameAvailable === true) return "available";
    return "idle";
  };

  const canProceedStep1 = nameValidation.valid && nameChecked && nameAvailable === true;

  /* ═══════════════════════════════════════════
     PHOTO HANDLING
     ═══════════════════════════════════════════ */

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoDataUrl(dataUrl);
      startAnalysis(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async (imageUrl: string) => {
    setEssenceStep("analyzing");
    setAnalysisError(false);

    try {
      const [colors] = await Promise.all([
        extractColorsFromPhoto(imageUrl),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      const hairOption = mapHairLabelToOption(colors.hair.label);
      const outfitOption = mapBaseToOutfit(colors.base);
      const accessoryOption = mapBaseToAccessory(colors.base);

      setDetectedColors(colors);
      setAvatarBuilder({
        base: colors.base,
        hair: hairOption,
        outfit: outfitOption,
        accessory: accessoryOption,
        frame: "compass",
      });
      setAvatarType("auto-generated");
      setEssenceStep("preview");
    } catch {
      setAnalysisError(true);
      setDetectedColors(null);
      setAvatarType("manual");
      setEssenceStep("builder");
    }
  };

  const mapHairLabelToOption = (label: string): string => {
    const lower = label.toLowerCase();
    if (lower.includes("black") || lower.includes("dark")) return "bandana";
    if (lower.includes("brown") || lower.includes("chestnut") || lower.includes("auburn")) return "braided";
    if (lower.includes("blonde") || lower.includes("platinum")) return "windswept";
    if (lower.includes("red") || lower.includes("copper")) return "windswept";
    if (lower.includes("silver") || lower.includes("white")) return "bald_tattoos";
    return "windswept";
  };

  const mapBaseToOutfit = (base: string): string => {
    switch (base) {
      case "treasure_hunter": return "leather";
      case "mystic_navigator": return "robes";
      case "mountain_scout": return "cloak";
      case "jungle_ranger": return "camo";
      default: return "leather";
    }
  };

  const mapBaseToAccessory = (base: string): string => {
    switch (base) {
      case "treasure_hunter": return "hat";
      case "mystic_navigator": return "compass";
      case "mountain_scout": return "rope";
      case "jungle_ranger": return "dagger";
      default: return "compass";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAcceptPreview = () => {
    setAvatarType("auto-generated");
    setStep(3);
  };

  const handleRefineManually = () => {
    setAvatarType("manual");
    setEssenceStep("builder");
  };

  const handleChooseDifferentPhoto = () => {
    setPhotoDataUrl(null);
    setDetectedColors(null);
    setAnalysisError(false);
    setEssenceStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBuilderSave = () => {
    setAvatarType(detectedColors ? "auto-generated" : "manual");
    setEssenceStep("preview");
  };

  const handleBuilderBack = () => {
    if (avatarOrigin === "random") {
      setEssenceStep("random-preview");
    } else if (detectedColors && photoDataUrl) {
      setEssenceStep("preview");
    } else {
      handleChooseDifferentPhoto();
    }
  };

  /* ═══════════════════════════════════════════
     RANDOM AVATAR GENERATION
     ═══════════════════════════════════════════ */

  const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateRandomAvatar = () => {
    const accessories = AVATAR_OPTIONS.Accessories;
    const randomAccessories = accessories
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3)); // 0-2 accessories

    const newAvatar: AvatarState = {
      base: pickRandom(AVATAR_OPTIONS.Base),
      hair: pickRandom(AVATAR_OPTIONS.Hair),
      outfit: pickRandom(AVATAR_OPTIONS.Outfit),
      accessory: randomAccessories.length > 0 ? randomAccessories[0] : "None",
      frame: pickRandom(AVATAR_OPTIONS.Frame),
    };

    setAvatarBuilder(newAvatar);
    setAvatarType("random");
    setAvatarOrigin("random");
    setDetectedColors(null);
    setPhotoDataUrl(null);
    setEssenceStep("random-preview");
  };

  const handleAcceptRandom = () => {
    setAvatarType("random");
    setStep(3);
  };

  const handleSummonAgain = () => {
    generateRandomAvatar();
  };

  const handleRefineRandom = () => {
    setAvatarType("manual");
    setEssenceStep("builder");
  };

  /* ═══════════════════════════════════════════
     SUBMIT
     ═══════════════════════════════════════════ */

  const handleSubmit = async () => {
    if (!user) {
      setError("No user authenticated. Please log in again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const avatarDisplay = avatarBuilder.base;
      const avatarData = {
        base: avatarBuilder.base,
        hair: avatarBuilder.hair,
        outfit: avatarBuilder.outfit,
        accessories: avatarBuilder.accessory !== "None" ? [avatarBuilder.accessory] : [],
        frame: avatarBuilder.frame,
        photoUrl: photoDataUrl || undefined,
        detectedHair: detectedColors?.hair.label,
        detectedSkin: detectedColors?.skin.label,
        detectedEyes: detectedColors?.eyes.label,
      };
      await createUserProfile(user.uid, user.email!, name.trim(), avatarDisplay, {
        avatarType,
        avatarData,
        photoAnalyzed: !!detectedColors,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.");
      setLoading(false);
    }
  };

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */

  const inputBorder = (state: string) => {
    switch (state) {
      case "invalid": return "border-red-400/60 shadow-[0_0_12px_rgba(244,63,94,0.12)]";
      case "taken": return "border-red-400/60 shadow-[0_0_12px_rgba(244,63,94,0.12)]";
      case "available": return "border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.12)]";
      case "checking": return "border-cyan-400/40";
      default: return "border-white/20";
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <EnchantedForestBackground />

        <div
          className={`relative z-10 w-full max-w-[440px] mx-4`}
          style={{ animation: "auth-float 6s ease-in-out infinite" }}
        >
          <div
            className="rounded-3xl p-8 sm:p-10"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(40px) saturate(1.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* ─── Step indicator ─── */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      step === s
                        ? "bg-purple-500/40 text-white border border-purple-400/60"
                        : step > s
                          ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/40"
                          : "bg-white/5 text-slate-500 border border-white/10"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && <div className={`w-6 h-px ${step > s ? "bg-cyan-400/40" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>

            {/* ─── Header ─── */}
            <div className="text-center mb-6">
              <h1
                className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-cinzel)] tracking-wide"
                style={{
                  color: "#e8eaf6",
                  textShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(34,211,238,0.15)",
                }}
              >
                {step === 1 && "Choose Your Name"}
                {step === 2 && "Choose Your Identity"}
                {step === 3 && "Enter the Realm"}
              </h1>
              <p className="text-sm mt-2" style={{ color: "#94a3b8" }}>
                {step === 1 && "This is how the realm will know you"}
                {step === 2 && "How will you appear in the realm?"}
                {step === 3 && "Your explorer is ready — begin your journey"}
              </p>
            </div>

            {/* ─── Error ─── */}
            {error && (
              <div
                className="mb-5 p-3 rounded-xl text-sm text-center"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#f43f5e",
                }}
              >
                {error}
              </div>
            )}

            {/* ═══════════════════════════════════
               STEP 1: EXPLORER NAME
               ═══════════════════════════════════ */}
            {step === 1 && (
              <div className="space-y-4" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Explorer name..."
                      maxLength={20}
                      className={`w-full bg-white/5 border rounded-xl px-4 pr-20 py-3 text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)] ${inputBorder(nameInputState())}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-xs text-slate-500">{name.length}/20</span>
                      {name && nameInputState() === "available" && (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      {name && (nameInputState() === "taken" || (nameInputState() === "invalid" && name.length >= 3)) && (
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {name && !nameValidation.valid && (
                    <p className="text-xs text-red-400 mt-1.5 ml-1" style={{ animation: "stagger-fade-in 0.2s ease-out both" }}>
                      {nameValidation.error}
                    </p>
                  )}

                  {nameChecking && (
                    <p className="text-xs text-cyan-400 mt-1.5 ml-1 flex items-center gap-1.5" style={{ animation: "stagger-fade-in 0.2s ease-out both" }}>
                      <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Checking availability...
                    </p>
                  )}

                  {!nameChecking && nameChecked && nameAvailable === true && (
                    <p className="text-xs text-emerald-400 mt-1.5 ml-1 flex items-center gap-1.5" style={{ animation: "stagger-fade-in 0.2s ease-out both" }}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Available!
                    </p>
                  )}

                  {!nameChecking && nameChecked && nameAvailable === false && (
                    <p className="text-xs text-red-400 mt-1.5 ml-1 flex items-center gap-1.5" style={{ animation: "stagger-fade-in 0.2s ease-out both" }}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      This name is taken
                    </p>
                  )}
                </div>

                {!nameChecking && nameChecked && nameAvailable === false && suggestions.length > 0 && (
                  <div style={{ animation: "stagger-fade-in 0.3s ease-out both" }}>
                    <p className="text-xs text-slate-400 mb-2">Try one of these:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleNameChange(s)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-purple-400/40 hover:text-purple-300 transition-all duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                    boxShadow: canProceedStep1
                      ? "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)"
                      : "none",
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {/* ═══════════════════════════════════
               STEP 2: FORGE YOUR ADVENTURER
               ═══════════════════════════════════ */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
              onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
            />

            {/* ── UPLOAD / CHOOSE STATE ── */}
            {step === 2 && essenceStep === "upload" && (
              <div className="space-y-5" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                {/* Two option cards — side by side on desktop, stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Forge from Photo */}
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "2px solid rgba(34,211,238,0.2)",
                      boxShadow: "0 0 30px rgba(34,211,238,0.06), inset 0 0 20px rgba(34,211,238,0.03)",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                      minHeight: "44px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(34,211,238,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 40px rgba(34,211,238,0.15), inset 0 0 20px rgba(34,211,238,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(34,211,238,0.06), inset 0 0 20px rgba(34,211,238,0.03)";
                    }}
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
                      <div
                        className="text-4xl transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,0.4))" }}
                      >
                        🔮
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: "#67e8f9" }}>
                        Forge from Photo
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                        Upload your portrait
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>
                        We'll capture your essence
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Summon Random Explorer */}
                  <button
                    type="button"
                    onClick={generateRandomAvatar}
                    className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "2px solid rgba(168,85,247,0.2)",
                      boxShadow: "0 0 30px rgba(168,85,247,0.06), inset 0 0 20px rgba(168,85,247,0.03)",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                      minHeight: "44px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)";
                      e.currentTarget.style.boxShadow = "0 0 40px rgba(168,85,247,0.15), inset 0 0 20px rgba(168,85,247,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)";
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(168,85,247,0.06), inset 0 0 20px rgba(168,85,247,0.03)";
                    }}
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
                      <div
                        className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                        style={{ filter: "drop-shadow(0 0 10px rgba(168,85,247,0.4))" }}
                      >
                        🎲
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: "#c4b5fd" }}>
                        Summon Random Explorer
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                        Let fate decide your look
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>
                        No upload needed
                      </p>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all"
                >
                  Back
                </button>
              </div>
            )}

            {/* ── ANALYZING STATE ── */}
            {step === 2 && essenceStep === "analyzing" && (
              <div className="space-y-5" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                <EssenceSpinner />
              </div>
            )}

            {/* ── PREVIEW STATE (Photo) ── */}
            {step === 2 && essenceStep === "preview" && (
              <div className="space-y-5" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                <div className="flex flex-col items-center gap-4">
                  <div style={{ animation: "avatar-float 3s ease-in-out infinite" }}>
                    <GeneratedAvatar
                      avatarData={{
                        base: avatarBuilder.base,
                        hair: avatarBuilder.hair,
                        outfit: avatarBuilder.outfit,
                        accessories: avatarBuilder.accessory !== "None" ? [avatarBuilder.accessory] : [],
                        frame: avatarBuilder.frame,
                        detectedHair: detectedColors?.hair.label,
                        detectedSkin: detectedColors?.skin.label,
                        detectedEyes: detectedColors?.eyes.label,
                      }}
                      size={112}
                    />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#c4b5fd", textShadow: "0 0 20px rgba(168,85,247,0.3)" }}>
                    The realm has forged your adventurer.
                  </p>
                </div>

                {detectedColors && (
                  <div className="flex flex-wrap justify-center gap-2">
                    <ColorTag label={`Hair: ${detectedColors.hair.label}`} color={detectedColors.hair.color} />
                    <ColorTag label={`Skin: ${detectedColors.skin.label}`} color={detectedColors.skin.color} />
                    <ColorTag label={`Eyes: ${detectedColors.eyes.label}`} color={detectedColors.eyes.color} />
                  </div>
                )}

                {photoDataUrl && (
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/15 opacity-60">
                      <img src={photoDataUrl} alt="Your portrait" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAcceptPreview}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                      boxShadow: "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)",
                    }}
                  >
                    Accept & Continue
                  </button>

                  <button
                    type="button"
                    onClick={handleRefineManually}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5"
                    style={{
                      color: "#94a3b8",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    Refine Manually
                  </button>

                  <button
                    type="button"
                    onClick={handleChooseDifferentPhoto}
                    className="w-full py-2 text-xs font-medium transition-all duration-200"
                    style={{ color: "#64748b" }}
                  >
                    Choose Different Photo
                  </button>
                </div>

                <style jsx>{`
                  @keyframes avatar-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                  }
                `}</style>
              </div>
            )}

            {/* ── RANDOM PREVIEW STATE ── */}
            {step === 2 && essenceStep === "random-preview" && (
              <div className="space-y-5" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                <div className="flex flex-col items-center gap-4">
                  <div style={{ animation: "avatar-float 3s ease-in-out infinite" }}>
                    <GeneratedAvatar
                      avatarData={{
                        base: avatarBuilder.base,
                        hair: avatarBuilder.hair,
                        outfit: avatarBuilder.outfit,
                        accessories: avatarBuilder.accessory !== "None" ? [avatarBuilder.accessory] : [],
                        frame: avatarBuilder.frame,
                      }}
                      size={112}
                    />
                  </div>
                  <p className="text-sm font-medium text-center" style={{ color: "#c4b5fd", textShadow: "0 0 20px rgba(168,85,247,0.3)" }}>
                    The realm has summoned your explorer!
                  </p>
                </div>

                {/* Chosen parts display */}
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-400/25">
                    {BASE_LABELS[avatarBuilder.base]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-400/25">
                    {HAIR_LABELS[avatarBuilder.hair]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-400/25">
                    {OUTFIT_LABELS[avatarBuilder.outfit]}
                  </span>
                  {avatarBuilder.accessory !== "None" && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-400/25">
                      {ACCESSORY_LABELS[avatarBuilder.accessory]}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/15 text-purple-300 border border-purple-400/25">
                    {FRAME_LABELS[avatarBuilder.frame]}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAcceptRandom}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                      boxShadow: "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)",
                    }}
                  >
                    Accept This Explorer
                  </button>

                  <button
                    type="button"
                    onClick={handleSummonAgain}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5"
                    style={{
                      color: "#c4b5fd",
                      border: "1px solid rgba(168,85,247,0.3)",
                    }}
                  >
                    🎲 Summon Again
                  </button>

                  <button
                    type="button"
                    onClick={handleRefineRandom}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5"
                    style={{
                      color: "#94a3b8",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    Refine Manually
                  </button>
                </div>

                <style jsx>{`
                  @keyframes avatar-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                  }
                `}</style>
              </div>
            )}

            {/* ── AVATAR BUILDER (Refine Mode) ── */}
            {step === 2 && essenceStep === "builder" && (
              <div style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                {analysisError && (
                  <div
                    className="mb-4 p-3 rounded-xl text-xs text-center"
                    style={{
                      background: "rgba(251,191,36,0.08)",
                      border: "1px solid rgba(251,191,36,0.2)",
                      color: "#fbbf24",
                    }}
                  >
                    The realm's vision is unclear. Please refine manually.
                  </div>
                )}
                <AvatarBuilder
                  avatar={avatarBuilder}
                  setAvatar={setAvatarBuilder}
                  onBack={handleBuilderBack}
                  onNext={handleBuilderSave}
                />
              </div>
            )}

            {/* ═══════════════════════════════════
               STEP 3: CONFIRM
               ═══════════════════════════════════ */}
            {step === 3 && (
              <div className="space-y-6" style={{ animation: "stagger-fade-in 0.5s ease-out both" }}>
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div className="mb-4 flex justify-center">
                    <GeneratedAvatar
                      avatarData={{
                        base: avatarBuilder.base,
                        hair: avatarBuilder.hair,
                        outfit: avatarBuilder.outfit,
                        accessories: avatarBuilder.accessory !== "None" ? [avatarBuilder.accessory] : [],
                        frame: avatarBuilder.frame,
                        detectedHair: detectedColors?.hair.label,
                        detectedSkin: detectedColors?.skin.label,
                        detectedEyes: detectedColors?.eyes.label,
                      }}
                      size={80}
                    />
                  </div>

                  <h2 className="text-xl font-bold text-white font-[family-name:var(--font-cinzel)]">
                    {name.trim()}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Explorer</p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {[
                      BASE_LABELS[avatarBuilder.base],
                      HAIR_LABELS[avatarBuilder.hair],
                      OUTFIT_LABELS[avatarBuilder.outfit],
                      ACCESSORY_LABELS[avatarBuilder.accessory],
                      FRAME_LABELS[avatarBuilder.frame],
                    ].filter(Boolean).map((label) => (
                      <span key={label} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-slate-400 border border-white/10">
                        {label}
                      </span>
                    ))}
                  </div>

                  {detectedColors && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      <ColorTag label={`Hair: ${detectedColors.hair.label}`} color={detectedColors.hair.color} />
                      <ColorTag label={`Skin: ${detectedColors.skin.label}`} color={detectedColors.skin.color} />
                      <ColorTag label={`Eyes: ${detectedColors.eyes.label}`} color={detectedColors.eyes.color} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarOrigin === "random") {
                        setEssenceStep("random-preview");
                      } else if (photoDataUrl && detectedColors) {
                        setEssenceStep("preview");
                      } else if (photoDataUrl) {
                        setEssenceStep("builder");
                      } else {
                        setEssenceStep("upload");
                      }
                      setStep(2);
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                      boxShadow: "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.boxShadow = "0 0 32px rgba(147,51,234,0.5), 0 0 64px rgba(6,182,212,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)";
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Initializing...
                      </>
                    ) : (
                      "Enter WorldQuest"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}