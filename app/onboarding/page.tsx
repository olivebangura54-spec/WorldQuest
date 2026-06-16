"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";

const avatars = ["🚀", "🛡️", "🧙", "🏹", "🌊", "🔥", "🌿", "💎"];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [characterName, setCharacterName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("No user authenticated. Please log in again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createUserProfile(user.uid, user.email!, characterName, selectedAvatar);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-[#070b14] px-4">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="card-base p-8" style={{ animation: 'scale-in 0.5s ease-out' }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">✨</div>
              <h1 className="text-3xl font-black mb-2">
                <span className="gradient-text">Create Your</span>{" "}
                <span className="text-white">Explorer</span>
              </h1>
              <p className="text-sm text-gray-500">Choose your identity for this adventure</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Explorer Name
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter your name..."
                  className="input-base"
                  required
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Choose Your Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all duration-200 ${
                        selectedAvatar === avatar
                          ? "bg-blue-600/20 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-105"
                          : "bg-white/[0.03] border-2 border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Initializing...
                  </>
                ) : (
                  "Begin Adventure"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}