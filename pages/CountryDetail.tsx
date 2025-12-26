
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Map, Compass, Navigation, Scroll, MapPin, 
  Clock, Phone, Car, Users, Maximize2, Banknote, 
  TrendingUp, Languages, Building2, Globe, AlertTriangle
} from 'lucide-react';
import { MOCK_COUNTRIES, TERRITORIES, DE_FACTO_COUNTRIES } from '../constants';
import { STATIC_IMAGES } from '../data/images';
import { staticTours } from '../data/staticTours';
import { OFFICIAL_NAMES } from '../data/officialNames';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const FALLBACK_SCENES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
];

const CountryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageLoading, setTransitionStyle } = useLayout();
  
  const country = useMemo(() => MOCK_COUNTRIES.find(c => c.id === id) || TERRITORIES.find(t => t.id === id) || DE_FACTO_COUNTRIES.find(d => d.id === id), [id]);
  const isTerritory = useMemo(() => TERRITORIES.some(t => t.id === id), [id]);
  const isDeFacto = useMemo(() => DE_FACTO_COUNTRIES.some(d => d.id === id), [id]);

  const controlledTerritories = useMemo(() => {
    if (!country || isTerritory || isDeFacto) return [];
    return TERRITORIES.filter(t => t.sovereignty === country.name).sort((a, b) => a.name.localeCompare(b.name));
  }, [country, isTerritory, isDeFacto]);

  // Determine scenic image and caption for the secondary card
  const scenicData = useMemo(() => {
      if (!country) return { image: '', caption: '' };
      
      // 1. Try Country Main Image (Usually Capital or Iconic)
      if (STATIC_IMAGES[country.name]) {
          return { image: STATIC_IMAGES[country.name], caption: `${country.capital}, ${country.name}` };
      }

      // 2. Try Tour Stop Image
      const tourData = staticTours[country.name];
      if (tourData && tourData.stops.length > 0) {
          const stop = tourData.stops[0];
          const img = STATIC_IMAGES[stop.imageKeyword || stop.stopName];
          if (img) return { image: img, caption: `${stop.stopName}, ${country.name}` };
      }

      // 3. Fallback
      const idx = (country.id.charCodeAt(0) + country.name.length) % FALLBACK_SCENES.length;
      return { image: FALLBACK_SCENES[idx], caption: `${country.capital}, ${country.name}` };
  }, [country]);

  useEffect(() => {
    setPageLoading(false);
  }, [setPageLoading, id]);

  if (!country) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-text">Location not found.</h2>
        <Link to="/directory" className="text-primary hover:underline mt-4 inline-block">Back to Directory</Link>
      </div>
    );
  }

  // Helper to find country ID by name for bordering nations
  const getCountryIdByName = (name: string) => {
    return MOCK_COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase())?.id 
        || DE_FACTO_COUNTRIES.find(d => d.name.toLowerCase() === name.toLowerCase())?.id;
  };

  const handleNeighborClick = (neighborName: string) => {
    const neighborId = getCountryIdByName(neighborName);
    if (neighborId) {
      setTransitionStyle('cartographic');
      navigate(`/country/${neighborId}`);
    } else {
      setTransitionStyle('default');
      navigate(`/directory?search=${neighborName}`);
    }
  };

  const handleTerritoryClick = (territoryId: string) => {
    setTransitionStyle('cartographic');
    navigate(`/country/${territoryId}`);
  };

  const handleSovereigntyClick = (sovereigntyName: string) => {
    if (sovereigntyName === 'Disputed' || sovereigntyName === 'Limited Recognition') return;
    
    const sovereignId = getCountryIdByName(sovereigntyName);
    if (sovereignId) {
      setTransitionStyle('cartographic');
      navigate(`/country/${sovereignId}`);
    } else {
      setTransitionStyle('default');
      navigate(`/directory?search=${sovereigntyName}`);
    }
  };

  // Calculate ISO code for the flag image
  const countryCode = Array.from(country.flag)
    .map((char: any) => String.fromCharCode(char.codePointAt(0)! - 127397).toLowerCase())
    .join('');

  const officialName = OFFICIAL_NAMES[country.name] || country.name;

  // Filter aliases to exclude the official name and the standard country name to avoid redundancy
  const filteredAliases = country.alsoKnownAs?.filter(alias => 
    alias !== officialName && alias !== country.name
  );

  // Reusable Stat Component for the card
  const StatItem = ({ label, value, icon: Icon }: { label: string, value: string | React.ReactNode, icon: any }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
          <Icon size={14} />
        </div>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="text-lg md:text-xl font-display font-bold text-gray-700 leading-tight pl-0.5">{value}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-surface pt-24 pb-12 px-4 md:px-8 relative overflow-hidden text-text">
      <SEO 
        title={`${country.name} - ${isTerritory ? 'Territory' : isDeFacto ? 'State' : 'Country'} Profile`} 
        description={`Explore detailed demographics, history, and travel insights for ${country.name}. Start your virtual expedition to its capital, ${country.capital}.`} 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation / Header Area */}
        <div className="mb-10 flex items-center justify-between">
            <button 
                onClick={() => navigate('/directory')}
                className="group flex items-center gap-2 text-gray-500 hover:text-text transition-colors font-display font-bold text-sm"
            >
                <div className="p-2 bg-gray-200/50 rounded-full group-hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={18} className="text-text" />
                </div>
                Back to Directory
            </button>
            <div className="flex items-center gap-4">
                 <Link to={`/map?country=${country.id}`} className="p-2 bg-gray-200/50 text-text rounded-lg hover:bg-gray-200 transition-colors" title="Locate on World Map">
                    <Map size={24} className="text-text" />
                 </Link>
            </div>
        </div>

        {/* --- TRAVELER'S DESK LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* 1. The "Postcard": Flag & Primary Info */}
            {/* On Desktop: Top Left (col-span-5). On Mobile: First Item. */}
            <div className="lg:col-span-5 lg:row-start-1">
                <div className="bg-[#FAF9F6] p-4 shadow-premium-hover rounded-sm transform -rotate-1 hover:rotate-0 transition-transform duration-500 border border-gray-200">
                    <div className="border-[12px] border-white shadow-inner bg-gray-50 flex items-center justify-center h-64 md:h-80 overflow-hidden relative group">
                        <img 
                            src={`https://flagcdn.com/w640/${countryCode}.png`}
                            alt={`${country.name} Flag`}
                            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 rotate-12 bg-white/90 p-2 shadow-md border border-gray-100 flex flex-col items-center">
                             <div className="w-8 h-8 rounded-full border-2 border-primary/20 flex items-center justify-center text-[10px] font-black text-primary">LV</div>
                             <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase text-center leading-none">Stampe</div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between items-end px-2">
                        <div>
                            <h1 className="text-4xl font-display font-black text-gray-800 tracking-tighter uppercase">{country.name}</h1>
                            <div className="flex flex-col gap-1 mt-1">
                                <p className="text-primary font-bold tracking-widest text-xs uppercase flex items-center gap-1">
                                    <MapPin size={12} /> {country.region}
                                </p>
                                {isTerritory && (
                                   <div className="text-green-600 font-bold tracking-widest text-[10px] uppercase flex items-center gap-1">
                                       <Globe size={10} /> Territory of 
                                       <button 
                                           onClick={() => handleSovereigntyClick((country as any).sovereignty)}
                                           className="hover:underline decoration-green-600 underline-offset-2 transition-all cursor-pointer focus:outline-none uppercase"
                                           disabled={(country as any).sovereignty === 'Disputed'}
                                       >
                                           {(country as any).sovereignty}
                                       </button>
                                   </div>
                                )}
                                {isDeFacto && (
                                    <div className="text-yellow-600 font-bold tracking-widest text-[10px] uppercase flex items-center gap-1">
                                        <AlertTriangle size={10} /> {(country as any).sovereignty || 'Limited Recognition'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-4xl grayscale opacity-50 select-none" role="img" aria-label="flag icon">{country.flag}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. The "Field Notes": Official Profile & Integrated Coordinates */}
            {/* On Desktop: Right Column (col-span-7) spanning 2 rows. On Mobile: Second Item (Order 2). */}
            <div className="lg:col-span-7 lg:row-start-1 lg:row-span-2">
                <div className="bg-[#fdf6e3] p-6 md:p-10 lg:p-12 shadow-premium rounded-[2.5rem] border border-gray-200/50 relative h-full flex flex-col overflow-hidden">
                     <div className="absolute top-8 right-8">
                        <Scroll className="text-primary/10 w-16 h-16" />
                     </div>
                     
                     <header className="mb-8 pb-6 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3 mb-5">
                            <Compass className="text-primary" size={28} />
                            <h3 className="font-display font-black text-2xl text-gray-800 uppercase tracking-tight">Official Profile</h3>
                        </div>
                        
                        <div className="space-y-2 pl-1">
                            <div>
                                <span className="font-display font-bold text-lg text-gray-800 leading-tight">{officialName}</span>
                            </div>
                            
                            {filteredAliases && filteredAliases.length > 0 && (
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] min-w-[160px]">Also Known As:</span>
                                    <span className="font-serif italic text-gray-600 text-base">{filteredAliases.join(', ')}</span>
                                </div>
                            )}
                        </div>
                     </header>
                     
                     {/* Refined Stats Grid */}
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 mb-10 shrink-0">
                        <StatItem label="Capital" value={country.capital} icon={Building2} />
                        <StatItem label="Population" value={country.population} icon={Users} />
                        <StatItem label="Land Area" value={`${country.area} km²`} icon={Maximize2} />
                        <StatItem label="Currency" value={country.currency} icon={Banknote} />
                        <StatItem label="GDP (Nominal)" value={country.gdp || 'N/A'} icon={TrendingUp} />
                        <StatItem label="Time Zone" value={country.timeZone || 'N/A'} icon={Clock} />
                        <StatItem label="Calling Code" value={country.callingCode || 'N/A'} icon={Phone} />
                        <StatItem label="Road Traffic" value={`${country.driveSide || 'Right'}-hand`} icon={Car} />
                     </div>

                     <div className="mb-8 p-4 bg-white/40 rounded-2xl border border-white/60">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <Languages size={12} /> Primary Languages
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {country.languages.map(lang => (
                                <span key={lang} className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 shadow-sm">{lang}</span>
                            ))}
                        </div>
                     </div>

                     <div className="mb-10 shrink-0">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Geographic Field Report</p>
                        <p className="font-serif text-lg leading-relaxed text-gray-600 italic">
                            "{country.description}"
                        </p>
                     </div>

                     {/* Borders */}
                     {country.borders && country.borders.length > 0 && (
                        <div className="mb-12 shrink-0">
                             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Bordering Nations</p>
                             <div className="flex flex-wrap gap-2">
                                {country.borders.map(border => (
                                    <button 
                                        key={border} 
                                        onClick={() => handleNeighborClick(border)}
                                        className="text-xs font-bold px-3 py-1.5 bg-white text-primary rounded-full border border-primary/20 shadow-sm hover:border-primary hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200"
                                    >
                                        {border}
                                    </button>
                                ))}
                             </div>
                        </div>
                     )}

                     {/* Territories */}
                     {controlledTerritories.length > 0 && (
                        <div className="mb-12 shrink-0">
                             <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-3">Territories</p>
                             <div className="flex flex-wrap gap-2">
                                {controlledTerritories.map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => handleTerritoryClick(t.id)}
                                        className="text-xs font-bold px-3 py-1.5 bg-white text-green-700 rounded-full border border-green-200 shadow-sm hover:border-green-600 hover:bg-green-50 hover:scale-105 active:scale-95 transition-all duration-200"
                                    >
                                        {t.name}
                                    </button>
                                ))}
                             </div>
                        </div>
                     )}

                     {!isTerritory && !isDeFacto ? (
                        <div className="pt-10 border-t border-gray-200 flex flex-col items-center gap-6 shrink-0 text-center">
                            <div className="space-y-4 max-w-xl">
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Begin a high-fidelity guided tour of {country.name}'s key geographic features, historical monuments, and landmarks.
                                </p>
                                <Link to={`/explore/${country.id}`} className="inline-block w-full sm:w-auto">
                                    <Button variant="primary" size="lg" className="w-full sm:w-auto group px-12 text-white">
                                        Start Expedition <Compass className="ml-2 group-hover:rotate-45 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                     ) : (
                         <div className="pt-10 border-t border-gray-200 flex flex-col items-center gap-4 shrink-0 text-center">
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                 Virtual expeditions are currently available for UN sovereign nations only.
                             </p>
                         </div>
                     )}

                     {/* White Coordinate Bubble & Map Link */}
                     <div className="mt-auto pt-16 flex flex-col items-center gap-6">
                        <div className="inline-flex flex-col items-center gap-2">
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Coordinates</div>
                             <div className="inline-flex items-center gap-6 px-8 py-4 bg-white text-text rounded-full shadow-premium-hover border-2 border-gray-100 ring-4 ring-primary/5 group hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-2">
                                     <Navigation size={18} className="rotate-45 text-primary opacity-80 group-hover:rotate-[225deg] transition-transform duration-700" />
                                     <div className="h-6 w-px bg-gray-200 mx-2"></div>
                                     <span className="font-display font-bold text-sm tracking-wider text-gray-500 tabular-nums">
                                        {Math.abs(country.lat).toFixed(4)}° {country.lat >= 0 ? 'N' : 'S'}
                                     </span>
                                  </div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-display font-bold text-sm tracking-wider text-gray-500 tabular-nums">
                                        {Math.abs(country.lng).toFixed(4)}° {country.lng >= 0 ? 'E' : 'W'}
                                     </span>
                                  </div>
                             </div>
                        </div>

                        <Link 
                            to={`/map?country=${country.id}`}
                            className="group flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                        >
                             <Map size={12} className="group-hover:scale-110 transition-transform" />
                             View on Map
                        </Link>
                     </div>

                </div>
            </div>

            {/* 3. Scenic Tour Image Card (Photograph Style) */}
            {/* On Desktop: Left Column (Row 2), underneath Flag. On Mobile: Third Item (below Field Notes). */}
            <div className="lg:col-span-5 lg:row-start-2 w-full">
                 <div className="bg-[#FAF9F6] p-4 shadow-premium-hover rounded-sm transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-gray-200">
                    <div className="border-[12px] border-white shadow-inner bg-gray-100 flex items-center justify-center aspect-square overflow-hidden relative group">
                       <img 
                          src={scenicData?.image || ''} 
                          alt="Location Scenery" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                       />
                    </div>
                    <div className="mt-4 px-2 text-center pb-2">
                        <p className="font-serif italic text-gray-600 text-lg">
                            {scenicData?.caption}
                        </p>
                    </div>
                 </div>
            </div>
            
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;
