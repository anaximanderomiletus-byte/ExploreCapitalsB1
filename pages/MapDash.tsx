import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Map as MapIcon, Globe, CheckCircle2, XCircle, Compass } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Define viewports for quick navigation
const REGION_VIEWPORTS: { [key: string]: { center: [number, number], zoom: number } } = {
  'World': { center: [20, 0], zoom: 2.5 },
  'Africa': { center: [2, 18], zoom: 3.4 },
  'Asia': { center: [30, 85], zoom: 3 },
  'Europe': { center: [50, 15], zoom: 4 },
  'N. America': { center: [45, -100], zoom: 3 },
  'S. America': { center: [-20, -60], zoom: 3.2 },
  'Oceania': { center: [-25, 135], zoom: 3.5 },
};

export default function MapDash() {
  // --- State ---
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string; countryName?: string } | null>(null);

  // --- Refs (For accessing mutable state inside Leaflet closures) ---
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  
  // Synced Refs to avoid stale closures in event listeners
  const gameStateRef = useRef(gameState);
  const targetCountryRef = useRef(targetCountry);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { targetCountryRef.current = targetCountry; }, [targetCountry]);

  // --- Timer Logic ---
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- Helper: Format Time ---
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Game Logic ---

  const generateTarget = useCallback(() => {
    // Filter out tiny countries if needed, or just random
    // For better gameplay, ensuring we pick countries that actually have markers on the map
    const random = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
    setTargetCountry(random);
    setFeedback(null); // Clear feedback for new round
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateTarget();

    // Reset map view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20, 0], 2.5, { duration: 1.5 });
      // Reset all marker styles
      resetMarkerStyles();
      // Trigger resize to ensure layout is correct
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  };

  const jumpToRegion = (regionName: string) => {
    const viewport = REGION_VIEWPORTS[regionName];
    if (mapInstanceRef.current && viewport) {
      mapInstanceRef.current.flyTo(viewport.center, viewport.zoom, { duration: 1.5 });
    }
  };

  const resetMarkerStyles = () => {
    const L = (window as any).L;
    if (!markersLayerRef.current || !L) return;

    markersLayerRef.current.eachLayer((layer: any) => {
      layer.setStyle({
        fillColor: '#77B6EA',
        color: '#FFFFFF',
        radius: 6,
        fillOpacity: 0.8
      });
    });
  };

  // --- Map Initialization ---
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    // 1. Init Map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2.5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true
    });

    // 2. Add Tile Layer (No Labels for difficulty)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // 3. Add Controls
    // Explicitly place zoom control in bottomright as requested
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 4. Init Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // 5. Add Markers
    MOCK_COUNTRIES.forEach(country => {
      // Handle dateline crossing for Oceania visual consistency if needed, 
      // but for the game mechanics, keeping raw coords is often safer unless using a specific world-wrapping plugin.
      // We will use raw coords here.

      const marker = L.circleMarker([country.lat, country.lng], {
        radius: 6,
        fillColor: '#77B6EA', // Primary Blue
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'transition-all duration-300 cursor-pointer'
      });

      // Bind Click Event
      marker.on('click', () => {
        const currentTarget = targetCountryRef.current;
        const currentGameState = gameStateRef.current;

        if (currentGameState !== 'playing' || !currentTarget) return;

        if (country.id === currentTarget.id) {
          // --- CORRECT ---
          setScore(s => s + 50);
          setFeedback({ type: 'success', message: 'Correct!', countryName: country.name });
          
          // Green Style
          marker.setStyle({ fillColor: '#22c55e', color: '#15803d', radius: 10 });
          marker.bringToFront();

          // Next Round Delay
          setTimeout(() => {
            generateTarget();
            resetMarkerStyles();
          }, 1000);

        } else {
          // --- INCORRECT ---
          setScore(s => Math.max(0, s - 10));
          setFeedback({ type: 'error', message: 'Wrong!', countryName: country.name });
          
          // Red Style
          marker.setStyle({ fillColor: '#ef4444', color: '#b91c1c', radius: 8 });
          
          // Reset this specific marker after a bit
          setTimeout(() => {
             marker.setStyle({ fillColor: '#77B6EA', color: '#FFFFFF', radius: 6 });
          }, 800);
        }
      });

      // Hover Effects
      marker.on('mouseover', function (this: any) {
        this.setStyle({ radius: 9, fillOpacity: 1 });
      });
      marker.on('mouseout', function (this: any) {
        // Only reset if not the "active" correct/wrong one (simplified check by relying on global reset for correct)
        // For simplicity, we reset to base unless it was just clicked. 
        // Since click handles style immediately, we can just check basic properties or ignore for MVP.
        this.setStyle({ radius: 6, fillOpacity: 0.8 });
      });

      marker.addTo(markersGroup);
    });

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [generateTarget]); // Dependencies mostly empty to run once, but generateTarget is stable

  // --- Render Helpers ---

  return (
    <div className="relative w-full h-screen overflow-hidden bg-surface">
      <SEO 
        title="Map Dash"
        description="Navigate the globe without borders. Find as many countries as you can in 1 minute in this challenging map game."
      />
      
      <style>{`
        @media (max-width: 768px) {
          .map-dash-container .leaflet-control-zoom {
            display: none !important;
          }
        }
      `}</style>

      {/* MAP BACKGROUND - Always mounted to prevent bugs */}
      <div ref={mapRef} className="absolute inset-0 z-0 focus:outline-none map-dash-container" />

      {/* --- HUD: Playing State --- */}
      {gameState === 'playing' && (
        <>
          {/* Top Bar - Adjusted for mobile */}
          <div className="absolute top-16 md:top-20 left-0 w-full p-3 md:p-6 z-20 pointer-events-none flex flex-col gap-4">
            <div className="flex justify-between items-start max-w-7xl mx-auto w-full">
              
              {/* Left: Exit & Score */}
              <div className="flex gap-2 md:gap-3 pointer-events-auto">
                <Link to="/games">
                  <button className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-premium hover:scale-105 transition-transform flex items-center justify-center text-gray-500 hover:text-primary">
                    <ArrowLeft size={20} />
                  </button>
                </Link>
                <div className="h-10 md:h-12 px-3 md:px-5 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-premium flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-top-4">
                  <Trophy size={18} className="text-yellow-500" />
                  <span className="font-display font-bold text-lg md:text-xl text-text">{score}</span>
                </div>
              </div>

              {/* Right: Timer */}
              <div className={`h-10 md:h-12 px-3 md:px-5 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl shadow-premium flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-top-4 ${timeLeft <= 10 ? 'ring-2 ring-red-400' : ''}`}>
                <Timer size={18} className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-primary"} />
                <span className={`font-display font-bold text-lg md:text-xl tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-text'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Left Sidebar: Quick Jump - HIDDEN ON MOBILE to save space */}
          <div className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 z-20 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-premium border border-white/50 pointer-events-auto flex flex-col gap-1 animate-in slide-in-from-left-10 fade-in duration-500">
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center py-1 border-b border-gray-200/50 mb-1">
                 Quick Jump
               </div>
               {Object.keys(REGION_VIEWPORTS).map(region => (
                 <button
                   key={region}
                   onClick={() => jumpToRegion(region)}
                   className="group flex items-center justify-between w-28 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-primary hover:text-white rounded-xl transition-all"
                 >
                   <span>{region}</span>
                   <Compass size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
               ))}
            </div>
          </div>

          {/* Bottom Bar: Target */}
          {/* Modified: Centered container with max-width to avoid covering bottom-right corner where zoom control is */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 z-20 pointer-events-none">
            <div className="flex items-end justify-center gap-4 relative">
              
              {/* Target Card */}
              {targetCountry && (
                <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 p-5 md:p-6 pb-6 md:pb-8 text-center w-full max-w-[90%] md:w-auto md:min-w-[300px] animate-in slide-in-from-bottom-10 duration-500 relative overflow-hidden">
                  {/* Abstract BG */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                  
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Find this Location</p>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-5xl md:text-6xl drop-shadow-sm filter hover:scale-110 transition-transform duration-300 cursor-default">
                      {targetCountry.flag}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-text leading-none mt-2">
                      {targetCountry.name}
                    </h2>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Feedback Overlay (Toast) */}
          {feedback && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none w-full px-4 text-center">
               <div className={`inline-flex flex-col items-center justify-center p-6 rounded-3xl shadow-2xl backdrop-blur-md animate-in zoom-in fade-in duration-300 ${
                 feedback.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
               }`}>
                 {feedback.type === 'success' ? <CheckCircle2 size={48} className="mb-2" /> : <XCircle size={48} className="mb-2" />}
                 <h3 className="text-2xl md:text-3xl font-display font-bold">{feedback.message}</h3>
                 {feedback.type === 'error' && <p className="mt-1 opacity-90 text-base md:text-lg">That was {feedback.countryName}</p>}
                 {feedback.type === 'success' && <p className="mt-1 opacity-90 text-base md:text-lg">+50 Points</p>}
               </div>
             </div>
          )}
        </>
      )}

      {/* --- START SCREEN Overlay --- */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/60 backdrop-blur-sm p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <MapIcon size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-3">Map Dash</h1>
            <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
              Navigate the globe without borders. Find as many countries as you can in 1 minute.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={startGame} size="lg" className="w-full">
                Start Game
              </Button>
              <Link to="/games" className="w-full">
                <Button variant="secondary" size="lg" className="w-full">Back to Games</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME OVER Overlay --- */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center border border-gray-100 transform transition-all hover:scale-105 duration-300">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent ring-8 ring-accent/5">
              <Trophy size={40} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-400 uppercase tracking-wider mb-1">Final Score</h2>
            <div className="text-6xl md:text-7xl font-display font-bold text-primary mb-2 tracking-tight">
              {score}
            </div>
            <p className="text-gray-500 mb-8">
              Well played!
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={startGame} size="lg" className="w-full">
                <RefreshCw size={20} className="mr-2" /> Play Again
              </Button>
              <Link to="/games" className="w-full">
                <Button variant="secondary" size="lg" className="w-full">Exit to Menu</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}