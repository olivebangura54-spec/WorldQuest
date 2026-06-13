"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createUserProfile } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";

const avatars = [
  "🚀", "🛡️", "🧙", "🏹", "🌊", "🔥", "🌿", "💎"
];

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
    
    console.log("Submitting onboarding for user:", user.uid);
    setLoading(true);
    setError(null);
    try {
      await createUserProfile(user.uid, user.email!, characterName, selectedAvatar);
      console.log("Profile created, navigating to dashboard...");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error creating profile:", err);
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
        <div className="w-full max-w-md rounded-3xl bg-gray-900/50 backdrop-blur-xl p-10 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
          
          <h2 className="mb-8 text-4xl font-black text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Your Explorer
          </h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Explorer Name</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full rounded-2xl bg-gray-800/50 border border-gray-700 p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Choose Your Avatar</label>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-4 rounded-2xl border-2 transition-all duration-300 transform ${
                      selectedAvatar === avatar
                        ? "border-blue-500 bg-blue-500/20 scale-110 shadow-lg shadow-blue-500/20 animate-float"
                        : "border-gray-800 bg-gray-800/30 hover:border-gray-600 hover:scale-105"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 p-5 font-black text-xl tracking-wide transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-900/40"
            >
              {loading ? "Initializing..." : "Begin Adventure"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
