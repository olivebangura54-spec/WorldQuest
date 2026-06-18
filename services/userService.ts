import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";

export interface AvatarData {
  base: string;
  face?: string;
  hair?: string;
  outfit?: string;
  accessories?: string[];
  frame?: string;
  photoUrl?: string;
  detectedHair?: string;
  detectedSkin?: string;
  detectedEyes?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  characterName: string;
  avatar: string;
  avatarType?: "auto-generated" | "manual";
  avatarData?: AvatarData;
  photoAnalyzed?: boolean;
  explorerNameLower?: string;
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

export const createUserProfile = async (
  uid: string,
  email: string,
  characterName: string,
  avatar: string,
  extras?: {
    avatarType?: "auto-generated" | "manual";
    avatarData?: AvatarData;
    photoAnalyzed?: boolean;
  }
) => {
  const userRef = doc(db, "users", uid);
  const profile: UserProfile = {
    uid,
    email,
    characterName,
    avatar,
    avatarType: extras?.avatarType,
    avatarData: extras?.avatarData,
    photoAnalyzed: extras?.photoAnalyzed,
    explorerNameLower: characterName.toLowerCase(),
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

  await setDoc(userRef, profile);
  return profile;
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

export const checkExplorerNameUnique = async (name: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("explorerNameLower", "==", name.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
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
