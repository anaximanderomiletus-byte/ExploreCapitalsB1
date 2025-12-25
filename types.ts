
export interface Country {
  id: string;
  name: string;
  capital: string;
  population: string;
  region: string;
  flag: string; // Emoji or URL
  lat: number;
  lng: number;
  description: string;
  area: string;       // e.g. "652 K km²"
  currency: string;   // e.g. "Afghan afghani"
  languages: string[]; // e.g. ["Pashto", "Dari"]
  borders?: string[]; // Array of bordering country names
  gdp?: string;       // e.g. "$20.1 Billion"
  timeZone?: string;  // e.g. "UTC +4:30"
  callingCode?: string; // e.g. "+93"
  driveSide?: string;  // e.g. "Right"
  alsoKnownAs?: string[]; // Array of alternative names
}

export interface Territory extends Country {
  sovereignty: string; // The sovereign state claiming the territory
}

export interface Game {
  id: string;
  title: string;
  image: string;
  status: 'active' | 'coming_soon';
  description: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface TourStop {
  stopName: string;
  imageKeyword: string;
  description: string[]; // Changed to array for strict paragraph separation
  question: string;
  options: string[];
  answer: string;
  explanation?: string; // Additional context for the answer
}

export interface TourData {
  tourTitle: string;
  introText: string;
  stops: TourStop[];
}
