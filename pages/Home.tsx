import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Trophy, BookOpen, ArrowRight } from 'lucide-react';
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
    <main>
      <SEO 
        title="Master World Geography & Capitals"
        description="The premier platform for geography education. Explore interactive maps, play capital city quizzes, and access comprehensive demographic data for over 190 countries."
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
        {/* Background Gradient - Iceberg Palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-secondary/30 to-primary/20 z-0"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-text pt-10 md:pt-0">
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both delay-100 text-text">
            Explore the World, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              One Capital at a Time.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Master global geography through interactive quizzes, detailed maps, and expert-curated insights. Learning has never been this beautiful.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 w-full sm:w-auto">
            <Link to="/games" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="rounded-full w-full">
                Start Playing
              </Button>
            </Link>
            <Link to="/directory" className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="rounded-full w-full">
                Explore Directory
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Curve Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[80px] text-white" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Features Section (3-Column Grid) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">Why Choose ExploreCapitals?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We blend cognitive science with premium design to create a learning environment that respects your time and intelligence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Map className="w-8 h-8 text-primary" />,
                title: "Interactive Maps",
                desc: "Immersive, high-fidelity maps powered by Leaflet and CartoDB for seamless exploration."
              },
              {
                icon: <Trophy className="w-8 h-8 text-accent" />,
                title: "Gamified Learning",
                desc: "Earn points, beat clocks, and track your mastery of continents with our arcade-style quizzes."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-secondary" />,
                title: "Rich Data Directory",
                desc: "Access curated demographic and geographic data instantly with our responsive directory."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-2 group border border-secondary/20">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-secondary/30">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;