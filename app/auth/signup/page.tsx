"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/onboarding");
    }
  }, [user, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b1a] px-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full blur-[200px]" style={{ background: "rgba(168,85,247,0.04)" }} />
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[180px]" style={{ background: "rgba(34,211,238,0.03)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            animation: "scale-in 0.5s ease-out",
            background: "rgba(26,22,37,0.7)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(168,85,247,0.12)",
            boxShadow: "0 0 60px rgba(168,85,247,0.05)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.2))",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              ✨
            </div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-cinzel)]">Join WorldQuest</h1>
            <p className="text-sm text-gray-500 mt-1">Begin your learning adventure</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", color: "#f43f5e" }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                placeholder="Create a password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}