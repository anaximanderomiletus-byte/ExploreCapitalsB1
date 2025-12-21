
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Map as MapIcon, Globe, CheckCircle2, XCircle, Compass } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

export default function MapDash() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string; countryName?: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const gameStateRef = useRef(gameState);
  const targetCountryRef = useRef(targetCountry);
  const feedbackRef = useRef(feedback);
  const isTransitioningRef = useRef(isTransitioning);

  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { targetCountryRef.current = targetCountry; }, [targetCountry]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);
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
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const generateTarget = useCallback(() => {
    const random = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
    setTargetCountry(random);
    setFeedback(null); 
  }, []);

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

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateTarget();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20, 0], 2.5, { duration: 1.5 });
      resetMarkerStyles();
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
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    MOCK_COUNTRIES.forEach(country => {
      const marker = L.circleMarker([country.lat, country.lng], {
        radius: 6,
        fillColor: '#77B6EA', 
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
        className: 'cursor-pointer'
      });

      marker.on('click', (e: any) => {
        L.DomEvent.stopPropagation(e);
        const currentTarget = targetCountryRef.current;
        if (gameStateRef.current !== 'playing' || !currentTarget || isTransitioningRef.current || feedbackRef.current?.type === 'success') return;

        if (country.id === currentTarget.id) {
          setScore(s => s + 50);
          setFeedback({ type: 'success', message: 'Correct!', countryName: country.name });
          setIsTransitioning(true);
          marker.setStyle({ fillColor: '#22c55e', color: '#FFFFFF', radius: 10 });
          setTimeout(() => { generateTarget(); setIsTransitioning(false); }, 800);
        } else {
          setScore(s => Math.max(0, s - 10));
          setFeedback({ type: 'error', message: 'Wrong!', countryName: country.name });
          marker.setStyle({ fillColor: '#ef4444', color: '#FFFFFF', radius: 8 });
          setTimeout(() => { setFeedback(prev => (prev?.type === 'error' && prev.countryName === country.name ? null : prev)); }, 1200);
        }
      });

      marker.addTo(markersLayerRef.current);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [generateTarget]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-surface relative flex flex-col font-sans">
      <div ref={mapRef} className="absolute inset-0 z-0 focus:outline-none" />

      {gameState === 'playing' && (
        <>
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

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-20 pointer-events-none">
            {targetCountry && (
              <div className={`pointer-events-auto bg-white rounded-2xl shadow-xl border border-white/50 p-4 text-center transition-all duration-300 transform ${isTransitioning ? 'translate-y-10 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">Find this Location</p>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl drop-shadow-sm">{targetCountry.flag}</span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-text leading-tight">{targetCountry.name}</h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {gameState === 'start' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><MapIcon size={32} /></div>
            <h1 className="text-3xl font-display font-bold text-text mb-2">Map Dash</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-sans">Locate the highlighted countries on the empty map.</p>
            <div className="flex flex-col gap-6">
              <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
              <Link to="/games" className="w-full">
                 <Button variant="secondary" size="md" className="w-full h-12">Back to Games</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent"><Trophy size={32} /></div>
            <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-1 font-sans">Score</h2>
            <div className="text-6xl font-display font-bold text-primary mb-10">{score}</div>
            <div className="flex flex-col gap-6">
              <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
              <Link to="/games" className="w-full">
                <Button variant="secondary" size="md" className="w-full h-12">Back to Games</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
