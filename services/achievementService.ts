import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { UserProfile } from "./userService";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    title: "🌍 First Steps",
    description: "Complete Chapter 1",
    icon: "🌍",
  },
  {
    id: "history_buff",
    title: "🏛️ History Buff",
    description: "Complete the Ancient Worlds chapter",
    icon: "🏛️",
  },
  {
    id: "puzzle_master",
    title: "🧩 Puzzle Master",
    description: "Complete 5 puzzles in the vault",
    icon: "🧩",
  },
  {
    id: "world_scholar",
    title: "🏅 World Scholar",
    description: "Reach Level 5",
    icon: "🏅",
  },
  {
    id: "streak_starter",
    title: "🔥 Streak Starter",
    description: "Start your first daily streak",
    icon: "🔥",
  }
];

/**
 * Checks and awards achievements based on user profile state
 */
export const checkAchievements = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return [];

  const profile = userSnap.data() as UserProfile;
  const currentAchievements = profile.achievements || [];
  const newlyEarned: Achievement[] = [];

  // Logic for each achievement
  const checkList = [
    { id: "first_steps", condition: profile.chaptersCompleted.includes(1) },
    { id: "history_buff", condition: profile.chaptersCompleted.includes(2) },
    { id: "puzzle_master", condition: profile.puzzlesCompleted.length >= 5 },
    { id: "world_scholar", condition: profile.level >= 5 },
    { id: "streak_starter", condition: profile.streak >= 1 },
  ];

  for (const item of checkList) {
    if (item.condition && !currentAchievements.includes(item.id)) {
      await updateDoc(userRef, {
        achievements: arrayUnion(item.id)
      });
      const achievement = ACHIEVEMENTS.find(a => a.id === item.id);
      if (achievement) newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
};
