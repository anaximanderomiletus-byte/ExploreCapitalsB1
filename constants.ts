import { Country, Game } from './types';

export const MOCK_COUNTRIES: Country[] = [
  { id: '1', name: 'Afghanistan', capital: 'Kabul', population: '41.1M', region: 'Asia', flag: '🇦🇫', lat: 34.5553, lng: 69.2075, description: 'A landlocked country located at the crossroads of Central and South Asia, known for its rugged mountains and rich history.', area: '652K', currency: 'Afghan afghani', languages: ['Pashto', 'Dari'], borders: ['Iran', 'Pakistan', 'Turkmenistan', 'Uzbekistan', 'Tajikistan', 'China'], gdp: '$20.1B', timeZone: 'UTC+4:30', callingCode: '+93', driveSide: 'Right' },
  { id: '2', name: 'Albania', capital: 'Tirana', population: '2.8M', region: 'Europe', flag: '🇦🇱', lat: 41.3275, lng: 19.8187, description: 'A country in Southeastern Europe on the Adriatic and Ionian Sea, featuring ancient castles and the Albanian Alps.', area: '28.7K', currency: 'Albanian lek', languages: ['Albanian'], borders: ['Montenegro', 'Kosovo', 'North Macedonia', 'Greece'], gdp: '$18.3B', timeZone: 'UTC+1', callingCode: '+355', driveSide: 'Right' },
  { id: '3', name: 'Algeria', capital: 'Algiers', population: '44.9M', region: 'Africa', flag: '🇩🇿', lat: 36.7538, lng: 3.0588, description: 'The largest country in Africa, featuring a Mediterranean coastline and the vast interior of the Sahara desert.', area: '2.38M', currency: 'Algerian dinar', languages: ['Arabic', 'Berber'], borders: ['Tunisia', 'Libya', 'Niger', 'Mali', 'Mauritania', 'Morocco'], gdp: '$191.9B', timeZone: 'UTC+1', callingCode: '+213', driveSide: 'Right' },
  { id: '7', name: 'Argentina', capital: 'Buenos Aires', population: '46.2M', region: 'South America', flag: '🇦🇷', lat: -34.6037, lng: -58.3816, description: 'A massive South American nation with terrain encompassing Andes mountains, glacial lakes, and Pampas grassland.', area: '2.78M', currency: 'Argentine peso', languages: ['Spanish'], borders: ['Chile', 'Bolivia', 'Paraguay', 'Brazil', 'Uruguay'], gdp: '$632.7B', timeZone: 'UTC-3', callingCode: '+54', driveSide: 'Right' },
  { id: '9', name: 'Australia', capital: 'Canberra', population: '26.0M', region: 'Oceania', flag: '🇦🇺', lat: -35.2809, lng: 149.1300, description: 'The largest country in Oceania, comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands.', area: '7.69M', currency: 'Australian dollar', languages: ['English'], borders: [], gdp: '$1.7T', timeZone: 'UTC+8 to +11', callingCode: '+61', driveSide: 'Left' },
  { id: '10', name: 'Austria', capital: 'Vienna', population: '9.0M', region: 'Europe', flag: '🇦🇹', lat: 48.2082, lng: 16.3738, description: 'A landlocked East Alpine country in the southern part of Central Europe, famous for its musical history and baroque architecture.', area: '83.8K', currency: 'Euro', languages: ['German'], borders: ['Germany', 'Czechia', 'Slovakia', 'Hungary', 'Slovenia', 'Italy', 'Switzerland', 'Liechtenstein'], gdp: '$471.4B', timeZone: 'UTC+1', callingCode: '+43', driveSide: 'Right' },
  { id: '17', name: 'Belgium', capital: 'Brussels', population: '11.7M', region: 'Europe', flag: '🇧🇪', lat: 50.8503, lng: 4.3517, description: 'A country in Western Europe known for medieval towns, Renaissance architecture, and being the headquarters of the EU.', area: '30.5K', currency: 'Euro', languages: ['Dutch', 'French', 'German'], borders: ['France', 'Germany', 'Luxembourg', 'Netherlands'], gdp: '$578.6B', timeZone: 'UTC+1', callingCode: '+32', driveSide: 'Right' },
  { id: '24', name: 'Brazil', capital: 'Brasília', population: '215.3M', region: 'South America', flag: '🇧🇷', lat: -15.7975, lng: -47.8919, description: 'The largest country in South America, home to the Amazon Rainforest and the vibrant city of Rio de Janeiro.', area: '8.51M', currency: 'Brazilian real', languages: ['Portuguese'], borders: ['Argentina', 'Bolivia', 'Colombia', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'], gdp: '$1.9T', timeZone: 'UTC-2 to -5', callingCode: '+55', driveSide: 'Right' },
  { id: '32', name: 'Canada', capital: 'Ottawa', population: '38.9M', region: 'North America', flag: '🇨🇦', lat: 45.4215, lng: -75.6972, description: 'A vast North American nation with diverse landscapes ranging from the Arctic tundra to the Rocky Mountains and temperate rainforests.', area: '9.98M', currency: 'Canadian dollar', languages: ['English', 'French'], borders: ['United States'], gdp: '$2.1T', timeZone: 'UTC-3.5 to -8', callingCode: '+1', driveSide: 'Right' },
  { id: '36', name: 'China', capital: 'Beijing', population: '1.42B', region: 'Asia', flag: '🇨🇳', lat: 39.9042, lng: 116.4074, description: 'One of the world\'s oldest civilizations, known for its diverse terrain, ancient history, and rapid modern development.', area: '9.60M', currency: 'Renminbi', languages: ['Mandarin'], borders: ['Mongolia', 'Russia', 'North Korea', 'Vietnam', 'Laos', 'Myanmar', 'India', 'Bhutan', 'Nepal', 'Pakistan', 'Afghanistan', 'Tajikistan', 'Kyrgyzstan', 'Kazakhstan'], gdp: '$17.9T', timeZone: 'UTC+8', callingCode: '+86', driveSide: 'Right' },
  { id: '52', name: 'Egypt', capital: 'Cairo', population: '111.0M', region: 'Africa', flag: '🇪🇬', lat: 30.0444, lng: 31.2357, description: 'A transcontinental country linking Africa and Asia, famous for its ancient civilization and monuments like the Pyramids.', area: '1.00M', currency: 'Egyptian pound', languages: ['Arabic'], borders: ['Libya', 'Sudan', 'Israel', 'Palestine'], gdp: '$476.7B', timeZone: 'UTC+3', callingCode: '+20', driveSide: 'Right' },
  { id: '61', name: 'France', capital: 'Paris', population: '68.0M', region: 'Europe', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, description: 'A country in Western Europe, encompassing medieval cities, alpine villages, and Mediterranean beaches, famous for its cuisine.', area: '643.8K', currency: 'Euro', languages: ['French'], borders: ['Belgium', 'Luxembourg', 'Germany', 'Switzerland', 'Italy', 'Monaco', 'Spain', 'Andorra'], gdp: '$2.8T', timeZone: 'UTC+1', callingCode: '+33', driveSide: 'Right' },
  { id: '65', name: 'Germany', capital: 'Berlin', population: '83.3M', region: 'Europe', flag: '🇩🇪', lat: 52.5200, lng: 13.4050, description: 'A Western European country with a landscape of forests, rivers, mountain ranges, and North Sea beaches.', area: '357.5K', currency: 'Euro', languages: ['German'], borders: ['Denmark', 'Poland', 'Czechia', 'Austria', 'Switzerland', 'France', 'Luxembourg', 'Belgium', 'Netherlands'], gdp: '$4.1T', timeZone: 'UTC+1', callingCode: '+49', driveSide: 'Right' },
  { id: '67', name: 'Greece', capital: 'Athens', population: '10.4M', region: 'Europe', flag: '🇬🇷', lat: 37.9838, lng: 23.7275, description: 'A country in southeastern Europe with thousands of islands, considered the cradle of Western civilization.', area: '131.9K', currency: 'Euro', languages: ['Greek'], borders: ['Albania', 'North Macedonia', 'Bulgaria', 'Turkey'], gdp: '$219.1B', timeZone: 'UTC+2', callingCode: '+30', driveSide: 'Right' },
  { id: '77', name: 'India', capital: 'New Delhi', population: '1.42B', region: 'Asia', flag: '🇮🇳', lat: 28.6139, lng: 77.2090, description: 'A massive country in South Asia with diverse terrain, from Himalayan peaks to Indian Ocean coastline.', area: '3.28M', currency: 'Indian rupee', languages: ['Hindi', 'English'], borders: ['Pakistan', 'China', 'Nepal', 'Bhutan', 'Myanmar', 'Bangladesh'], gdp: '$3.4T', timeZone: 'UTC+5:30', callingCode: '+91', driveSide: 'Left' },
  { id: '85', name: 'Japan', capital: 'Tokyo', population: '123.9M', region: 'Asia', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, description: 'An island country in East Asia, known for its skyscrapers, imperial palaces, national parks, and shrines.', area: '377.9K', currency: 'Japanese yen', languages: ['Japanese'], borders: [], gdp: '$4.2T', timeZone: 'UTC+9', callingCode: '+81', driveSide: 'Left' },
  { id: '110', name: 'Mexico', capital: 'Mexico City', population: '127.5M', region: 'North America', flag: '🇲🇽', lat: 19.4326, lng: -99.1332, description: 'A country in the southern portion of North America, known for its Pacific and Gulf of Mexico beaches and diverse landscape.', area: '1.96M', currency: 'Mexican peso', languages: ['Spanish'], borders: ['United States', 'Guatemala', 'Belize'], gdp: '$1.4T', timeZone: 'UTC-5 to -8', callingCode: '+52', driveSide: 'Right' },
  { id: '161', name: 'South Africa', capital: 'Pretoria', population: '59.9M', region: 'Africa', flag: '🇿🇦', lat: -25.7479, lng: 28.2293, description: 'A country on the southernmost tip of the African continent, marked by several distinct ecosystems.', area: '1.22M', currency: 'South African rand', languages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'], borders: ['Namibia', 'Botswana', 'Zimbabwe', 'Mozambique', 'Eswatini', 'Lesotho'], gdp: '$405.9B', timeZone: 'UTC+2', callingCode: '+27', driveSide: 'Left' },
  { id: '162', name: 'South Korea', capital: 'Seoul', population: '51.6M', region: 'Asia', flag: '🇰🇷', lat: 37.5665, lng: 126.9780, description: 'An East Asian nation on the southern half of the Korean Peninsula, known for its green, hilly countryside and and high-tech cities.', area: '100.2K', currency: 'South Korean won', languages: ['Korean'], borders: ['North Korea'], gdp: '$1.7T', timeZone: 'UTC+9', callingCode: '+82', driveSide: 'Right' },
  { id: '164', name: 'Spain', capital: 'Madrid', population: '47.6M', region: 'Europe', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, description: 'A vibrant European nation on the Iberian Peninsula, famous for its art history, diverse regional cultures, and Mediterranean coastline.', area: '505.9K', currency: 'Euro', languages: ['Spanish'], borders: ['France', 'Portugal', 'Andorra', 'Morocco', 'Gibraltar'], gdp: '$1.4T', timeZone: 'UTC+1', callingCode: '+34', driveSide: 'Right' },
  { id: '169', name: 'Switzerland', capital: 'Bern', population: '8.7M', region: 'Europe', flag: '🇨🇭', lat: 46.9480, lng: 7.4474, description: 'A mountainous Central European country, home to numerous lakes, villages, and the high peaks of the Alps.', area: '41.2K', currency: 'Swiss franc', languages: ['German', 'French', 'Italian'], borders: ['Germany', 'France', 'Italy', 'Austria', 'Liechtenstein'], gdp: '$807.7B', timeZone: 'UTC+1', callingCode: '+41', driveSide: 'Right' },
  { id: '173', name: 'Thailand', capital: 'Bangkok', population: '71.7M', region: 'Asia', flag: '🇹🇭', lat: 13.7563, lng: 100.5018, description: 'A Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples.', area: '513.1K', currency: 'Baht', languages: ['Thai'], borders: ['Myanmar', 'Laos', 'Cambodia', 'Malaysia'], gdp: '$495.2B', timeZone: 'UTC+7', callingCode: '+66', driveSide: 'Left' },
  { id: '179', name: 'Turkey', capital: 'Ankara', population: '85.3M', region: 'Asia', flag: '🇹🇷', lat: 39.9334, lng: 32.8597, description: 'A transcontinental country located mainly on the Anatolian Peninsula in Western Asia, with a small portion on the Balkan Peninsula.', area: '783.5K', currency: 'Turkish lira', languages: ['Turkish'], borders: ['Greece', 'Bulgaria', 'Georgia', 'Armenia', 'Azerbaijan', 'Iran', 'Iraq', 'Syria'], gdp: '$906B', timeZone: 'UTC+3', callingCode: '+90', driveSide: 'Right' },
  { id: '185', name: 'United Kingdom', capital: 'London', population: '67.5M', region: 'Europe', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, description: 'An island nation in northwestern Europe comprising England, Scotland, Wales, and Northern Ireland, known for its global historical influence.', area: '242.4K', currency: 'Pound sterling', languages: ['English'], borders: ['Ireland'], gdp: '$3.1T', timeZone: 'UTC+0', callingCode: '+44', driveSide: 'Left' },
  { id: '186', name: 'United States', capital: 'Washington, D.C.', population: '333.3M', region: 'North America', flag: '🇺🇸', lat: 38.9072, lng: -77.0369, description: 'A federal republic of 50 states spanning North America, known for its cultural impact and diverse geography from coast to coast.', area: '9.83M', currency: 'United States dollar', languages: ['English'], borders: ['Canada', 'Mexico'], gdp: '$25.5T', timeZone: 'UTC-5 to -10', callingCode: '+1', driveSide: 'Right' },
  
  // Additional Neighbors to support Afghanistan & common paths
  { id: '78', name: 'Iran', capital: 'Tehran', population: '88.5M', region: 'Asia', flag: '🇮🇷', lat: 35.6892, lng: 51.3890, description: 'Home to one of the world\'s oldest civilizations, with a rich landscape of deserts, mountains, and ancient Persian history.', area: '1.64M', currency: 'Iranian rial', languages: ['Persian'], borders: ['Iraq', 'Turkey', 'Armenia', 'Azerbaijan', 'Turkmenistan', 'Afghanistan', 'Pakistan'], gdp: '$1.5T', timeZone: 'UTC+3:30', callingCode: '+98', driveSide: 'Right' },
  { id: '128', name: 'Pakistan', capital: 'Islamabad', population: '235.8M', region: 'Asia', flag: '🇵🇰', lat: 33.6844, lng: 73.0479, description: 'A South Asian nation featuring diverse landscapes from the Arabian Sea to the peaks of the Karakoram and Himalayas.', area: '796K', currency: 'Pakistani rupee', languages: ['Urdu', 'English'], borders: ['Iran', 'Afghanistan', 'China', 'India'], gdp: '$376B', timeZone: 'UTC+5', callingCode: '+92', driveSide: 'Left' },
  { id: '178', name: 'Turkmenistan', capital: 'Ashgabat', population: '6.4M', region: 'Asia', flag: '🇹🇲', lat: 37.9601, lng: 58.3261, description: 'A Central Asian nation known for its vast Karakum Desert, ancient Silk Road ruins, and the Door to Hell gas crater.', area: '488K', currency: 'Turkmenistan manat', languages: ['Turkmen'], borders: ['Kazakhstan', 'Uzbekistan', 'Afghanistan', 'Iran'], gdp: '$45B', timeZone: 'UTC+5', callingCode: '+993', driveSide: 'Right' },
  { id: '188', name: 'Uzbekistan', capital: 'Tashkent', population: '36M', region: 'Asia', flag: '🇺🇿', lat: 41.2995, lng: 69.2401, description: 'A Central Asian country famous for its Silk Road architecture and the majestic cities of Samarkand and Bukhara.', area: '448K', currency: 'Uzbekistani som', languages: ['Uzbek'], borders: ['Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Afghanistan', 'Turkmenistan'], gdp: '$80B', timeZone: 'UTC+5', callingCode: '+998', driveSide: 'Right' },
  { id: '172', name: 'Tajikistan', capital: 'Dushanbe', population: '10M', region: 'Asia', flag: '🇹🇯', lat: 38.5358, lng: 68.7791, description: 'A mountainous landlocked country in Central Asia, dominated by the majestic Pamir and Fann mountain ranges.', area: '143K', currency: 'Somoni', languages: ['Tajik'], borders: ['Afghanistan', 'China', 'Kyrgyzstan', 'Uzbekistan'], gdp: '$10B', timeZone: 'UTC+5', callingCode: '+992', driveSide: 'Right' },
  { id: '25', name: 'Bolivia', capital: 'Sucre', population: '12.2M', region: 'South America', flag: '🇧🇴', lat: -16.2902, lng: -63.5887, description: 'A diverse nation in central South America, home to the Andes mountains, the Atacama Desert, and the Amazon Basin.', area: '1.1M', currency: 'Boliviano', languages: ['Spanish', 'Quechua', 'Aymara'], borders: ['Brazil', 'Paraguay', 'Argentina', 'Chile', 'Peru'], gdp: '$43B', timeZone: 'UTC-4', callingCode: '+591', driveSide: 'Right' },
  { id: '35', name: 'Colombia', capital: 'Bogotá', population: '51.8M', region: 'South America', flag: '🇨🇴', lat: 4.5709, lng: -74.2973, description: 'A country at the northern tip of South America with diverse landscapes of rainforests, mountains, and coffee plantations.', area: '1.14M', currency: 'Colombian peso', languages: ['Spanish'], borders: ['Panama', 'Venezuela', 'Brazil', 'Peru', 'Ecuador'], gdp: '$342B', timeZone: 'UTC-5', callingCode: '+57', driveSide: 'Right' },
  { id: '68', name: 'Guyana', capital: 'Georgetown', population: '0.8M', region: 'South America', flag: '🇬🇾', lat: 4.8604, lng: -58.9302, description: 'A North Atlantic coast nation in South America, covered in dense tropical rainforest and famous for Kaieteur Falls.', area: '215K', currency: 'Guyanese dollar', languages: ['English'], borders: ['Venezuela', 'Brazil', 'Suriname'], gdp: '$14B', timeZone: 'UTC-4', callingCode: '+592', driveSide: 'Left' },
  { id: '129', name: 'Paraguay', capital: 'Asunción', population: '6.7M', region: 'South America', flag: '🇵🇾', lat: -23.4425, lng: -58.4438, description: 'A landlocked country between Argentina, Brazil, and Bolivia, home to large swaths of swampland and scrub forest.', area: '406K', currency: 'Guaraní', languages: ['Spanish', 'Guaraní'], borders: ['Argentina', 'Brazil', 'Bolivia'], gdp: '$41B', timeZone: 'UTC-4', callingCode: '+595', driveSide: 'Right' },
  { id: '130', name: 'Peru', capital: 'Lima', population: '34M', region: 'South America', flag: '🇵🇪', lat: -9.1900, lng: -75.0152, description: 'A South American country home to a section of Amazon rainforest and Machu Picchu, an ancient Incan city high in the Andes.', area: '1.28M', currency: 'Sol', languages: ['Spanish'], borders: ['Ecuador', 'Colombia', 'Brazil', 'Bolivia', 'Chile'], gdp: '$242B', timeZone: 'UTC-5', callingCode: '+51', driveSide: 'Right' },
  { id: '163', name: 'Suriname', capital: 'Paramaribo', population: '0.6M', region: 'South America', flag: '🇸🇷', lat: 3.9193, lng: -56.0278, description: 'The smallest sovereign state in South America, known for its Dutch colonial architecture and pristine rainforest.', area: '163K', currency: 'Surinamese dollar', languages: ['Dutch'], borders: ['French Guiana', 'Guyana', 'Brazil'], gdp: '$3B', timeZone: 'UTC-3', callingCode: '+597', driveSide: 'Left' },
  { id: '187', name: 'Uruguay', capital: 'Montevideo', population: '3.4M', region: 'South America', flag: '🇺🇾', lat: -32.5228, lng: -55.7658, description: 'A South American nation known for its verdant interior and beach-lined coast, with high standards of living and social rights.', area: '176K', currency: 'Uruguayan peso', languages: ['Spanish'], borders: ['Argentina', 'Brazil'], gdp: '$71B', timeZone: 'UTC-3', callingCode: '+598', driveSide: 'Right' },
  { id: '194', name: 'Venezuela', capital: 'Caracas', population: '28M', region: 'South America', flag: '🇻🇪', lat: 6.4238, lng: -66.5897, description: 'A country on the northern coast of South America with diverse natural attractions, including the Andes and Angel Falls.', area: '916K', currency: 'Bolívar', languages: ['Spanish'], borders: ['Colombia', 'Brazil', 'Guyana'], gdp: '$90B', timeZone: 'UTC-4', callingCode: '+58', driveSide: 'Right' },
];

export const GAMES: Game[] = [
  { 
    id: '1', 
    title: 'Capital Quiz', 
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/capital-quiz.png', 
    status: 'active', 
    description: 'Test your knowledge against the clock.' 
  },
  { 
    id: '2', 
    title: 'Map Dash', 
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/map-dash.png', 
    status: 'active', 
    description: 'Find the country before time runs out.' 
  },
  { 
    id: '3', 
    title: 'Flag Frenzy', 
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/flag-frenzy.png', 
    status: 'active', 
    description: 'Match the flags to their nations.' 
  },
  {
    id: '4',
    title: 'Know Your Neighbor',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/know-your-neighbor.png',
    status: 'active',
    description: 'Identify all the bordering countries.'
  },
  {
    id: '5',
    title: 'Population Pursuit',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/population-pursuit.png',
    status: 'active',
    description: 'Which country has more people?'
  },
  {
    id: '6',
    title: 'Global Detective',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/global-detective.png',
    status: 'active',
    description: 'Deduce the mystery country from 3 clues.'
  },
  {
    id: '7',
    title: 'Capital Connection',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/capital-connection.png',
    status: 'active',
    description: 'Match countries to their capitals in a race against time.'
  },
  {
    id: '8',
    title: 'Region Roundup',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/region-roundup.png',
    status: 'active',
    description: 'Sort countries into their correct continents.'
  },
  {
    id: '9',
    title: 'Landmark Legend',
    image: 'https://anaximanderomiletus-byte.github.io/Explore-Capitals-PNGs/0-GAMES/landmark-legend.png',
    status: 'active',
    description: 'Identify the country from a famous landmark image.'
  }
];
