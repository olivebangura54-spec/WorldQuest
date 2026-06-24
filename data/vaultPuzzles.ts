export interface VaultPuzzle {
  id: string;
  name: string;
  region: string;
  image: string;
  cost: number;
  difficulty: "easy" | "medium" | "hard";
  gridSize: number; // 4, 6, 8, 12, 16 cards
}

export const VAULT_PUZZLES: VaultPuzzle[] = [
  // Africa
  { id: "pyramid-giza", name: "Pyramid of Giza", region: "Africa", image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=400&fit=crop", cost: 50, difficulty: "easy", gridSize: 4 },
  { id: "victoria-falls", name: "Victoria Falls", region: "Africa", image: "https://images.unsplash.com/photo-1603201236596-eb1a63eb0ede?w=400&h=400&fit=crop", cost: 75, difficulty: "medium", gridSize: 6 },
  { id: "table-mountain", name: "Table Mountain", region: "Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=400&fit=crop", cost: 100, difficulty: "hard", gridSize: 8 },
  
  // Europe
  { id: "eiffel-tower", name: "Eiffel Tower", region: "Europe", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?w=400&h=400&fit=crop", cost: 50, difficulty: "easy", gridSize: 4 },
  { id: "colosseum", name: "Colosseum", region: "Europe", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop", cost: 75, difficulty: "medium", gridSize: 6 },
  { id: "santorini", name: "Santorini", region: "Europe", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=400&fit=crop", cost: 100, difficulty: "hard", gridSize: 8 },
  
  // Asia
  { id: "taj-mahal", name: "Taj Mahal", region: "Asia", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=400&fit=crop", cost: 50, difficulty: "easy", gridSize: 4 },
  { id: "great-wall", name: "Great Wall", region: "Asia", image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=400&fit=crop", cost: 75, difficulty: "medium", gridSize: 6 },
  { id: "angkor-wat", name: "Angkor Wat", region: "Asia", image: "https://images.unsplash.com/photo-1600520611035-8a297f05bf7e?w=400&h=400&fit=crop", cost: 100, difficulty: "hard", gridSize: 8 },
  
  // Americas
  { id: "machu-picchu", name: "Machu Picchu", region: "Americas", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=400&fit=crop", cost: 50, difficulty: "easy", gridSize: 4 },
  { id: "statue-liberty", name: "Statue of Liberty", region: "Americas", image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&h=400&fit=crop", cost: 75, difficulty: "medium", gridSize: 6 },
  { id: "christ-redeemer", name: "Christ the Redeemer", region: "Americas", image: "https://images.unsplash.com/photo-1593995863951-57cdd92b5c74?w=400&h=400&fit=crop", cost: 100, difficulty: "hard", gridSize: 8 },
];

export const getVaultPuzzle = (id: string) => VAULT_PUZZLES.find(p => p.id === id);
export const getPuzzlesByRegion = (region: string) => VAULT_PUZZLES.filter(p => p.region === region);