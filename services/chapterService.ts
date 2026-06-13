import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export interface Chapter {
  id: number;
  title: string;
  description: string;
  image: string;
  crystalName: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "The Explorer Begins",
    description: "Your journey starts here. Discover the basics of world history and geography.",
    image: "🧭",
    crystalName: "Crystal of Beginnings",
  },
  {
    id: 2,
    title: "Ancient Worlds",
    description: "Travel back in time to explore the mysteries of ancient civilizations.",
    image: "🏛️",
    crystalName: "Ancient Crystal",
  },
  {
    id: 3,
    title: "Legends & Leaders",
    description: "Meet the figures who shaped the course of human history.",
    image: "👑",
    crystalName: "Legend Crystal",
  },
  {
    id: 4,
    title: "Culture & Traditions",
    description: "Immerse yourself in the rich diversity of global cultures and foods.",
    image: "🎭",
    crystalName: "Culture Crystal",
  },
  {
    id: 5,
    title: "The World Challenge",
    description: "The ultimate test of your global knowledge. Can you become a World Scholar?",
    image: "🌟",
    crystalName: "Scholar Crystal",
  },
];

/**
 * Marks a chapter as completed for the user
 */
export const completeChapter = async (uid: string, chapterId: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    chaptersCompleted: arrayUnion(chapterId),
    currentChapter: chapterId + 1,
  });
};
