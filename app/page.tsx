import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-[#070b14]" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8" style={{ animation: 'fade-in 0.6s ease-out' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-blue-300">Beta Access Available</span>
        </div>

        {/* Main heading */}
        <h1
          className="text-6xl md:text-8xl font-black tracking-tight mb-6"
          style={{ animation: 'slide-up 0.8s ease-out' }}
        >
          <span className="gradient-text">World</span>
          <span className="text-white">Quest</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ animation: 'slide-up 0.8s ease-out 0.1s both' }}
        >
          Transform your learning into an epic adventure. Recover the Knowledge Crystals and become a World Scholar.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'slide-up 0.8s ease-out 0.2s both' }}
        >
          <Link
            href="/auth/signup"
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Adventure
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 text-gray-400 hover:text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-white/5"
          >
            Sign In
          </Link>
        </div>

        {/* Feature badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-16"
          style={{ animation: 'slide-up 0.8s ease-out 0.3s both' }}
        >
          {[
            { icon: "🌍", label: "5 Chapters" },
            { icon: "🧩", label: "Puzzles" },
            { icon: "🏆", label: "Leaderboard" },
            { icon: "📚", label: "50+ Questions" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-400"
            >
              <span>{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070b14] to-transparent" />
    </main>
  );
}