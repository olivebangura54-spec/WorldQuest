import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export interface Puzzle {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  location: string;
  description: string;
  chapterId?: number;
}

export const MOCK_PUZZLES: Puzzle[] = [
  // Chapter 1
  { 
    id: "p1", 
    title: "The Great Sphinx", 
    imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "easy", 
    location: "Giza, Egypt",
    description: "The mythical creature with the head of a human and the body of a lion.",
    chapterId: 1 
  },
  // Chapter 2
  { 
    id: "p2", 
    title: "The Parthenon", 
    imageUrl: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "medium", 
    location: "Athens, Greece",
    description: "A former temple on the Athenian Acropolis dedicated to the goddess Athena.",
    chapterId: 2 
  },
  // Chapter 3
  { 
    id: "p3", 
    title: "Statue of Liberty", 
    imageUrl: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "medium", 
    location: "New York City, USA",
    description: "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
    chapterId: 3 
  },
  // Chapter 4
  { 
    id: "p4", 
    title: "Sushi Platter", 
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800", 
    category: "Food", 
    difficulty: "medium", 
    location: "Tokyo, Japan",
    description: "A traditional Japanese dish of prepared vinegared rice and seafood.",
    chapterId: 4 
  },
  // Chapter 5
  { 
    id: "p5", 
    title: "World Map", 
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "hard", 
    location: "Global",
    description: "A map representing the entire surface of the Earth.",
    chapterId: 5 
  },

  // Landmarks Category
  { 
    id: "p6", 
    title: "Eiffel Tower", 
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "easy",
    location: "Paris, France",
    description: "The iconic wrought-iron lattice tower on the Champ de Mars."
  },
  { 
    id: "p9", 
    title: "Colosseum", 
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "medium",
    location: "Rome, Italy",
    description: "The largest ancient amphitheatre ever built."
  },
  { 
    id: "p10", 
    title: "Taj Mahal", 
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800", 
    category: "Landmarks", 
    difficulty: "medium",
    location: "Agra, India",
    description: "An ivory-white marble mausoleum on the right bank of the river Yamuna."
  },

  // Animals Category
  { 
    id: "p13", 
    title: "Giant Panda", 
    imageUrl: "https://images.unsplash.com/photo-1521115842434-836ef15a0314?auto=format&fit=crop&q=80&w=800", 
    category: "Animals", 
    difficulty: "easy",
    location: "Sichuan, China",
    description: "A bear native to south central China, characterized by its bold black-and-white coat."
  },
  { 
    id: "p14", 
    title: "African Elephant", 
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800", 
    category: "Animals", 
    difficulty: "medium",
    location: "Serengeti, Tanzania",
    description: "The largest living land animal, found in sub-Saharan Africa."
  },
  { 
    id: "p15", 
    title: "Bengal Tiger", 
    imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800", 
    category: "Animals", 
    difficulty: "hard",
    location: "Sundarbans, India",
    description: "A tiger from a specific population of the Panthera tigris tigris subspecies native to the Indian subcontinent."
  },

  // Food Category
  { 
    id: "p19", 
    title: "African Fried Rice", 
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800", 
    category: "Food", 
    difficulty: "medium",
    location: "Lagos, Nigeria",
    description: "A flavorful rice dish mixed with vegetables, meats, and spices."
  },
  { 
    id: "p20", 
    title: "Foofoo", 
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800", 
    category: "Food", 
    difficulty: "hard",
    location: "West Africa",
    description: "A staple West African dish made from mashed starchy vegetables."
  },
  { 
    id: "p21", 
    title: "Italian Pizza", 
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800", 
    category: "Food", 
    difficulty: "easy",
    location: "Naples, Italy",
    description: "A savory dish of Italian origin consisting of a flattened base of leavened wheat-based dough."
  },

  // Culture Category
  { 
    id: "p25", 
    title: "Ancient Chinese Garden", 
    imageUrl: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?auto=format&fit=crop&q=80&w=800", 
    category: "Culture", 
    difficulty: "hard",
    location: "Suzhou, China",
    description: "A classical garden style which has evolved over three thousand years."
  },
  { 
    id: "p26", 
    title: "African Tribal Art", 
    imageUrl: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800", 
    category: "Culture", 
    difficulty: "medium",
    location: "Sub-Saharan Africa",
    description: "Masks and artifacts representing the rich spiritual and artistic traditions of African tribes."
  },
  { 
    id: "p31", 
    title: "The Forbidden City", 
    imageUrl: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&q=80&w=800", 
    category: "Culture", 
    difficulty: "hard",
    location: "Beijing, China",
    description: "The former Chinese imperial palace from the Ming dynasty to the end of the Qing dynasty."
  },
  { 
    id: "p32", 
    title: "Maasai Warriors", 
    imageUrl: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80&w=800", 
    category: "Culture", 
    difficulty: "medium",
    location: "Kenya/Tanzania",
    description: "Nilotic ethnic group inhabiting northern, central and southern Kenya and northern Tanzania."
  },

  // People Category
  { 
    id: "p27", 
    title: "Nelson Mandela Tribute", 
    imageUrl: "https://images.unsplash.com/photo-1590133325985-2c64ca0ff972?auto=format&fit=crop&q=80&w=800", 
    category: "People", 
    difficulty: "hard",
    location: "Soweto, South Africa",
    description: "South African anti-apartheid revolutionary, statesman and philanthropist."
  },
  { 
    id: "p28", 
    title: "Classic Pop Legend", 
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=800", 
    category: "People", 
    difficulty: "hard",
    location: "USA",
    description: "A tribute to the globally recognized King of Pop."
  },
  { 
    id: "p29", 
    title: "World Explorer", 
    imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800", 
    category: "People", 
    difficulty: "easy",
    location: "Various",
    description: "An adventurer dedicated to discovering the wonders of the world."
  },
  { 
    id: "p30", 
    title: "Albert Einstein", 
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", 
    category: "People", 
    difficulty: "medium",
    location: "Bern, Switzerland",
    description: "Theoretical physicist who developed the theory of relativity."
  }
];

export const CATEGORIES = ["All", "Landmarks", "Food", "Animals", "Culture", "People"];

export const getAllPuzzles = () => {
  return MOCK_PUZZLES;
};

export const getPuzzleForChapter = (chapterId: number): Puzzle | null => {
  return MOCK_PUZZLES.find(p => p.chapterId === chapterId) || null;
};

export const completePuzzle = async (uid: string, puzzleId: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    puzzlesCompleted: arrayUnion(puzzleId),
  });
};
