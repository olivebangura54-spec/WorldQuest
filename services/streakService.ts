import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { UserProfile } from "./userService";
import { addXP } from "./xpService";

/**
 * Checks and updates the user's daily streak
 */
export const checkAndUpdateStreak = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;

  const profile = userSnap.data() as UserProfile;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  
  const lastLogin = profile.lastLoginDate ? new Date(profile.lastLoginDate) : null;
  
  if (!lastLogin) {
    // First login ever or since streak system implemented
    await updateDoc(userRef, {
      streak: 1,
      lastLoginDate: today
    });
    return { streak: 1, bonusXP: 10 };
  }

  const lastLoginDateOnly = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
  const diffInDays = Math.floor((new Date(today).getTime() - lastLoginDateOnly.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Already logged in today
    return null;
  } else if (diffInDays === 1) {
    // Consecutive day!
    const newStreak = (profile.streak || 0) + 1;
    const bonusXP = Math.min(newStreak * 10, 50); // Cap bonus XP at 50
    
    await updateDoc(userRef, {
      streak: newStreak,
      lastLoginDate: today
    });
    
    await addXP(uid, bonusXP);
    
    return { streak: newStreak, bonusXP };
  } else {
    // Streak broken
    await updateDoc(userRef, {
      streak: 1,
      lastLoginDate: today
    });
    return { streak: 1, bonusXP: 10, reset: true };
  }
};
