"use client";

import GeneratedAvatar, { AvatarData } from "./GeneratedAvatar";

interface AvatarDisplayProps {
  /** The avatar value — emoji text character */
  avatar: string;
  /** Structured avatar data for generated adventure avatar rendering */
  avatarData?: AvatarData | null;
  /** Size in pixels */
  size?: number;
  /** Additional class names for the outer wrapper */
  className?: string;
  /** Fallback name for initial-based fallback */
  fallbackName?: string;
  /** Whether to show the frame effect */
  showFrame?: boolean;
}

/**
 * Returns the first letter of a name for fallback display,
 * or a default compass icon if no name is provided.
 */
function getFallbackContent(name?: string): string {
  if (name && name.trim().length > 0) {
    return name.trim()[0].toUpperCase();
  }
  return "✦";
}

export default function AvatarDisplay({
  avatar,
  avatarData = null,
  size = 80,
  className = "",
  fallbackName,
  showFrame = true,
}: AvatarDisplayProps) {
  // If we have structured avatar data, render the adventure SVG avatar
  if (avatarData && avatarData.base) {
    return (
      <GeneratedAvatar
        avatarData={avatarData}
        size={size}
        showFrame={showFrame}
        className={className}
      />
    );
  }

  // Legacy: If avatar is an emoji or short text (not a URL), render it directly
  if (avatar && !avatar.startsWith("data:") && !avatar.startsWith("http") && !avatar.startsWith("blob:")) {
    // Try to render as adventure avatar with legacy emoji mapped to default pathfinder
    return (
      <GeneratedAvatar
        avatarData={{
          base: "pathfinder",
          hair: "windswept",
          outfit: "leather",
          frame: "compass",
          accessories: [],
        }}
        size={size}
        showFrame={showFrame}
        className={className}
      />
    );
  }

  // Fallback: show first letter or default icon
  const fallback = getFallbackContent(fallbackName);
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: "rgba(26,22,37,0.8)",
        border: "2px solid rgba(196,162,101,0.3)",
      }}
    >
      <span
        className="font-bold select-none"
        style={{ fontSize: size * 0.4, color: "#c4b5fd" }}
      >
        {fallback}
      </span>
    </div>
  );
}
