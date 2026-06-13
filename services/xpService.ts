import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { UserProfile } from "./userService";

/**
 * Level Thresholds
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level 4: 500 XP
 * Level 5: 800 XP
 */
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  4000,   // Level 10
];

/**
 * Titles associated with levels
 */
export const TITLES = {
  1: "Explorer",
  3: "Adventurer",
  5: "World Scholar",
  10: "Master Explorer",
};

/**
 * Calculates the level based on total XP
 */
export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

/**
 * Gets the highest title earned based on current level
 */
export const getTitleForLevel = (level: number): string => {
  const levels = Object.keys(TITLES).map(Number).sort((a, b) => b - a);
  for (const l of levels) {
    if (level >= l) {
      return TITLES[l as keyof typeof TITLES];
    }
  }
  return "Explorer";
};

/**
 * Adds XP to a user and updates their level and title if necessary
 */
export const addXP = async (uid: string, amount: number) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    throw new Error("User profile not found");
  }

  const currentData = userSnap.data() as UserProfile;
  const newXP = (currentData.xp || 0) + amount;
  const newLevel = calculateLevel(newXP);
  const newTitle = getTitleForLevel(newLevel);

  const updates: Partial<UserProfile> = {
    xp: increment(amount) as any,
    level: newLevel,
    title: newTitle,
  };

  await updateDoc(userRef, updates);

  return {
    xp: newXP,
    level: newLevel,
    title: newTitle,
    leveledUp: newLevel > (currentData.level || 1),
  };
};
