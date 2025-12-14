
import { GoogleGenAI } from "@google/genai";
import { TourData } from "../types";
import { staticTours } from "../data/staticTours";
import { STATIC_IMAGES } from "../data/images";
import { MOCK_COUNTRIES } from "../constants";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Caching Logic ---
// Changed to 'v4' to invalidate previous images and force regeneration with strict Art Director style
const CACHE_PREFIX = 'explore_capitals_v4_img_';

// Circuit breaker state for rate limiting
let isRateLimited = false;

const getCachedImage = (keyword: string): string | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${keyword}`);
    if (cached) {
      return cached;
    }
  } catch (e) {
    console.warn("Error reading from image cache", e);
  }
  return null;
};

const saveToCache = (keyword: string, dataUrl: string) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${keyword}`, dataUrl);
  } catch (e) {
    console.warn("Local storage full or disabled, could not cache image for:", keyword);
  }
};

const checkImageAvailability = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
};

export const getCountryInsights = async (countryName: string, query: string): Promise<string> => {
    await delay(500);
    return `That is a great question about ${countryName}! Explore our directory to find more specific details about its geography and culture.`;
};

export const getCountryDescription = async (countryName: string): Promise<string> => {
    const country = MOCK_COUNTRIES.find(c => c.name === countryName);
    return country ? country.description : "";
};

