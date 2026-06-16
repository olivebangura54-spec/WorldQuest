"use client";

interface StorySceneProps {
  scene: {
    text: string;
    image?: string;
  };
  onContinue: () => void;
}

export default function StoryScene({ scene, onContinue }: StorySceneProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="flex flex-col items-center text-center"
        style={{ animation: 'fade-in 0.8s ease-out' }}
      >
        {/* Scene icon */}
        <div className="text-7xl mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/[0.06] shadow-[0_0_40px_rgba(59,130,246,0.08)]" style={{ animation: 'float 3s ease-in-out infinite' }}>
          {scene.image || "📖"}
        </div>

        {/* Story text */}
        <div className="card-base p-8 mb-8 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Story</span>
          </div>
          <p className="text-lg leading-relaxed text-gray-300">
            "{scene.text}"
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="btn-primary flex items-center gap-2"
        >
          Continue Journey
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}