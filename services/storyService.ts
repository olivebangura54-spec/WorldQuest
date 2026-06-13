export interface StoryScene {
  id: string;
  text: string;
  image?: string;
  chapterId: number;
}

export const CHAPTER_STORIES: Record<number, StoryScene[]> = {
  1: [
    {
      id: "1-1",
      chapterId: 1,
      text: "Welcome, Explorer! The World Archive has been breached, and the Knowledge Crystals are missing. We need your help to recover them.",
      image: "🏛️",
    },
    {
      id: "1-2",
      chapterId: 1,
      text: "The first crystal, the Crystal of Beginnings, was last seen in the cradle of civilization. To find it, you must prove your knowledge of our world's foundations.",
      image: "🧭",
    },
    {
      id: "1-3",
      chapterId: 1,
      text: "You're doing great! The path ahead is clear. Let's see if you can handle the next challenge.",
      image: "🌟",
    },
    {
      id: "1-4",
      chapterId: 1,
      text: "Almost there! The Crystal of Beginnings is within reach. One final test stands between you and your goal.",
      image: "💎",
    }
  ],
  2: [
    {
      id: "2-1",
      chapterId: 2,
      text: "You've secured the first crystal! Now, we must travel back to the Ancient Worlds to find the second one.",
      image: "🏺",
    },
    {
      id: "2-2",
      chapterId: 2,
      text: "From the pyramids of Giza to the Colosseum, these monuments hold the keys to our history.",
      image: "🏛️",
    },
    {
      id: "2-3",
      chapterId: 2,
      text: "The Ancient Crystal is buried deep within the ruins. Solve the riddles of the past to proceed.",
      image: "🕯️",
    },
    {
      id: "2-4",
      chapterId: 2,
      text: "The echoes of history lead you to the final chamber. The second crystal is yours if you can pass the trial.",
      image: "🏺",
    }
  ],
  3: [
    {
      id: "3-1",
      chapterId: 3,
      text: "Two crystals down! Our next stop is the era of Legends & Leaders.",
      image: "👑",
    },
    {
      id: "3-2",
      chapterId: 3,
      text: "Great minds and powerful rulers have left their mark on our world. Their stories are part of the archive.",
      image: "📜",
    },
    {
      id: "3-3",
      chapterId: 3,
      text: "To find the Legend Crystal, you must understand the decisions that changed the world.",
      image: "⚔️",
    },
    {
      id: "3-4",
      chapterId: 3,
      text: "A true leader knows the importance of knowledge. Prove your wisdom to claim the third crystal.",
      image: "👑",
    }
  ],
  4: [
    {
      id: "4-1",
      chapterId: 4,
      text: "The archive is growing brighter! Now, let's explore the rich tapestry of Culture & Traditions.",
      image: "🎭",
    },
    {
      id: "4-2",
      chapterId: 4,
      text: "From the food we eat to the music we play, culture is what makes our world beautiful.",
      image: "🍜",
    },
    {
      id: "4-3",
      chapterId: 4,
      text: "The Culture Crystal is hidden within a global festival. Follow the sounds and scents of the world.",
      image: "🏮",
    },
    {
      id: "4-4",
      chapterId: 4,
      text: "By celebrating our diversity, you've reached the final challenge. The fourth crystal is almost yours.",
      image: "🎭",
    }
  ],
  5: [
    {
      id: "5-1",
      chapterId: 5,
      text: "One crystal remains! The ultimate trial: The World Challenge.",
      image: "🌟",
    },
    {
      id: "5-2",
      chapterId: 5,
      text: "This chapter combines everything you've learned. Only a true World Scholar can succeed here.",
      image: "🌍",
    },
    {
      id: "5-3",
      chapterId: 5,
      text: "The Archive is almost restored. Every question brings us closer to safety.",
      image: "📚",
    },
    {
      id: "5-4",
      chapterId: 5,
      text: "This is it! The Scholar Crystal is before you. Complete the final boss challenge to save the Archive!",
      image: "✨",
    }
  ]
};

/**
 * Fetches story scenes for a specific chapter
 */
export const getStoryScenes = (chapterId: number): StoryScene[] => {
  return CHAPTER_STORIES[chapterId] || [];
};
