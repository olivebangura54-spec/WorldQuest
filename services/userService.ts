import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  characterName: string;
  avatar: string;
  level: number;
  xp: number;
  title: string;
  streak: number;
  currentChapter: number;
  chaptersCompleted: number[];
  achievements: string[];
  puzzlesCompleted: string[];
  lastLoginDate?: string;
  createdAt: string;
}

export const createUserProfile = async (uid: string, email: string, characterName: string, avatar: string) => {
  console.log("Starting createUserProfile for:", uid);
  const userRef = doc(db, "users", uid);
  const profile: UserProfile = {
    uid,
    email,
    characterName,
    avatar,
    level: 1,
    xp: 0,
    title: "Explorer",
    streak: 0,
    currentChapter: 1,
    chaptersCompleted: [],
    achievements: [],
    puzzlesCompleted: [],
    createdAt: new Date().toISOString(),
  };

  try {
    console.log("Setting doc in Firestore...");
    await setDoc(userRef, profile);
    console.log("Firestore doc set successfully.");
    return profile;
  } catch (error) {
    console.error("Error in setDoc:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  } else {
    return null;
  }
};

export const getTopUsers = async (count: number = 10) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("xp", "desc"), limit(count));
  const querySnapshot = await getDocs(q);
  
  const users: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as UserProfile);
  });
  
  return users;
};
