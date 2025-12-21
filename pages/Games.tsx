
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Lock } from 'lucide-react';
import Button from '../components/Button';
import { GAMES } from '../constants';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';

const Games: React.FC = () => {
  const { setPageLoading } = useLayout();

  useEffect(() => {
    // Start Preloading Images
    const imageUrls = GAMES.map(game => game.image);
    
    // Create an array of image load promises
    const loadPromises = imageUrls.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Resolve even on error to avoid hanging the UI
      });
    });

    // Wait for all images, then signal that the page is ready
    Promise.all(loadPromises).then(() => {
      setPageLoading(false);
    });
  }, [setPageLoading]);

  return (
    <div className="pt-28 pb-20 px-6 bg-surface min-h-screen">
      <SEO 
        title="Geography Games"
        description="Challenge your knowledge with our interactive geography games: Capital Quiz, Map Dash, and Flag Frenzy. Fun educational tools for all ages."
        keywords="geography games, map quiz, capital quiz, flags, educational games"
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-text mb-4">Game Center</h1>
          <p className="text-gray-500 text-lg">Challenge yourself and master the atlas.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GAMES.map((game) => (
            <div 
              key={game.id} 
              // Fix for border-radius clipping issue during transform animations in some browsers
              style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
              className={`group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover hover:scale-[1.02] transition-all duration-300 border border-gray-100 ${game.status !== 'active' ? 'opacity-75 grayscale' : ''}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover" 
                />
                {game.status !== 'active' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-semibold flex items-center gap-2">
                      <Lock size={16} /> Coming Soon
                    </div>
                  </div>
                )}
                {game.status === 'active' && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                     <Clock size={12} /> 1 Min
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-text mb-2">{game.title}</h3>
                <p className="text-gray-500 mb-3 text-sm leading-relaxed min-h-[40px]">{game.description}</p>
                
                {/* Capital Quiz Link */}
                {game.status === 'active' && game.id === '1' && (
                  <Link to="/games/capital-quiz">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {/* Map Dash Link */}
                {game.status === 'active' && game.id === '2' && (
                  <Link to="/games/map-dash">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {/* Flag Frenzy Link */}
                {game.status === 'active' && game.id === '3' && (
                  <Link to="/games/flag-frenzy">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {/* Know Your Neighbor Link */}
                {game.status === 'active' && game.id === '4' && (
                  <Link to="/games/know-your-neighbor">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {/* Population Pursuit Link */}
                {game.status === 'active' && game.id === '5' && (
                  <Link to="/games/population-pursuit">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {/* Global Detective Link */}
                {game.status === 'active' && game.id === '6' && (
                  <Link to="/games/global-detective">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}
                
                {/* Capital Connection Link */}
                {game.status === 'active' && game.id === '7' && (
                  <Link to="/games/capital-connection">
                    <Button variant="primary" className="w-full">
                      <span className="flex items-center gap-2">Play Now <Play size={16} fill="currentColor" /></span>
                    </Button>
                  </Link>
                )}

                {game.status !== 'active' && (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    disabled={true}
                  >
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
