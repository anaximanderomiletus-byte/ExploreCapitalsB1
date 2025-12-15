

import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { LayoutProvider } from './context/LayoutContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <div className="flex-grow">
            <Routes>
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
          </div>
          {/* Footer is rendered globally here, but CountryExploration needs to opt-out or manage it. 
              Ideally we rely on pages to render footer if complex logic is needed, 
              but for now we will keep it here and hide it via CSS or keep as is.
              The user specifically asked to remove footer from the CountryExploration page.
              We will hide it based on route in the Footer component or here.
          */}
          <ConditionalFooter />
        </div>
      </Router>
    </LayoutProvider>
  );
};

// Helper to conditionally render footer based on route
const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  // Hide global footer on exploration pages as they handle their own layout/footer needs
  // or user specifically requested removal.
  const isExploration = location.pathname.startsWith('/explore/');
  
  if (isExploration) return null;
  
  return <Footer />;
};

export default App;
