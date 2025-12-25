
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Map, Compass, Navigation, Scroll, MapPin, 
  Clock, Phone, Car, Users, Maximize2, Banknote, 
  TrendingUp, Languages, Building2, Quote, Globe
} from 'lucide-react';
import { MOCK_COUNTRIES, TERRITORIES } from '../constants';
import { STATIC_IMAGES } from '../data/images';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const CountryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageLoading, setTransitionStyle } = useLayout();
  
  const country = useMemo(() => MOCK_COUNTRIES.find(c => c.id === id) || TERRITORIES.find(t => t.id === id), [id]);
  const isTerritory = useMemo(() => TERRITORIES.some(t => t.id === id), [id]);

  const controlledTerritories = useMemo(() => {
    if (!country || isTerritory) return [];
    return TERRITORIES.filter(t => t.sovereignty === country.name).sort((a, b) => a.name.localeCompare(b.name));
  }, [country, isTerritory]);

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
    return MOCK_COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase())?.id;
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
    if (sovereigntyName === 'Disputed') return;
    
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

  const landmarkImage = STATIC_IMAGES[country.name] || STATIC_IMAGES[country.capital] || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop";

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
        title={`${country.name} - ${isTerritory ? 'Territory' : 'Country'} Profile`} 
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
            <div className="lg:col-span-5 order-1">
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
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-4xl grayscale opacity-50 select-none" role="img" aria-label="flag icon">{country.flag}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. The "Field Notes": Official Profile & Integrated Coordinates */}
            <div className="lg:col-span-7 order-2 lg:row-span-2">
                <div className="bg-[#fdf6e3] p-6 md:p-10 lg:p-12 shadow-premium rounded-[2.5rem] border border-gray-200/50 relative h-full flex flex-col overflow-hidden">
                     <div className="absolute top-8 right-8">
                        <Scroll className="text-primary/10 w-16 h-16" />
                     </div>
                     
                     <header className="mb-8 pb-4 border-b border-gray-200 flex items-center gap-3 shrink-0">
                        <Compass className="text-primary" size={28} />
                        <h3 className="font-display font-black text-2xl text-gray-800 uppercase tracking-tight">Official Profile</h3>
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
                        
                        {/* New "Also Known As" Stat */}
                        {country.alsoKnownAs && country.alsoKnownAs.length > 0 && (
                           <div className="col-span-2 md:col-span-1">
                             <StatItem 
                               label="Also Known As" 
                               value={country.alsoKnownAs.join(', ')} 
                               icon={Quote} 
                             />
                           </div>
                        )}
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

                     {!isTerritory ? (
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
                                 Virtual expeditions are currently available for sovereign nations only.
                             </p>
                         </div>
                     )}

                     {/* White Coordinate Bubble */}
                     <div className="mt-auto pt-16 flex justify-center">
                        <div className="inline-flex flex-col items-center gap-2">
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Coordinates</div>
                             <div className="inline-flex items-center gap-6 px-8 py-4 bg-white text-text rounded-full shadow-premium-hover border-2 border-gray-100 ring-4 ring-primary/5 group hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center gap-2">
                                     <Navigation size={18} className="rotate-45 text-primary opacity-80 group-hover:rotate-[225deg] transition-transform duration-700" />
                                     <div className="h-6 w-px bg-gray-200"></div>
                                  </div>
                                  <div className="flex gap-10">
                                     <div className="flex flex-col items-center">
                                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Latitude</span>
                                         <span className="text-sm font-mono font-black text-gray-700">{country.lat.toFixed(4)}° N</span>
                                     </div>
                                     <div className="flex flex-col items-center">
                                         <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Longitude</span>
                                         <span className="text-sm font-mono font-black text-gray-700">{country.lng.toFixed(4)}° E</span>
                                     </div>
                                  </div>
                             </div>
                        </div>
                     </div>
                </div>
            </div>

            {/* 3. The "Instant Photo": Landscape/Landmark Snapshot */}
            <div className="lg:col-span-5 order-3">
                <div className="bg-white p-3 pt-4 pb-12 shadow-premium rounded-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-200 w-full mx-auto">
                    <div className="aspect-square bg-gray-900 overflow-hidden relative">
                        <img 
                            src={landmarkImage}
                            alt={country.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.3)] pointer-events-none"></div>
                    </div>
                    <div className="mt-4 px-2">
                         <p className="font-serif italic text-gray-400 text-sm text-center">Field Snapshot: {country.capital}</p>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;
