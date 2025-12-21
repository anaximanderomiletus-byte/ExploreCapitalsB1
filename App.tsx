
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Games from './pages/Games';
import Directory from './pages/Directory';
import MapPage from './pages/MapPage';
import About from './pages/About';
import CapitalQuiz from './pages/CapitalQuiz';
import MapDash from './pages/MapDash';
import FlagFrenzy from './pages/FlagFrenzy';
import KnowYourNeighbor from './pages/KnowYourNeighbor';
import PopulationPursuit from './pages/PopulationPursuit';
import GlobalDetective from './pages/GlobalDetective';
import CapitalConnection from './pages/CapitalConnection';
import CountryExploration from './pages/CountryExploration';
import Footer from './components/Footer';
import { LayoutProvider, useLayout } from './context/LayoutContext';

/**
 * PageTransitionHandler
 * Detects location changes and manages a multi-stage transition.
 * It waits for the isPageLoading flag to flip to false before opening the curtain.
 * Handles scroll reset invisibly while the curtain is closed.
 */
const PageTransitionHandler: React.FC<{ children: (location: any) => React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isTransitioning, setIsTransitioning, isPageLoading, setPageLoading } = useLayout();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'waiting' | 'exiting'>('idle');
  const [navId, setNavId] = useState(0);

  // Transition Phase 1: Navigation Triggered
  useEffect(() => {
    if (location.key !== displayLocation.key) {
      setIsTransitioning(true);
      setPageLoading(true); // Default to true until the new page says otherwise
      setTransitionState('entering');
      setNavId(prev => prev + 1);

      // Phase 2: Curtain covers the screen (400ms)
      const enterTimer = setTimeout(() => {
        // RESET SCROLL HERE: The curtain is now fully covering the viewport
        window.scrollTo(0, 0);
        
        setDisplayLocation(location);
        setTransitionState('waiting');
      }, 400);

      return () => clearTimeout(enterTimer);
    }
  }, [location, displayLocation.key]);

  // Transition Phase 3: Wait for assets to be ready
  useEffect(() => {
    if (transitionState === 'waiting' && !isPageLoading) {
      // Small buffer to ensure browser render cycle finishes
      const waitTimer = setTimeout(() => {
        setTransitionState('exiting');
      }, 100);
      return () => clearTimeout(waitTimer);
    }
  }, [transitionState, isPageLoading]);

  // Transition Phase 4: Curtain opens (400ms)
  useEffect(() => {
    if (transitionState === 'exiting') {
      const exitTimer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionState('idle');
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [transitionState]);

  // Safety Timeout: Don't stay stuck forever if something fails
  useEffect(() => {
    if (transitionState === 'waiting') {
      const safetyTimer = setTimeout(() => {
        setPageLoading(false);
      }, 3000);
      return () => clearTimeout(safetyTimer);
    }
  }, [transitionState]);

  return (
    <>
      {/* The visible routes, pointing to the buffered location */}
      {children(displayLocation)}

      {/* Full-screen Wipe Overlay */}
      {isTransitioning && (
        <div 
          key={`wipe-overlay-${navId}`}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
        >
          <div 
            className={`w-full h-full bg-primary flex items-center justify-center ${
              transitionState === 'entering' ? 'animate-wipe-in' : 
              transitionState === 'exiting' ? 'animate-wipe-out' : 
              'translate-x-0'
            }`}
          >
             <div className="text-white flex flex-col items-center gap-4">
                <Globe className="w-16 h-16 animate-spin" strokeWidth={1.5} />
                <span className="font-display font-bold text-xl uppercase tracking-[0.2em] opacity-80">
                  Exploring
                </span>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow">
        <PageTransitionHandler>
          {(location) => (
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/capital-quiz" element={<CapitalQuiz />} />
              <Route path="/games/map-dash" element={<MapDash />} />
              <Route path="/games/flag-frenzy" element={<FlagFrenzy />} />
              <Route path="/games/know-your-neighbor" element={<KnowYourNeighbor />} />
              <Route path="/games/population-pursuit" element={<PopulationPursuit />} />
              <Route path="/games/global-detective" element={<GlobalDetective />} />
              <Route path="/games/capital-connection" element={<CapitalConnection />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/explore/:id" element={<CountryExploration />} />
            </Routes>
          )}
        </PageTransitionHandler>
      </div>
      <ConditionalFooter />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <Router>
        <AppContent />
      </Router>
    </LayoutProvider>
  );
};

const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  const isExploration = location.pathname.startsWith('/explore/');
  const isMap = location.pathname === '/map';
  const isGame = location.pathname.startsWith('/games/');
  
  if (isExploration || isMap || isGame) return null;
  
  return <Footer />;
};

export default App;
