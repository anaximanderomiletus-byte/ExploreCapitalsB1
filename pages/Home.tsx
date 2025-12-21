
import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Trophy, BookOpen, ArrowRight, Compass, Globe2, Sparkles, GraduationCap, Zap } from 'lucide-react';
import Button from '../components/Button';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ExploreCapitals",
    "url": "https://explorecapitals.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://explorecapitals.com/directory?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="bg-surface overflow-x-hidden">
      <SEO 
        title="Master World Geography & Capitals"
        description="The premier platform for geography education. Explore interactive maps, play capital city quizzes, and access comprehensive demographic data for over 190 countries."
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
         {/* Background Elements */}
         <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 to-surface z-0"></div>
         
         {/* Decorative Grid Pattern */}
         <div 
            className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none z-0" 
            style={{ 
                backgroundImage: 'radial-gradient(#37393A 0.5px, transparent 0.5px)', 
                backgroundSize: '30px 30px' 
            }}
         ></div>
         
         {/* Cinematic Floating Blobs */}
         <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-float opacity-70"></div>
         <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-float opacity-70" style={{ animationDelay: '3s' }}></div>

         <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            {/* Feature Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-premium mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto hover:scale-105 transition-transform cursor-default select-none group">
               <Sparkles className="text-primary group-hover:rotate-12 transition-transform" size={16} />
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">Global Knowledge Redefined</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-black mb-8 text-text tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              The Atlas <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-shimmer">
                Unlocked.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Master every capital, explore high-fidelity maps, and uncover the demographic stories of over 190 nations through a premium gamified experience.
            </p>

            {/* Primary Action Group */}
             <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 w-full px-4">
                <Link to="/games" className="w-full sm:w-auto group">
                   <Button variant="primary" size="lg" className="w-full h-16 text-xl">
                     Begin Journey <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                   </Button>
                </Link>
                <Link to="/map" className="w-full sm:w-auto">
                   <Button variant="secondary" size="lg" className="w-full h-16 text-xl bg-white/60 border border-white backdrop-blur-md hover:bg-white/90 text-gray-600">
                     Interactive Map
                   </Button>
                </Link>
             </div>
             
             {/* Institutional Trust Bar */}
             <div className="mt-20 pt-12 border-t border-gray-200/40 flex flex-wrap justify-center gap-12 md:gap-24 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards">
                 <div className="flex flex-col items-center group cursor-default">
                    <div className="text-3xl md:text-5xl font-display font-bold text-text group-hover:text-primary transition-colors">195+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Sovereign Nations</div>
                 </div>
                 <div className="flex flex-col items-center group cursor-default">
                    <div className="text-3xl md:text-5xl font-display font-bold text-text group-hover:text-accent transition-colors">7</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Specialized Labs</div>
                 </div>
                 <div className="flex flex-col items-center group cursor-default">
                    <div className="text-3xl md:text-5xl font-display font-bold text-text group-hover:text-secondary transition-colors">60s</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Rapid Challenges</div>
                 </div>
             </div>
         </div>
      </section>

      {/* Bento-Grid Feature Ecosystem */}
      <section className="py-24 px-6 relative z-10 bg-white rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.03)]">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text tracking-tight">The Ecosystem</h2>
                    <p className="text-gray-400 text-lg mt-3 max-w-lg">A multi-modal approach to mastering global geography.</p>
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                   <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                      <Zap size={14} /> High Performance
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/5 px-4 py-2 rounded-full border border-secondary/10">
                      <GraduationCap size={14} /> Academic Authority
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Featured: Map - Spans 8 cols */}
                <div className="md:col-span-8 bg-gradient-to-br from-surface to-white rounded-[2.5rem] p-10 md:p-12 border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group overflow-hidden relative min-h-[420px] flex flex-col justify-center">
                   <div className="relative z-10 max-w-md">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 text-primary shadow-premium border border-gray-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                         <Globe2 size={32} />
                      </div>
                      <h3 className="text-4xl font-display font-bold text-text mb-4 group-hover:text-primary transition-colors">Precision Mapping</h3>
                      <p className="text-gray-500 text-lg leading-relaxed mb-10">
                        Explore every corner of the globe with our high-fidelity interactive engine. Click any region to reveal flags, demographics, and curated field reports.
                      </p>
                      <Link to="/map" className="inline-flex items-center gap-3 font-bold text-text bg-white px-8 py-4 rounded-2xl shadow-premium border border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:translate-x-1">
                        Launch Map <ArrowRight size={20} />
                      </Link>
                   </div>
                   
                   {/* Abstract Map Graphic */}
                   <div className="absolute right-[-10%] bottom-[-10%] w-[60%] opacity-[0.07] pointer-events-none group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-1000 hidden md:block">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-primary">
                          <path d="M37.5,-64.7C48.6,-57.8,57.7,-47.8,64.3,-36.3C70.9,-24.8,75,-12.4,74.7,-0.2C74.3,12,69.6,24.1,62.2,34.8C54.7,45.4,44.6,54.7,33,60.8C21.4,66.8,8.2,69.7,-4.8,61.4C-17.8,53,-30.5,33.4,-41.8,17.2C-53.1,1.1,-63,-11.5,-63.9,-24.5C-64.8,-37.5,-56.7,-51,-44.6,-57.6C-32.5,-64.3,-16.2,-64.1,-1,-62.4C14.2,-60.7,26.4,-71.5,37.5,-64.7Z" transform="translate(100 100)" />
                        </svg>
                   </div>
                </div>

                {/* Featured: Games - Spans 4 cols, tall */}
                <div className="md:col-span-4 bg-primary rounded-[2.5rem] p-10 text-white shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col min-h-[420px]">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8 text-white border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                          <Trophy size={32} />
                       </div>
                       <h3 className="text-4xl font-display font-bold mb-4">Arcade Mode</h3>
                       <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                         Competitive learning designed to stick. Battle the clock in 7 specialized game modes.
                       </p>
                       
                       <div className="space-y-3 flex-grow">
                          {['Capital Quiz', 'Map Dash', 'Flag Frenzy', 'Population Pursuit'].map((game, i) => (
                             <div key={game} className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all cursor-default translate-y-0 hover:-translate-x-1" style={{ transitionDelay: `${i * 50}ms` }}>
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-display font-bold text-sm">
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                <span className="font-bold text-sm tracking-wide opacity-90">{game}</span>
                             </div>
                          ))}
                       </div>
                       
                       <Link to="/games" className="mt-10">
                          <Button variant="secondary" className="w-full border-none bg-white text-primary hover:bg-blue-50 shadow-xl py-5 text-xl">
                             Play Now
                          </Button>
                       </Link>
                    </div>
                </div>

                {/* Secondary: Directory - Spans 6 cols */}
                <div className="md:col-span-6 bg-surface rounded-[2.5rem] p-10 border border-gray-200/50 shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-accent/20 rounded-[2rem] flex-shrink-0 flex items-center justify-center text-amber-800/60 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                        <BookOpen size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-bold text-text mb-2 group-hover:text-primary transition-colors">Data Directory</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            A search-first database of global statistics. Access population, currency, and language data for every nation.
                        </p>
                        <Link to="/directory" className="inline-flex items-center text-sm font-bold text-gray-500 group-hover:text-primary transition-colors gap-2">
                            Access Database <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Secondary: Tours - Spans 6 cols */}
                <div className="md:col-span-6 bg-surface rounded-[2.5rem] p-10 border border-gray-200/50 shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-secondary/40 rounded-[2rem] flex-shrink-0 flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Compass size={48} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-bold text-text mb-2 group-hover:text-primary transition-colors">Virtual Tours</h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Immersive, high-fidelity journeys curated for every nation. Uncover the stories behind the borders.
                        </p>
                        <Link to="/map" className="inline-flex items-center text-sm font-bold text-gray-500 group-hover:text-primary transition-colors gap-2">
                            Explore Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Global Action CTA */}
      <section className="py-32 px-6 bg-white relative overflow-hidden border-t border-gray-50">
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.2] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(#C7D3DD 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-display font-black text-text mb-8 tracking-tighter">
               Ready to go global?
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl mb-14 max-w-2xl mx-auto leading-relaxed">
               Join a global community of learners mastering the atlas through design-led education.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/games">
                   <Button variant="primary" size="lg" className="h-18 px-14 text-2xl">
                      Launch Application
                   </Button>
                </Link>
                <Link to="/about">
                    <Button variant="secondary" size="lg" className="h-18 px-14 text-2xl bg-surface/50 border border-gray-200">
                        About Project
                    </Button>
                </Link>
            </div>
         </div>
      </section>
    </main>
  );
};

export default Home;
