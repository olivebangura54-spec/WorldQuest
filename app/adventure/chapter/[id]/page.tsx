"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStoryScenes, StoryScene as StorySceneType } from "@/services/storyService";
import { CHAPTERS, completeChapter } from "@/services/chapterService";
import { getQuestionsForChapter, Question } from "@/services/questionService";
import { addXP } from "@/services/xpService";
import { getPuzzleForChapter, completePuzzle as savePuzzleCompletion } from "@/services/puzzleService";
import { checkAchievements } from "@/services/achievementService";
import { getUserProfile } from "@/services/userService";
import ProtectedRoute from "@/components/ProtectedRoute";
import StoryScene from "@/components/StoryScene";
import QuestionView from "@/components/QuestionView";
import PuzzleView from "@/components/PuzzleView";
import XPPopup from "@/components/XPPopup";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ChapterStep = {
  type: "story" | "question" | "puzzle";
  data: any;
};

type AdventureStats = {
  correct: number;
  incorrect: number;
  startTime: number;
  endTime: number | null;
  xpEarned: number;
  streak: number;
};

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const chapterId = parseInt(resolvedParams.id);
  const { user } = useAuth();
  const router = useRouter();
  
  const [steps, setSteps] = useState<ChapterStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showXPPopup, setShowXPPopup] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const [stats, setStats] = useState<AdventureStats>({
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
    endTime: null,
    xpEarned: 0,
    streak: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    const chapterData = CHAPTERS.find(c => c.id === chapterId);
    if (!chapterData) {
      router.push("/adventure");
      return;
    }
    setChapter(chapterData);

    const scenes = getStoryScenes(chapterId);
    const questions = getQuestionsForChapter(chapterId);
    
    // Get current streak from profile
    let currentStreak = 0;
    if (user) {
      const profile = await getUserProfile(user.uid);
      currentStreak = profile?.streak || 0;
    }

    const standardQuestions = questions.filter(q => !q.isBoss);
    const bossQuestion = questions.find(q => q.isBoss);
    const puzzle = getPuzzleForChapter(chapterId);

    const interleavedSteps: ChapterStep[] = [];
    if (scenes[0]) interleavedSteps.push({ type: "story", data: scenes[0] });
    if (standardQuestions[0]) interleavedSteps.push({ type: "question", data: standardQuestions[0] });
    if (standardQuestions[1]) interleavedSteps.push({ type: "question", data: standardQuestions[1] });
    if (scenes[1]) interleavedSteps.push({ type: "story", data: scenes[1] });
    if (standardQuestions[2]) interleavedSteps.push({ type: "question", data: standardQuestions[2] });
    if (standardQuestions[3]) interleavedSteps.push({ type: "question", data: standardQuestions[3] });
    if (puzzle) interleavedSteps.push({ type: "puzzle", data: puzzle });
    if (scenes[2]) interleavedSteps.push({ type: "story", data: scenes[2] });
    if (standardQuestions[4]) interleavedSteps.push({ type: "question", data: standardQuestions[4] });
    if (standardQuestions[5]) interleavedSteps.push({ type: "question", data: standardQuestions[5] });
    if (standardQuestions[6]) interleavedSteps.push({ type: "question", data: standardQuestions[6] });
    if (standardQuestions[7]) interleavedSteps.push({ type: "question", data: standardQuestions[7] });
    if (bossQuestion) interleavedSteps.push({ type: "question", data: bossQuestion });
    if (scenes[3]) interleavedSteps.push({ type: "story", data: scenes[3] });

    setSteps(interleavedSteps);
    setLoading(false);
    setStats({
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
      endTime: null,
      xpEarned: 0,
      streak: currentStreak,
    });
    setCurrentStepIndex(0);
    setIsFinished(false);
  };

  useEffect(() => {
    fetchData();
  }, [chapterId, router, user?.uid]); // Re-run when user ID becomes available

  const handleNext = async (isCorrectAnswer?: boolean) => {
    if (user) {
      const currentStep = steps[currentStepIndex];
      
      if (currentStep.type === "question" && isCorrectAnswer !== undefined) {
        if (isCorrectAnswer) {
          const amount = currentStep.data.isBoss ? 25 : 10;
          const result = await addXP(user.uid, amount);
          setStats(prev => ({ ...prev, correct: prev.correct + 1, xpEarned: prev.xpEarned + amount }));
          setShowXPPopup(amount);

          if (result.leveledUp) {
            alert(`LEVEL UP! You reached Level ${result.level}: ${result.title}!`);
          }
        } else {
          setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
      } else if (currentStep.type === "puzzle") {
        const amount = 25;
        const result = await addXP(user.uid, amount);
        await savePuzzleCompletion(user.uid, currentStep.data.id);
        setStats(prev => ({ ...prev, xpEarned: prev.xpEarned + amount }));
        setShowXPPopup(amount);

        if (result.leveledUp) {
          alert(`LEVEL UP! You reached Level ${result.level}: ${result.title}!`);
        }
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Chapter Complete
      if (user) {
        const result = await addXP(user.uid, 100); // Chapter Completion Bonus
        await completeChapter(user.uid, chapterId);
        setStats(prev => ({ ...prev, endTime: Date.now(), xpEarned: prev.xpEarned + 100 }));
        
        if (result.leveledUp) {
          alert(`LEVEL UP! You reached Level ${result.level}: ${result.title}!`);
        }
        const earned = await checkAchievements(user.uid);
        if (earned.length > 0) {
          alert(`Achievements Unlocked: ${earned.map(a => a.title).join(", ")}`);
        }
      }
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isFinished) {
    const timeTaken = Math.floor(((stats.endTime || Date.now()) - stats.startTime) / 1000);
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    const totalQuestions = stats.correct + stats.incorrect;
    const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 100;

    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-gray-900 border border-blue-500/30 rounded-[3rem] p-12 text-center shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in duration-500">
          <div className="text-7xl mb-6">💎</div>
          <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">Chapter Complete</h2>
          <p className="text-blue-400 font-bold mb-10 tracking-widest text-xs uppercase">The {chapter?.crystalName} has been restored</p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Time Taken</div>
              <div className="text-2xl font-mono font-bold text-white">{mins}m {secs}s</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">XP Earned</div>
              <div className="text-2xl font-mono font-bold text-yellow-500">+{stats.xpEarned}</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-2xl font-mono font-bold text-green-400">{accuracy}%</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800 flex flex-col items-center relative overflow-hidden">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Streak</div>
              <div className="text-2xl font-mono font-bold text-orange-500 flex items-center">
                {stats.streak} <span className="text-xl ml-1">🔥</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push("/adventure")}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/40"
            >
              Back to World Map
            </button>
            <button 
              onClick={() => fetchData()}
              className="w-full py-3 text-gray-400 hover:text-white font-bold transition-all text-sm"
            >
              Retry Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
        <header className="flex items-center mb-10 max-w-5xl mx-auto w-full">
          <Link href="/adventure" className="text-gray-400 hover:text-white transition group flex items-center">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Exit Adventure
          </Link>
          <div className="ml-auto flex items-center space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono text-blue-500 uppercase tracking-tighter">
                {chapter?.title}
              </span>
              <span className="text-xs text-gray-500">Step {currentStepIndex + 1} of {steps.length}</span>
            </div>
            <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-10">
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {currentStep.type === "story" ? (
              <StoryScene 
                scene={currentStep.data} 
                onContinue={() => handleNext()} 
              />
            ) : currentStep.type === "question" ? (
              <QuestionView 
                key={currentStep.data.id}
                question={currentStep.data} 
                onAnswer={(isCorrect) => handleNext(isCorrect)} 
              />
            ) : (
              <PuzzleView 
                puzzle={currentStep.data} 
                onComplete={() => handleNext()} 
              />
            )}
          </div>
        </main>

        <footer className="max-w-5xl mx-auto w-full py-6 flex items-center justify-between border-t border-gray-900">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-1">
              {[...Array(stats.correct)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              ))}
              {[...Array(stats.incorrect)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              ))}
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Session Progress</span>
          </div>
          <span className="text-blue-500 font-mono text-sm font-bold">+{stats.xpEarned} XP</span>
        </footer>

        {showXPPopup !== null && (
          <XPPopup amount={showXPPopup} onComplete={() => setShowXPPopup(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
