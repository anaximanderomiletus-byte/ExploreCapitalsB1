import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Compass, Navigation, Scroll, MapPin } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import { STATIC_IMAGES } from '../data/images';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const CountryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setPageLoading } = useLayout();
  
  const country = useMemo(() => MOCK_COUNTRIES.find(c => c.id === id), [id]);

  useEffect(() => {
    setPageLoading(false);
  }, [setPageLoading]);

  if (!country) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-text">Country not found.</h2>
        <Link to="/directory" className="text-primary hover:underline mt-4 inline-block">Back to Directory</Link>
      </div>
    );
  }

  // Calculate ISO code for the flag image
  const countryCode = Array.from(country.flag)
    .map((char: any) => String.fromCharCode(char.codePointAt(0)! - 127397).toLowerCase())
    .join('');

  const landmarkImage = STATIC_IMAGES[country.name] || STATIC_IMAGES[country.capital] || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-surface pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
      <SEO 
        title={`${country.name} - Country Profile`} 
        description={`Explore detailed demographics, history, and travel insights for ${country.name}. Start your virtual expedition to its capital, ${country.capital}.`} 
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation / Header Area - Dark text for light background */}
        <div className="mb-10 flex items-center justify-between">
            <button 
                onClick={() => navigate('/directory')}
                className="group flex items-center gap-2 text-gray-500 hover:text-text transition-colors font-display font-bold uppercase tracking-widest text-xs"
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
            
            {/* 1. The "Postcard": Flag & Primary Info (Top on Mobile) */}
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
                             <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Stampe</div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between items-end px-2">
                        <div>
                            <h1 className="text-4xl font-display font-black text-gray-800 tracking-tighter uppercase">{country.name}</h1>
                            <p className="text-primary font-bold tracking-widest text-xs uppercase flex items-center gap-1 mt-1">
                                <MapPin size={12} /> {country.region}
                            </p>
                        </div>
                        <div className="text-right">
                             <span className="text-4xl grayscale opacity-50 select-none" role="img" aria-label="flag icon">{country.flag}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. The "Field Notes": Official Profile - Rounded Corners */}
            <div className="lg:col-span-7 order-2 lg:row-span-2">
                <div className="bg-[#fdf6e3] p-8 md:p-12 shadow-premium rounded-[2rem] border-l-[12px] border-primary/40 relative h-full">
                     <div className="absolute top-8 right-8">
                        <Scroll className="text-primary/20 w-16 h-16" />
                     </div>
                     <h3 className="font-display font-black text-2xl text-gray-800 uppercase tracking-tight mb-8 pb-4 border-b border-gray-200 flex items-center gap-3">
                        <Compass className="text-primary" /> Official Profile
                     </h3>
                     
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 mb-12">
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Capital City</p>
                            <p className="text-xl font-display font-bold text-gray-700">{country.capital}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Population</p>
                            <p className="text-xl font-display font-bold text-gray-700">{country.population}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Land Area</p>
                            <p className="text-xl font-display font-bold text-gray-700">{country.area} km²</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Currency</p>
                            <p className="text-xl font-display font-bold text-gray-700">{country.currency}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Primary Languages</p>
                            <div className="flex flex-wrap gap-2">
                                {country.languages.map(lang => (
                                    <span key={lang} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 shadow-sm">{lang}</span>
                                ))}
                            </div>
                        </div>
                     </div>

                     <div className="mb-10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Geographic Field Report</p>
                        <p className="font-serif text-lg leading-relaxed text-gray-600 italic">
                            "{country.description}"
                        </p>
                     </div>

                     {/* Borders - If available */}
                     {country.borders && country.borders.length > 0 && (
                        <div className="mb-12">
                             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Bordering Nations</p>
                             <div className="flex flex-wrap gap-2">
                                {country.borders.map(border => (
                                    <span key={border} className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">{border}</span>
                                ))}
                             </div>
                        </div>
                     )}

                     {/* THE ACTION: START EXPEDITION - Standardized to Match App System */}
                     <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-6">
                        <Link to={`/explore/${country.id}`} className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" className="w-full group">
                                Start Expedition <Compass className="ml-2 group-hover:rotate-45 transition-transform" />
                            </Button>
                        </Link>
                        <p className="text-sm text-gray-400 font-medium max-w-[240px] text-center sm:text-left">
                            Begin a guided interactive tour of {country.name}'s geography and landmarks.
                        </p>
                     </div>
                </div>
            </div>

            {/* 3. The "Instant Photo": Landscape/Landmark Snapshot (Last on Mobile) */}
            <div className="lg:col-span-5 order-3">
                <div className="bg-white p-3 pt-4 pb-12 shadow-premium rounded-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-200 w-full mx-auto">
                    <div className="aspect-square bg-gray-900 overflow-hidden">
                        <img 
                            src={landmarkImage}
                            alt={country.name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <div className="mt-4 px-2">
                         <p className="font-serif italic text-gray-400 text-sm text-center">Field Snapshot: {country.capital}</p>
                    </div>
                </div>
            </div>

            {/* 4. Additional Decorative Paper: "The Map" (Bottom) */}
            <div className="lg:col-span-7 order-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-premium">
                    <div className="flex items-center gap-4 text-gray-400">
                        <Navigation size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">Cartographic Coordinates</span>
                    </div>
                    <div className="mt-4 flex gap-8">
                         <div>
                            <span className="block text-[10px] text-gray-400 uppercase font-black">Latitude</span>
                            <span className="text-lg font-mono text-text">{country.lat.toFixed(4)}°</span>
                         </div>
                         <div>
                            <span className="block text-[10px] text-gray-400 uppercase font-black">Longitude</span>
                            <span className="text-lg font-mono text-text">{country.lng.toFixed(4)}°</span>
                         </div>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </main>
  );
};

export default CountryDetail;