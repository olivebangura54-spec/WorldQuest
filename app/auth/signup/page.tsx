"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import EnchantedForestBackground from "@/components/EnchantedForestBackground";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/onboarding");
    }
  }, [user, router]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Enter your email to begin";
    if (password.length < 6) errors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) errors.terms = "You must agree to the Terms of Service";
    return errors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      setIsLoading(false);
    }
  };

  const inputBaseClasses =
    "w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]";

  const getFieldBorder = (fieldName: string) =>
    fieldErrors[fieldName]
      ? "border-red-400/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
      : "border-white/20";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <EnchantedForestBackground />

      {/* ─── Floating glassmorphic card ─── */}
      <div
        className={`relative z-10 w-full max-w-[420px] mx-4 ${shakeError ? "animate-[error-shake_0.5s_ease-in-out]" : ""}`}
        style={{ animation: "auth-float 6s ease-in-out infinite" }}
      >
        <div
          className="rounded-3xl p-10"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(40px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* ─── Title ─── */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold font-[family-name:var(--font-cinzel)] tracking-wide"
              style={{
                color: "#e8eaf6",
                textShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(34,211,238,0.15)",
                animation: "stagger-fade-in 0.6s ease-out both",
              }}
            >
              Join WorldQuest
            </h1>
            <p
              className="text-sm mt-2"
              style={{
                color: "#94a3b8",
                animation: "stagger-fade-in 0.6s ease-out 0.1s both",
              }}
            >
              Step into the realm. Your journey begins with a single name.
            </p>
          </div>

          {/* ─── Error banner ─── */}
          {error && (
            <div
              className="mb-6 p-3 rounded-xl text-sm text-center"
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.25)",
                color: "#f43f5e",
                animation: "stagger-fade-in 0.3s ease-out both",
              }}
            >
              {error}
            </div>
          )}

          {/* ─── Form ─── */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email */}
            <div
              style={{ animation: "stagger-fade-in 0.5s ease-out 0.15s both" }}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`${inputBaseClasses} ${getFieldBorder("email")}`}
                  placeholder="Email"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-400 mt-1.5 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div
              style={{ animation: "stagger-fade-in 0.5s ease-out 0.2s both" }}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`${inputBaseClasses} ${getFieldBorder("password")}`}
                  placeholder="Password"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-400 mt-1.5 ml-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div
              style={{ animation: "stagger-fade-in 0.5s ease-out 0.25s both" }}
            >
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`${inputBaseClasses} ${getFieldBorder("confirmPassword")}`}
                  placeholder="Confirm Password"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1.5 ml-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Remember me + Terms */}
            <div
              className="space-y-3 pt-1"
              style={{ animation: "stagger-fade-in 0.5s ease-out 0.3s both" }}
            >
              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/25 bg-white/5 peer-checked:bg-cyan-500/30 peer-checked:border-cyan-400/60 transition-all duration-200 group-hover:border-white/40" />
                  <svg className="absolute inset-0 w-4 h-4 text-cyan-400 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setFieldErrors((prev) => ({ ...prev, terms: "" }));
                    }}
                    className="sr-only peer"
                  />
                  <div className={`w-4 h-4 rounded border bg-white/5 peer-checked:bg-purple-500/30 transition-all duration-200 group-hover:border-white/40 ${fieldErrors.terms ? "border-red-400/60" : "border-white/25 peer-checked:border-purple-400/60"}`} />
                  <svg className="absolute inset-0 w-4 h-4 text-purple-400 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                  I agree to the{" "}
                  <span className="text-purple-400 hover:text-purple-300 underline underline-offset-2">Terms of Service</span>
                </span>
              </label>
              {fieldErrors.terms && (
                <p className="text-xs text-red-400 ml-7 -mt-1">{fieldErrors.terms}</p>
              )}
            </div>

            {/* Submit button */}
            <div style={{ animation: "stagger-fade-in 0.5s ease-out 0.35s both" }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                  boxShadow: "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.boxShadow = "0 0 32px rgba(147,51,234,0.5), 0 0 64px rgba(6,182,212,0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(147,51,234,0.3), 0 0 48px rgba(6,182,212,0.15)";
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* ─── Divider ─── */}
          <div
            className="flex items-center gap-3 my-5"
            style={{ animation: "stagger-fade-in 0.5s ease-out 0.4s both" }}
          >
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">Or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ─── Google button ─── */}
          <div style={{ animation: "stagger-fade-in 0.5s ease-out 0.45s both" }}>
            <button
              type="button"
              className="w-full py-3 rounded-xl font-medium text-sm text-slate-300 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10 active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* ─── Footer link ─── */}
          <p
            className="mt-6 text-center text-sm text-slate-500"
            style={{ animation: "stagger-fade-in 0.5s ease-out 0.5s both" }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              style={{ color: "#a78bfa" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#c4b5fd"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a78bfa"; }}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}