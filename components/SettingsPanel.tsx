"use client";

import { useState } from "react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export default function SettingsPanel({ isOpen, onClose, onLogout }: SettingsPanelProps) {
  const [masterVolume, setMasterVolume] = useState(75);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("how-to-play");

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fade-in 0.2s ease-out" }}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md overflow-y-auto"
        style={{
          background: "rgba(13,11,26,0.95)",
          backdropFilter: "blur(32px)",
          borderLeft: "1px solid rgba(168,85,247,0.15)",
          boxShadow: "-20px 0 60px rgba(168,85,247,0.1)",
          animation: "slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-[family-name:var(--font-cinzel)] gradient-text">Settings</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* How to Play */}
          <SettingsSection
            title="How to Play"
            icon="📖"
            isExpanded={expandedSection === "how-to-play"}
            onToggle={() => toggleSection("how-to-play")}
          >
            <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}>1</div>
                <div>
                  <p className="text-white font-semibold mb-1">Choose Your Path</p>
                  <p>Embark on five mystical chapters, each with unique challenges and puzzles.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee" }}>2</div>
                <div>
                  <p className="text-white font-semibold mb-1">Solve & Learn</p>
                  <p>Answer questions, complete puzzles, and solve riddles to earn XP and progress.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "rgba(240,171,252,0.15)", color: "#f0abfc" }}>3</div>
                <div>
                  <p className="text-white font-semibold mb-1">Rise in Ranks</p>
                  <p>Climb the leaderboard, unlock achievements, and become a World Scholar.</p>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* What is WorldQuest */}
          <SettingsSection
            title="What is WorldQuest?"
            icon="🌍"
            isExpanded={expandedSection === "what-is-wq"}
            onToggle={() => toggleSection("what-is-wq")}
          >
            <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
              <p>
                WorldQuest is a gamified learning adventure that transforms education into an immersive journey through mystical worlds.
              </p>
              <p>
                Every question answered, every puzzle solved, and every challenge overcome brings you closer to becoming a legendary World Scholar.
              </p>
              <p>
                Five chapters. Countless mysteries. One epic quest for knowledge.
              </p>
            </div>
          </SettingsSection>

          {/* Sound Settings */}
          <SettingsSection
            title="Sound Settings"
            icon="🔊"
            isExpanded={expandedSection === "sound"}
            onToggle={() => toggleSection("sound")}
          >
            <div className="space-y-6">
              {/* Master Volume */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white font-medium">Master Volume</span>
                  <span className="text-xs text-gray-500 font-mono">{masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${masterVolume}%, rgba(255,255,255,0.05) ${masterVolume}%, rgba(255,255,255,0.05) 100%)`,
                  }}
                />
              </div>

              {/* Music Toggle */}
              <CrystalToggle
                label="Music"
                enabled={musicEnabled}
                onToggle={() => setMusicEnabled(!musicEnabled)}
              />

              {/* SFX Toggle */}
              <CrystalToggle
                label="Sound Effects"
                enabled={sfxEnabled}
                onToggle={() => setSfxEnabled(!sfxEnabled)}
              />

              {/* Ambient Toggle */}
              <CrystalToggle
                label="Ambient Sounds"
                enabled={ambientEnabled}
                onToggle={() => setAmbientEnabled(!ambientEnabled)}
              />
            </div>
          </SettingsSection>

          {/* Additional Settings */}
          <SettingsSection
            title="Additional Settings"
            icon="⚙️"
            isExpanded={expandedSection === "additional"}
            onToggle={() => toggleSection("additional")}
          >
            <div className="space-y-5">
              <CrystalToggle
                label="Notifications"
                enabled={notificationsEnabled}
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
              />

              {/* Language */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Language</span>
                <select
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white appearance-none cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>

              {/* Log Out */}
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full mt-4 px-5 py-3 rounded-xl text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40"
                >
                  Log Out
                </button>
              )}
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Range input styling */}
      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168,85,247,0.5);
          border: 2px solid rgba(255,255,255,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168,85,247,0.5);
          border: 2px solid rgba(255,255,255,0.2);
        }
      `}</style>
    </>
  );
}

/* ───── Settings Section (Accordion) ───── */
function SettingsSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300"
        style={{
          background: isExpanded ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${isExpanded ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)"}`,
        }}
      >
        <span className="text-lg">{icon}</span>
        <span className="flex-1 text-left text-sm font-semibold text-white">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isExpanded ? "500px" : "0",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="p-4 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───── Crystal Toggle Switch ───── */
function CrystalToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white font-medium">{label}</span>
      <button
        onClick={onToggle}
        className="relative w-12 h-6 rounded-full transition-all duration-300"
        style={{
          background: enabled
            ? "linear-gradient(135deg, #a855f7, #22d3ee)"
            : "rgba(255,255,255,0.05)",
          border: `1px solid ${enabled ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: enabled ? "0 0 15px rgba(168,85,247,0.3)" : "none",
        }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
          style={{
            left: enabled ? "24px" : "2px",
            background: enabled ? "white" : "rgba(255,255,255,0.3)",
            boxShadow: enabled ? "0 0 10px rgba(255,255,255,0.3)" : "none",
          }}
        />
      </button>
    </div>
  );
}