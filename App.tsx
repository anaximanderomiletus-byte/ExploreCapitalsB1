
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Globe, Compass } from 'lucide-react';
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
import RegionRoundup from './pages/RegionRoundup';
import LandmarkLegend from './pages/LandmarkLegend';
import CountryExploration from './pages/CountryExploration';
import CountryDetail from './pages/CountryDetail';
import Footer from './components/Footer';
import { LayoutProvider, useLayout } from './context/LayoutContext';

/**
 * PageTransitionHandler
 * Detects location changes and manages a multi-stage transition.
 * Supports a unique "Canvas Curtain" transition style for profiles.
 */
const PageTransitionHandler: React.FC<{ children: (location: any) => React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isTransitioning, setIsTransitioning, isPageLoading, setPageLoading, transitionStyle, setTransitionStyle } = useLayout();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'waiting' | 'exiting'>('idle');
  const [navId, setNavId] = useState(0);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Check if the source or target is an exploration page
      // We skip the global transition overlay for expeditions to avoid visual jumps between mixed animation systems
      const isExpedition = location.pathname.startsWith('/explore/');
      const isFromExpedition = displayLocation.pathname.startsWith('/explore/');
      
      if (isExpedition || isFromExpedition) {
        window.scrollTo(0, 0);
        setDisplayLocation(location);
        setIsTransitioning(false);
        setPageLoading(false);
        setTransitionState('idle');
        return;
      }

      setIsTransitioning(true);
      setPageLoading(true); 
      setTransitionState('entering');
      setNavId(prev => prev + 1);

      const enterTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        setDisplayLocation(location);
        setTransitionState('waiting');
      }, transitionStyle === 'cartographic' ? 600 : 400);

      return () => clearTimeout(enterTimer);
    } else if (location.search !== displayLocation.search || location.hash !== displayLocation.hash) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation.pathname, displayLocation.search, displayLocation.hash, transitionStyle, setIsTransitioning, setPageLoading, setTransitionStyle]);

  useEffect(() => {
    if (transitionState === 'waiting' && !isPageLoading) {
      const waitTimer = setTimeout(() => {
        setTransitionState('exiting');
      }, 150);
      return () => clearTimeout(waitTimer);
    }
  }, [transitionState, isPageLoading]);

  useEffect(() => {
    if (transitionState === 'exiting') {
      const exitTimer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionState('idle');
        setTransitionStyle('default');
      }, transitionStyle === 'cartographic' ? 600 : 400);
      return () => clearTimeout(exitTimer);
    }
  }, [transitionState, transitionStyle, setIsTransitioning, setTransitionStyle]);

  useEffect(() => {
    if (transitionState === 'waiting') {
      const safetyTimer = setTimeout(() => {
        setPageLoading(false);
      }, 3000);
      return () => clearTimeout(safetyTimer);
    }
  }, [transitionState, setPageLoading]);

  const renderTransitionVisual = () => {
    if (transitionStyle === 'cartographic') {
      return (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
           <div 
             className={`absolute inset-0 bg-[#FAF9F6] border-b-[20px] border-primary/10 shadow-2xl z-20 ${
               transitionState === 'entering' || transitionState === 'waiting' ? 'animate-curtain-down' : 
               transitionState === 'exiting' ? 'animate-curtain-up' : 
               '-translate-y-full'
             }`}
           >
              <div className="w-full h-full flex flex-col items-center justify-center text-text">
                 <div className="relative mb-12">
                    <div className="p-6 bg-white rounded-3xl shadow-premium border border-gray-100 transform rotate-3 animate-float">
                        <Compass className="w-20 h-20 text-primary" strokeWidth={1} />
                    </div>
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10"></div>
                 </div>
                 <div className="font-display font-black text-xs uppercase tracking-[0.6em] text-gray-400">Archiving Report</div>
                 <div className="mt-4 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-shimmer bg-[length:200%_auto]"></div>
                 </div>
              </div>
           </div>
        </div>
      );
    }

    return (
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
           <div className="text-white flex items-center justify-center">
              <Globe className="w-16 h-16 animate-spin" strokeWidth={1.5} />
           </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {children(displayLocation)}
      </div>
      {isTransitioning && renderTransitionVisual()}
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
              <Route path="/games/region-roundup" element={<RegionRoundup />} />
              <Route path="/games/landmark-legend" element={<LandmarkLegend />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/country/:id" element={<CountryDetail />} />
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
  const { isFooterHidden } = useLayout();
  
  // Always hide on the map page, but otherwise respect component-level overrides
  const isMap = location.pathname === '/map';
  
  if (isMap || isFooterHidden) return null;
  
  return <Footer />;
};

export default App;
