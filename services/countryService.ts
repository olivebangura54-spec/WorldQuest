/**
 * Country-based puzzle system with 5-8 puzzles per country.
 * All puzzle images are intended to be AI-generated in a painterly
 * travel-poster style. Placeholder URLs use Unsplash until AI
 * generation is integrated.
 */

export interface CountryPuzzle {
  id: string;
  name: string;
  artPrompt: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  landmark: string;
  color: string;
  description: string;
  puzzles: CountryPuzzle[];
}

const AI_STYLE_SUFFIX =
  ", warm golden hour lighting, vibrant colors with soft gradients, atmospheric depth, dreamy magical realism, travel poster style, highly detailed, painterly illustration, NO text, NO words, NO letters, NO labels, pure illustration only";

export const COUNTRIES: Country[] = [
  // ═══════════════════════════════════════════
  // SIERRA LEONE
  // ═══════════════════════════════════════════
  {
    id: "sierra_leone",
    name: "Sierra Leone",
    flag: "🇸🇱",
    landmark: "Cotton Tree",
    color: "#1a4d2e",
    description: "The Pearl of West Africa — rich history, diamond shores, and lush rainforests.",
    puzzles: [
      {
        id: "sl_freetown",
        name: "Freetown Harbor",
        artPrompt: "Freetown harbor with colorful fishing boats and bustling waterfront" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "sl_cotton_tree",
        name: "Cotton Tree",
        artPrompt: "The historic Cotton Tree in Freetown, massive ancient tree with wide canopy" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "sl_banana_islands",
        name: "Banana Islands",
        artPrompt: "Banana Islands beach with turquoise water and white sand" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "sl_loma_mountains",
        name: "Loma Mountains",
        artPrompt: "Loma Mountains forest with mist rolling over green peaks" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "sl_mask_dance",
        name: "Traditional Dance",
        artPrompt: "Traditional Sierra Leonean mask dance ceremony with vibrant costumes" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1504704911898-68304a7d2571?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "sl_bureh_beach",
        name: "Bureh Beach",
        artPrompt: "Bureh Beach at sunset with waves crashing on rocky shore and surfers" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1505225051952-69b216aca661?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "sl_outamba",
        name: "Outamba-Kilimi",
        artPrompt: "Outamba-Kilimi National Park with elephants at a watering hole" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "sl_diamond",
        name: "Diamond Mines",
        artPrompt: "Sierra Leone diamond mining river with workers sifting through water" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 35,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // EGYPT
  // ═══════════════════════════════════════════
  {
    id: "egypt",
    name: "Egypt",
    flag: "🇪🇬",
    landmark: "The Pyramids",
    color: "#c49b3f",
    description: "Land of the Pharaohs — ancient wonders along the Nile.",
    puzzles: [
      {
        id: "eg_sphinx",
        name: "The Sphinx",
        artPrompt: "The Great Sphinx of Giza with pyramids in the desert at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1539768942893-daf53e736b68?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "eg_pyramids",
        name: "Pyramids of Giza",
        artPrompt: "The three Pyramids of Giza at golden hour with desert sand" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "eg_nile",
        name: "Nile River",
        artPrompt: "Nile River at sunset with felucca boat and palm trees" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "eg_desert",
        name: "Desert Journey",
        artPrompt: "Egyptian desert with camel caravan crossing golden dunes at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "eg_karnak",
        name: "Temple of Karnak",
        artPrompt: "Ancient Egyptian temple columns of Karnak with sunlight streaming through" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1568322503122-d219b06d2b3a?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "eg_tomb",
        name: "Pharaoh's Tomb",
        artPrompt: "Golden tomb interior with hieroglyphics and ancient treasures" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "eg_cairo",
        name: "Cairo Cityscape",
        artPrompt: "Cairo cityscape with mosques and minarets at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "eg_scarab",
        name: "Golden Scarab",
        artPrompt: "Golden scarab beetle with Egyptian ornamental patterns and hieroglyphs" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 45,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // JAPAN
  // ═══════════════════════════════════════════
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    landmark: "Mount Fuji",
    color: "#c23b5c",
    description: "The Land of the Rising Sun — where ancient tradition meets neon future.",
    puzzles: [
      {
        id: "jp_fuji",
        name: "Mount Fuji",
        artPrompt: "Mount Fuji with cherry blossoms in full bloom and lake reflection" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "jp_tokyo",
        name: "Tokyo Skyline",
        artPrompt: "Tokyo skyline with neon lights and tower at night" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "jp_sushi",
        name: "Sushi Platter",
        artPrompt: "Traditional Japanese sushi platter on wooden board with garnishes" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "jp_bamboo",
        name: "Bamboo Forest",
        artPrompt: "Kyoto bamboo forest with sunlight filtering through tall stalks" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "jp_fushimi",
        name: "Fushimi Inari Gates",
        artPrompt: "Fushimi Inari shrine with hundreds of red torii gates in a row" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "jp_garden",
        name: "Japanese Garden",
        artPrompt: "Japanese garden with koi pond, red bridge, and autumn maple leaves" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 25,
      },
      {
        id: "jp_monkeys",
        name: "Snow Monkeys",
        artPrompt: "Snow monkeys relaxing in a hot spring surrounded by snowy mountains" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "jp_samurai",
        name: "Samurai Armor",
        artPrompt: "Ornate samurai armor displayed in traditional Japanese setting" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // FRANCE
  // ═══════════════════════════════════════════
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    landmark: "Eiffel Tower",
    color: "#2b4a8e",
    description: "The Hexagon — art, romance, and culinary excellence.",
    puzzles: [
      {
        id: "fr_eiffel",
        name: "Eiffel Tower",
        artPrompt: "Eiffel Tower with cherry blossoms at golden hour" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "fr_louvre",
        name: "Louvre Museum",
        artPrompt: "Louvre Museum glass pyramid at twilight with warm lights" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "fr_lavender",
        name: "Lavender Fields",
        artPrompt: "Provence lavender fields stretching to the horizon at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "fr_mont",
        name: "Mont Saint-Michel",
        artPrompt: "Mont Saint-Michel castle on island with tide coming in at dawn" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "fr_cafe",
        name: "Parisian Café",
        artPrompt: "Charming Parisian café scene with outdoor seating and flowers" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 25,
      },
      {
        id: "fr_vineyard",
        name: "Countryside Vineyard",
        artPrompt: "French countryside vineyard with rolling hills at golden hour" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "fr_notredame",
        name: "Notre Dame",
        artPrompt: "Notre Dame cathedral exterior with intricate gothic details at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "fr_versailles",
        name: "Versailles Gardens",
        artPrompt: "Versailles palace gardens with fountains and manicured hedges" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // INDIA
  // ═══════════════════════════════════════════
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    landmark: "Taj Mahal",
    color: "#d4760a",
    description: "Incredible India — a tapestry of colors, flavors, and ancient wisdom.",
    puzzles: [
      {
        id: "in_taj",
        name: "Taj Mahal",
        artPrompt: "Taj Mahal at sunrise with reflection pool and morning mist" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "in_jaipur",
        name: "Jaipur Pink City",
        artPrompt: "Jaipur pink city with ornate buildings and Hawa Mahal palace" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "in_kerala",
        name: "Kerala Backwaters",
        artPrompt: "Kerala backwaters with traditional houseboat on calm water at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "in_holi",
        name: "Holi Festival",
        artPrompt: "Holi festival celebration with people throwing vibrant colored powders" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1551966190-0157c1a468e4?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 25,
      },
      {
        id: "in_tiger",
        name: "Indian Tiger",
        artPrompt: "Bengal tiger in lush Indian jungle with dappled sunlight" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "in_bollywood",
        name: "Bollywood Cinema",
        artPrompt: "Colorful Bollywood dance scene with elaborate costumes and lights" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "in_rajasthan",
        name: "Desert Palace",
        artPrompt: "Rajasthan desert palace rising from sand dunes at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "in_lotus",
        name: "Lotus Temple",
        artPrompt: "Lotus Temple in Delhi with its unique flower-shaped architecture" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // BRAZIL
  // ═══════════════════════════════════════════
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    landmark: "Christ the Redeemer",
    color: "#2e7d32",
    description: "Aquarela do Brasil — carnival rhythms, Amazon wonders, and endless beaches.",
    puzzles: [
      {
        id: "br_christ",
        name: "Christ the Redeemer",
        artPrompt: "Christ the Redeemer statue atop Corcovado mountain with Rio below at sunset" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "br_carnival",
        name: "Rio Carnival",
        artPrompt: "Rio Carnival parade with elaborate floats and samba dancers in feathered costumes" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1551279880-02ee1834602a?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "br_amazon",
        name: "Amazon Rainforest",
        artPrompt: "Amazon rainforest canopy with mist rising and exotic birds flying" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
      {
        id: "br_iguazu",
        name: "Iguazu Waterfalls",
        artPrompt: "Iguazu Falls with massive cascading water and lush tropical vegetation" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1432405972618-c6b0cfba8e77?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 35,
      },
      {
        id: "br_copacabana",
        name: "Copacabana Beach",
        artPrompt: "Copacabana beach with iconic wave pattern sidewalk and palm trees" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
        difficulty: "easy",
        xpReward: 20,
      },
      {
        id: "br_coffee",
        name: "Coffee Plantation",
        artPrompt: "Brazilian coffee plantation with rows of green coffee plants and red berries" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "br_salvador",
        name: "Colonial Salvador",
        artPrompt: "Colorful colonial architecture of Salvador Bahia with cobblestone streets" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800",
        difficulty: "medium",
        xpReward: 30,
      },
      {
        id: "br_toucan",
        name: "Toucan in the Jungle",
        artPrompt: "Tropical toucan bird perched on a branch in lush Amazon jungle" + AI_STYLE_SUFFIX,
        imageUrl: "https://images.unsplash.com/photo-1517697471337-85a68c7ce378?auto=format&fit=crop&q=80&w=800",
        difficulty: "hard",
        xpReward: 40,
      },
    ],
  },
];

/**
 * Get all countries
 */
export const getAllCountries = (): Country[] => COUNTRIES;

/**
 * Get a single country by ID
 */
export const getCountryById = (id: string): Country | undefined =>
  COUNTRIES.find((c) => c.id === id);

/**
 * Get all puzzles across all countries
 */
export const getAllPuzzles = (): (CountryPuzzle & { countryId: string; countryName: string })[] =>
  COUNTRIES.flatMap((country) =>
    country.puzzles.map((puzzle) => ({
      ...puzzle,
      countryId: country.id,
      countryName: country.name,
    }))
  );

/**
 * Get total puzzle count
 */
export const getTotalPuzzleCount = (): number =>
  COUNTRIES.reduce((sum, country) => sum + country.puzzles.length, 0);