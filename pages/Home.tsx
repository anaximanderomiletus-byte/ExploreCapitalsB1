import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, ArrowRight, Compass, Globe2, GraduationCap, Zap } from 'lucide-react';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const Home: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const { setPageLoading } = useLayout();

  useEffect(() => {
    setPageLoading(false);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ExploreCapitals",
    "alternateName": "Explore Capitals",
    "url": "https://explorecapitals.com",
    "description": "Master world geography and capitals with interactive maps, competitive quizzes, and detailed country data for 195 nations.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://explorecapitals.com/#/directory?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="bg-surface overflow-x-hidden">
      <SEO 
        title="Master World Geography & Capitals | Interactive Atlas"
        description="ExploreCapitals is the premier platform for geography mastery. Features interactive maps, capital city quizzes, and comprehensive data for over 190 countries. Start your global journey today."
        keywords="world capitals, geography games, interactive map, learning geography, country facts, population data, capital cities"
        structuredData={structuredData}
      />

      {/* Hero Section - Balanced min-height and justify-center for vertical impact */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-48 pb-32">
         <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-surface z-0"></div>
         
         <div 
            className="absolute inset-0 opacity-[0.15] z-0 will-change-transform" 
            style={{ 
              backgroundImage: 'radial-gradient(#37393A 0.5px, transparent 0.5px)', 
              backgroundSize: '32px 32px',
              transform: `translateY(${scrollY * 0.1}px)` 
            }}
         ></div>

         {/* Floating Background Continents - Slowed down significantly for a very subtle effect */}
         <div 
            className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none flex items-center justify-center scale-110 select-none will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.2}px) scale(1.1)` }}
         >
            <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-text">
               {/* North America-ish */}
               <path className="animate-float" style={{ animationDuration: '22s' }} d="M120,80 Q140,70 180,80 T240,80 T230,150 T180,180 T120,130 Z" />
               {/* South America-ish */}
               <path className="animate-float" style={{ animationDuration: '30s', animationDelay: '2s' }} d="M180,200 Q210,190 240,210 T250,300 T190,340 T160,240 Z" />
               {/* Eurasia-ish */}
               <path className="animate-float" style={{ animationDuration: '40s', animationDelay: '1s' }} d="M350,60 Q450,40 600,40 T780,100 T750,180 T580,200 T380,150 Z" />
               {/* Africa-ish */}
               <path className="animate-float" style={{ animationDuration: '25s', animationDelay: '4s' }} d="M380,180 Q450,170 520,190 T530,300 T410,310 Z" />
               {/* Australia-ish */}
               <path className="animate-float" style={{ animationDuration: '35s', animationDelay: '3s' }} d="M680,280 Q740,270 760,300 T740,340 T670,300 Z" />
               {/* Small Island */}
               <circle className="animate-float" style={{ animationDuration: '20s' }} cx="220" cy="30" r="15" />
            </svg>
         </div>
         
         <div 
            className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] opacity-40 transition-transform duration-1000 ease-out pointer-events-none"
            style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
         ></div>
         <div 
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] opacity-40 transition-transform duration-1000 ease-out pointer-events-none" 
            style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}
         ></div>

         <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-8 text-text tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000">
              The World Atlas <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-shimmer">
                Unlocked.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              A high-fidelity interactive experience designed to help you master 195 nations and their capitals through data and exploration.
            </p>

             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <Link to="/games" className="w-full sm:w-auto">
                   <Button variant="primary" size="lg" className="w-full h-14 px-12 text-lg" title="Play Geography Games">
                     Start Journey <ArrowRight className="ml-2" size={20} />
                   </Button>
                </Link>
                <Link to="/map" className="w-full sm:w-auto">
                   <Button variant="secondary" size="lg" className="w-full h-14 px-12 text-lg bg-white/40 border border-white/60 backdrop-blur-md hover:bg-white/80" title="View World Map">
                     Explore Map
                   </Button>
                </Link>
             </div>
             
             <div className="mt-20 pt-10 border-t border-gray-200/40 flex flex-wrap justify-center gap-10 md:gap-20 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400 fill-mode-forwards">
                 <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-display font-bold text-text">195</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">Nations</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-display font-bold text-text">7</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">Modules</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-display font-bold text-text">60s</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">Blitz Quizzes</span>
                 </div>
             </div>
         </div>
      </section>

      {/* Bento-Grid Feature Ecosystem */}
      <section className="py-24 px-6 relative z-10 bg-white rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.02)]">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-text tracking-tight">The Geography Ecosystem</h2>
                    <p className="text-gray-400 text-lg mt-2 max-w-lg">Mastering world capitals through high-fidelity interaction.</p>
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10 uppercase tracking-wider">
                      <Zap size={12} /> High Performance
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-secondary bg-secondary/5 px-4 py-2 rounded-full border border-secondary/10 uppercase tracking-wider">
                      <GraduationCap size={12} /> Academic Authority
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 bg-surface/30 rounded-[2rem] p-10 md:p-12 border border-gray-100 shadow-premium group overflow-hidden relative min-h-[400px] flex flex-col justify-center">
                   <div className="absolute inset-0 z-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-700 pointer-none flex items-center justify-center p-8">
                      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-primary" aria-hidden="true">
                        <path d="M120,80 L140,70 L180,80 L220,60 L240,80 L230,120 L210,150 L180,180 L150,170 L120,130 Z" />
                        <path d="M180,200 L210,190 L240,210 L250,250 L220,320 L190,340 L170,300 L160,240 Z" />
                        <path d="M350,60 L450,40 L600,40 L750,60 L780,100 L750,180 L680,220 L580,200 L500,180 L420,200 L380,150 L350,100 Z" />
                        <path d="M380,180 L450,170 L520,190 L530,240 L500,320 L450,340 L410,310 L380,250 Z" />
                        <path d="M680,280 L740,270 L760,300 T740,340 L690,330 L670,300 Z" />
                        <path d="M220,30 L250,20 L280,35 L260,60 L225,55 Z" />
                        <path d="M540,280 L560,285 L555,310 L540,315 Z" />
                        <circle cx="280" cy="180" r="5" />
                        <circle cx="310" cy="200" r="4" />
                        <circle cx="620" cy="240" r="4" />
                        <circle cx="650" cy="260" r="3" />
                      </svg>
                   </div>

                   <div className="relative z-10 max-w-md">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm border border-gray-50 group-hover:rotate-3 transition-transform duration-500">
                         <Globe2 size={28} />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-text mb-4">Precision World Map</h3>
                      <p className="text-gray-500 text-base leading-relaxed mb-8">
                        Explore every corner of the globe with our interactive engine. Reveal flags, demographics, and curated geographical reports.
                      </p>
                      <Link to="/map">
                        <Button variant="outline" size="md" className="rounded-xl border-gray-200 text-gray-600 hover:bg-white hover:shadow-sm">
                          Launch Interface
                        </Button>
                      </Link>
                   </div>
                </div>

                <div className="md:col-span-4 bg-primary rounded-[2rem] p-10 text-white shadow-lg group relative overflow-hidden flex flex-col min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[70px] -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                          <Trophy size={28} />
                       </div>
                       <h3 className="text-3xl font-display font-bold mb-4">Geography Arcade</h3>
                       <p className="text-blue-50 text-base mb-8 leading-relaxed">
                         Competitive learning with 7 blitz game modes designed for high retention.
                       </p>
                       
                       <div className="space-y-2 mt-auto">
                          {['Capital Quiz', 'Map Dash', 'Flag Frenzy'].map((game, i) => (
                             <div key={game} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-display font-bold text-xs">
                                    0{i + 1}
                                </div>
                                <span className="font-bold text-xs tracking-wide opacity-90">{game}</span>
                             </div>
                          ))}
                       </div>
                       <Link to="/games" className="mt-8">
                          <Button variant="secondary" size="md" className="w-full">
                             View Games
                          </Button>
                       </Link>
                    </div>
                </div>

                <div className="md:col-span-6 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-premium flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-accent/15 rounded-2xl flex-shrink-0 flex items-center justify-center text-accent">
                        <BookOpen size={36} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-text mb-2">Country Data Directory</h3>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            Search and sort population, currency, and language data for 195 nations.
                        </p>
                        <Link to="/directory" className="inline-flex items-center text-xs font-bold text-primary gap-1 group">
                            Open Database <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-6 bg-white rounded-[2rem] p-10 border border-gray-100 shadow-premium flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 bg-secondary/30 rounded-2xl flex-shrink-0 flex items-center justify-center text-text/60">
                        <Compass size={36} />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-text mb-2">Immersive Virtual Tours</h3>
                        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                            Curated expeditions through the history and landmarks of every sovereign nation.
                        </p>
                        <Link to="/map" className="inline-flex items-center text-xs font-bold text-primary gap-1 group">
                            Explore Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
         </div>
      </section>

      <section className="py-32 px-6 bg-[#2D3133] relative overflow-hidden">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-none"></div>
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-none"></div>

         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 tracking-tighter">
               Ready to go global?
            </h2>
            <p className="text-blue-100/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
               Join a global community of learners mastering the atlas through design-led education and high-fidelity interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                <Link to="/games" className="flex">
                   <Button variant="primary" size="lg" className="h-16 px-14 text-xl w-full">
                      Play Now
                   </Button>
                </Link>
                <Link to="/about" className="flex">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="h-16 px-14 text-xl bg-white/10 border-white/20 text-white shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:bg-white/20 active:shadow-none active:translate-y-[4px] w-full"
                    >
                        About Us
                    </Button>
                </Link>
            </div>
         </div>
      </section>
    </main>
  );
};

export default Home;