// Replaces AI image generation with deterministic static image logic, with AI fallback + Caching
export const getGeneratedImage = async (keyword: string, type: 'landscape' | 'landmark' = 'landscape'): Promise<string | null> => {
  
  // 1. Try Static Image & Availability Check
  if (STATIC_IMAGES[keyword]) {
    const isAvailable = await checkImageAvailability(STATIC_IMAGES[keyword]);
    if (isAvailable) {
      return STATIC_IMAGES[keyword];
    }
    console.warn(`Static image for "${keyword}" unreachable or missing. Checking cache...`);
  }

  // 2. Check Local Cache (If we already generated this AI image before, use it)
  const cachedImage = getCachedImage(keyword);
  if (cachedImage) {
    return cachedImage;
  }

  // 3. AI Generation (Only if not rate limited)
  if (!isRateLimited) {
      console.log(`Generating new AI image for "${keyword}"...`);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Strict Style Prompt based on Art Director requirements
        const prompt = `Generate a wide-angle landscape image of ${keyword}.

STYLE CONSTRAINTS (DO NOT ALTER):
"MODERN FLAT VECTOR ILLUSTRATION. 16:9 aspect ratio. 2D. Borderless. NO BLACK OUTLINES. NO STROKES. Clean geometric shapes. Solid, flat colors. Minimalist. Natural colors. Wide angle landscape. Full bleed. NO TEXT."

ACCURACY REQUIREMENTS:
The image must resemble the real location as closely as possible within the constraints of the flat-vector style. 
- Use geometric, minimalist descriptors (e.g., "blocky ridges", "layered plateaus", "smooth curves", "flat color fields").
- Colors must be flat and minimalist but reflect true environmental tones.
- Do not invent terrain or landmarks.

CRITICAL: 
- FULL BLEED IMAGE. 
- ABSOLUTELY NO WHITE SPACE. 
- NO WHITE BORDERS OR FRAMES.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }]
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            // 4. Save to Cache for next time
            saveToCache(keyword, base64Image);
            return base64Image;
          }
        }
      } catch (e: any) {
        console.error("AI Image Generation failed:", e);
        // Check for Quota Exceeded (429) and enable circuit breaker
        if (e.message?.includes('429') || e.status === 429 || e.toString().includes('429') || e.toString().includes('quota')) {
             console.warn("Gemini API Quota Exceeded. Disabling AI generation for this session.");
             isRateLimited = true;
        }
      }
  }

  // 5. Generic Fallbacks (if everything else fails or rate limited)
  const genericLandscapes = [
     "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80", // Hills
     "https://images.unsplash.com/photo-1501854140884-074bf86ed91c?auto=format&fit=crop&w=1600&q=80", // Lake
     "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80", // Forest
     "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80", // Foggy
  ];
  
  const genericLandmarks = [
      "https://images.unsplash.com/photo-1565620731358-e8c038abc8d1?auto=format&fit=crop&w=1600&q=80", // Abstract Building
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80", // Resort
      "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=1600&q=80", // Flags
  ];

  const pool = type === 'landscape' ? genericLandscapes : genericLandmarks;
  const index = keyword.length % pool.length;
  
  return pool[index];
};

export const getCountryTour = async (countryName: string): Promise<TourData | null> => {
  // 1. Check for Static Handcrafted Data
  if (staticTours[countryName]) {
    await delay(600); // Simulate "loading" a rich experience
    return staticTours[countryName];
  }

  // 2. Procedural Fallback Generator (No AI)
  // This ensures EVERY country works immediately without manual writing for 195 nations.
  const country = MOCK_COUNTRIES.find(c => c.name === countryName);
  if (!country) return null;

  await delay(800); // Simulate processing

  return {
      tourTitle: `Journey to ${country.name}`,
      introText: `${country.description} Join us as we explore the heart of this ${country.region} nation, learning about its capital, ${country.capital}, and its unique place in the world.`,
      stops: [
        {
          stopName: country.capital,
          imageKeyword: `${country.name} City`,
          description: [
             `Welcome to ${country.capital}, the bustling capital of ${country.name}. It serves as the political and cultural center of the nation.`,
             `As the seat of government, this city helps shape the future of its ${country.population} citizens. It's a place where history meets modern life.`,
             `Did you know? Capitals are often chosen for their strategic location near water or trade routes!`,
             `Take a moment to imagine the sounds of the local markets and the flow of daily life in this vibrant city.`
          ],
          question: `What is the capital city of ${country.name}?`,
          options: [country.capital, "Paris", "Tokyo", "Brasilia"], 
          answer: country.capital,
          explanation: `${country.capital} is the official capital of ${country.name}.`
        },
        {
          stopName: `${country.region} Landscapes`,
          imageKeyword: `${country.region} Nature`,
          description: [
             `${country.name} is located in ${country.region}, a part of the world known for its distinct geography and climate.`,
             `From its total area of ${country.area} km², the land supports diverse ecosystems and wildlife unique to this part of the globe.`,
             `Fun Fact: ${country.name} uses the ${country.currency} as its currency, which is vital for its local economy.`,
             `As you travel through the countryside, you'll see why this nation is a key part of the ${country.region} continent.`
          ],
          question: `Which continent is ${country.name} located in?`,
          options: [country.region, "Antarctica", "Australia", "South America"],
          answer: country.region,
          explanation: `${country.name} is located in the continent of ${country.region}.`
        },
        {
          stopName: "Local Culture",
          imageKeyword: `${country.name} Culture`,
          description: [
             `The culture of ${country.name} is rich and vibrant, influenced by its history and neighbors.`,
             `People here speak ${country.languages.join(", ")}, which connects them to their heritage and to each other.`,
             `Did you know? Language is one of the most important parts of a country's identity, preserving stories from generation to generation.`,
             `Imagine the sounds of traditional music and the smell of local dishes filling the air.`
          ],
          question: `What is a primary language spoken in ${country.name}?`,
          options: [country.languages[0], "Klingon", "Latin", "Esperanto"],
          answer: country.languages[0],
          explanation: `${country.languages[0]} is one of the main languages spoken in ${country.name}.`
        },
        {
          stopName: "Historic Landmarks",
          imageKeyword: `${country.name} Landmark`,
          description: [
             `Every country has landmarks that tell the story of its past. ${country.name} is no different.`,
             `From ancient structures to modern marvels, the architecture here reflects the ingenuity of its people.`,
             `Fun Fact: Many historic sites are protected to ensure future generations can learn from them.`,
             `Standing before these monuments, you can feel the weight of history and the passage of time.`
          ],
          question: `Does ${country.name} have historic landmarks?`,
          options: ["Yes", "No", "Maybe", "Only one"],
          answer: "Yes",
          explanation: `Like all nations, ${country.name} has landmarks that are significant to its history and culture.`
        },
        {
          stopName: "Natural Wonders",
          imageKeyword: `${country.name} Landscape`,
          description: [
             `Beyond the cities, ${country.name} is home to breathtaking natural beauty.`,
             `Whether it's mountains, rivers, or coastlines, the diverse environment supports a variety of plants and animals.`,
             `Did you know? Protecting nature is essential for maintaining the balance of our planet's ecosystems.`,
             `Take a deep breath and imagine the fresh air and stunning views of the ${country.name} wilderness.`
          ],
          question: `What is a key feature of ${country.name}'s geography?`,
          options: ["Its natural landscapes", "It has no land", "It is entirely underwater", "It is in space"],
          answer: "Its natural landscapes",
          explanation: `${country.name} is defined by its physical geography, including its land, water, and ecosystems.`
        }
      ]
  };
};
