
import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Map as MapIcon } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

export default function MapDash() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const markerInstancesRef = useRef<Map<string, any>>(new Map());
  
  const gameStateRef = useRef(gameState);
  const targetCountryRef = useRef(targetCountry);
  const isTransitioningRef = useRef(isTransitioning);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { targetCountryRef.current = targetCountry; }, [targetCountry]);
  useEffect(() => { isTransitioningRef.current = isTransitioning; }, [isTransitioning]);

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
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetAllMarkerStyles = useCallback(() => {
    markerInstancesRef.current.forEach((marker) => {
      const iconElement = marker.getElement();
      if (iconElement) {
        iconElement.classList.remove('marker-correct', 'marker-incorrect');
      }
    });
  }, []);

  const generateTarget = useCallback(() => {
    const random = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
    setTargetCountry(random);
    resetAllMarkerStyles();
  }, [resetAllMarkerStyles]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateTarget();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20, 0], 2.5, { duration: 1.5 });
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
    }
  };

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2.5,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      preferCanvas: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    MOCK_COUNTRIES.forEach(country => {
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pin"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([country.lat, country.lng], { icon: icon });
      markerInstancesRef.current.set(country.id, marker);

      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        const currentTarget = targetCountryRef.current;
        if (gameStateRef.current !== 'playing' || !currentTarget || isTransitioningRef.current) return;

        const el = marker.getElement();
        const isCorrect = country.id === currentTarget.id;
        
        // Compact feedback popup positioned closer to marker but not touching
        const popup = L.popup({
          closeButton: false,
          autoClose: true,
          className: `map-dash-feedback-popup ${isCorrect ? 'popup-success' : 'popup-error'}`,
          offset: [0, -12], // Decreased from -18 to bring it closer to the dot
          minWidth: 10,
          maxWidth: 240
        })
        .setLatLng([country.lat, country.lng])
        .setContent(isCorrect ? 'Correct!' : country.name)
        .openOn(map);

        // Auto-remove popup after 0.7s for tight gameplay loop
        setTimeout(() => {
          map.closePopup(popup);
        }, 700);

        if (isCorrect) {
          setScore(s => s + 50);
          setIsTransitioning(true);
          if (el) el.classList.add('marker-correct');
          
          setTimeout(() => { 
            generateTarget(); 
            setIsTransitioning(false); 
          }, 700);
        } else {
          setScore(s => Math.max(0, s - 10));
          if (el) el.classList.add('marker-incorrect');
          
          setTimeout(() => { 
            if (el) el.classList.remove('marker-incorrect');
          }, 1000);
        }
      });

      marker.addTo(markersLayerRef.current);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerInstancesRef.current.clear();
    };
  }, [generateTarget]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-surface relative flex flex-col font-sans">
      <SEO title="Map Dash" description="Locate the nation on the map." />
      
      <style>{`
        .marker-correct .marker-pin { background-color: #22c55e !important; border-color: white !important; transform: scale(1.4); }
        .marker-incorrect .marker-pin { background-color: #ef4444 !important; border-color: white !important; transform: scale(1.1); }
        
        /* Ultra minimal popup styling with dynamic width */
        .map-dash-feedback-popup.leaflet-popup {
          margin-bottom: 0;
          pointer-events: none;
        }
        .map-dash-feedback-popup .leaflet-popup-content-wrapper {
          background: rgba(55, 57, 58, 0.95);
          backdrop-filter: blur(4px);
          color: white;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 11px;
          border-radius: 6px;
          padding: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border: none;
          text-align: center;
          width: fit-content !important;
          margin: 0 auto;
          display: inline-block;
          white-space: nowrap;
        }
        .map-dash-feedback-popup .leaflet-popup-content {
          margin: 6px 12px;
          line-height: 1;
          width: auto !important;
          white-space: nowrap;
          display: inline-block;
        }
        .map-dash-feedback-popup .leaflet-popup-tip-container {
          display: none;
        }
        .popup-success .leaflet-popup-content-wrapper {
          background: rgba(34, 197, 94, 1);
        }
        .popup-error .leaflet-popup-content-wrapper {
          background: rgba(239, 68, 68, 1);
        }
      `}</style>

      <div ref={mapRef} className="absolute inset-0 z-0 focus:outline-none" />

      {gameState === 'playing' && (
        <>
          {/* Header Stats */}
          <div className="absolute top-16 md:top-20 left-0 w-full p-4 z-20 pointer-events-none flex justify-center">
            <div className="flex justify-between items-start max-w-7xl mx-auto w-full">
              <div className="flex gap-2 pointer-events-auto">
                <Link to="/games">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/50 flex items-center justify-center text-gray-500 active:scale-95 transition-transform">
                    <ArrowLeft size={20} />
                  </button>
                </Link>
                <div className="h-10 px-4 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/50 flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="font-display font-bold text-lg text-text tabular-nums">{score}</span>
                </div>
              </div>
              <div className={`h-10 px-4 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/50 flex items-center gap-2 pointer-events-auto ${timeLeft <= 10 ? 'ring-2 ring-red-400' : ''}`}>
                <Timer size={16} className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-primary"} />
                <span className={`font-display font-bold text-lg tabular-nums ${timeLeft <= 10 ? 'text-red-500' : 'text-text'}`}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Target Country Card */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-20 pointer-events-none">
            {targetCountry && (
              <div className={`pointer-events-auto bg-white rounded-2xl shadow-xl border-4 border-gray-100 p-4 text-center transition-all duration-300 transform ${isTransitioning ? 'translate-y-10 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-xl"></div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">Locate on map</p>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl">{targetCountry.flag}</span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-text leading-tight">{targetCountry.name}</h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Start Overlay */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><MapIcon size={32} /></div>
            <h1 className="text-3xl font-display font-bold text-text mb-2">Map Dash</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-sans">Locate the highlighted countries on the map before time runs out.</p>
            <div className="flex flex-col gap-6">
              <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
              <Link to="/games" className="w-full">
                 <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Finished Overlay */}
      {gameState === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent"><Trophy size={32} /></div>
            <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">Score</h2>
            <div className="text-6xl font-display font-bold text-primary mb-10">{score}</div>
            <div className="flex flex-col gap-6">
              <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
              <Link to="/games" className="w-full">
                <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
