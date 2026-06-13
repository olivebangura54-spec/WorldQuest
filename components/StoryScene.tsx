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
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-8xl bg-gray-800 p-8 rounded-3xl border-2 border-blue-500 shadow-2xl transition-transform hover:scale-110">
        {scene.image || "📖"}
      </div>
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl text-center relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Story Scene
        </div>
        <p className="text-xl leading-relaxed text-gray-200 italic">
          &quot;{scene.text}&quot;
        </p>
      </div>
      <button
        onClick={onContinue}
        className="px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg border-b-4 border-blue-800"
      >
        Continue Journey
      </button>
    </div>
  );
}
