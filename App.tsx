
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
import RegionRoundup from './pages/RegionRoundup';
import LandmarkLegend from './pages/LandmarkLegend';
import CountryExploration from './pages/CountryExploration';
import CountryDetail from './pages/CountryDetail';
import Footer from './components/Footer';
import { LayoutProvider, useLayout } from './context/LayoutContext';

/**
 * PageTransitionHandler
 * Detects location changes and manages a multi-stage transition.
 */
const PageTransitionHandler: React.FC<{ children: (location: any) => React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isTransitioning, setIsTransitioning, isPageLoading, setPageLoading } = useLayout();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState<'idle' | 'entering' | 'waiting' | 'exiting'>('idle');
  const [navId, setNavId] = useState(0);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      setPageLoading(true); 
      setTransitionState('entering');
      setNavId(prev => prev + 1);

      const enterTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        setDisplayLocation(location);
        setTransitionState('waiting');
      }, 400);

      return () => clearTimeout(enterTimer);
    } else if (location.search !== displayLocation.search || location.hash !== displayLocation.hash) {
      setDisplayLocation(location);
    }
  }, [location, displayLocation.pathname, displayLocation.search, displayLocation.hash]);

  useEffect(() => {
    if (transitionState === 'waiting' && !isPageLoading) {
      const waitTimer = setTimeout(() => {
        setTransitionState('exiting');
      }, 100);
      return () => clearTimeout(waitTimer);
    }
  }, [transitionState, isPageLoading]);

  useEffect(() => {
    if (transitionState === 'exiting') {
      const exitTimer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionState('idle');
      }, 400);
      return () => clearTimeout(exitTimer);
    }
  }, [transitionState]);

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
      {children(displayLocation)}
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
             <div className="text-white flex items-center justify-center">
                <Globe className="w-16 h-16 animate-spin" strokeWidth={1.5} />
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
  const isExploration = location.pathname.startsWith('/explore/');
  const isCountryPage = location.pathname.startsWith('/country/');
  const isMap = location.pathname === '/map';
  
  if (isExploration || isMap || isCountryPage) return null;
  
  return <Footer />;
};

export default App;
