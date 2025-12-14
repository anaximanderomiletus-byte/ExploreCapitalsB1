
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Users, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Helper to parse numeric strings (e.g. "67.3M" or "500K")
const getNumericValue = (str: string) => {
  const value = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (str.includes('B')) return value * 1_000_000_000;
  if (str.includes('M')) return value * 1_000_000;
  if (str.includes('K')) return value * 1_000;
  return value;
};

export default function PopulationPursuit() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Game State
  const [countryA, setCountryA] = useState<Country | null>(null);
  const [countryB, setCountryB] = useState<Country | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  // Timer
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Helper: Format Time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const generateRound = () => {
    setResult(null);
    const idxA = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    let idxB = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    while (idxB === idxA) {
      idxB = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    }
    setCountryA(MOCK_COUNTRIES[idxA]);
    setCountryB(MOCK_COUNTRIES[idxB]);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateRound();
  };

  const handleChoice = (selected: Country) => {
    if (result || !countryA || !countryB) return;

    const popA = getNumericValue(countryA.population);
    const popB = getNumericValue(countryB.population);
    const selectedPop = getNumericValue(selected.population);

    const maxPop = Math.max(popA, popB);
    const isCorrect = selectedPop === maxPop;

    setResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore(s => s + 10);
    }

    setTimeout(() => {
      generateRound();
    }, 1500);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO 
            title="Population Pursuit"
            description="Which country has more people? Test your demographics knowledge."
        />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Users size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-4">Population Pursuit</h1>
          <p className="text-gray-500 text-lg mb-8">
            Choose the country with the larger population. You have 1 minute.
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={startGame} size="lg" className="w-full">
              Start Game
            </Button>
            <Link to="/games" className="w-full">
              <Button variant="secondary" size="lg" className="w-full">Back to Games</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO title="Population Pursuit Results" description="See your score." />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Time's Up!</h1>
          <p className="text-gray-500 mb-6">You scored</p>
          
          <div className="text-6xl font-display font-bold text-primary mb-8">
            {score}
            <span className="text-lg text-gray-400 font-medium ml-2">pts</span>
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={startGame} size="lg" className="w-full">
              <RefreshCw size={20} className="mr-2" /> Play Again
            </Button>
            <Link to="/games" className="w-full">
              <Button variant="secondary" size="lg" className="w-full">Exit</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!countryA || !countryB) return null;

  return (
    <div className="min-h-screen bg-surface pt-28 pb-12 px-4 md:px-6">
      <SEO 
        title="Playing Population Pursuit"
        description="Choose the country with the higher population."
      />
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
           <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
             <ArrowLeft size={24} />
           </Link>
           
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-md text-primary">
                  <Trophy size={18} />
                </div>
                <span className="font-display font-bold text-xl text-text">{score}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
                  <Timer size={18} />
                </div>
                <span className={`font-display font-bold text-xl tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-text'}`}>
                  {formatTime(timeLeft)}
                </span>
             </div>
           </div>
        </div>

        <div className="text-center mb-6">
           <h2 className="text-xl md:text-2xl font-display font-bold text-text">Which country has more people?</h2>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 flex-1">
           {[countryA, countryB].map((country) => {
             const isSelected = result && getNumericValue(country.population) === Math.max(getNumericValue(countryA.population), getNumericValue(countryB.population));
             const isLoser = result && !isSelected;
             
             let cardStyle = "bg-white hover:border-primary/50 hover:shadow-lg cursor-pointer transform hover:-translate-y-1";
             if (result) {
                if (isSelected) {
                   cardStyle = "bg-green-50 border-green-500 ring-4 ring-green-100 scale-105 z-10";
                } else {
                   cardStyle = "bg-gray-50 opacity-60 grayscale scale-95";
                }
             }

             return (
               <div 
                 key={country.id}
                 onClick={() => handleChoice(country)}
                 className={`relative rounded-3xl shadow-premium p-8 flex flex-col items-center justify-center transition-all duration-300 border-2 border-transparent ${cardStyle}`}
               >
                 <div className="text-9xl mb-6 drop-shadow-md select-none">{country.flag}</div>
                 <h3 className="text-3xl font-bold text-text mb-2 text-center">{country.name}</h3>
                 
                 {/* Reveal Population */}
                 <div className={`transition-all duration-300 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2 text-gray-500 uppercase font-bold text-xs tracking-widest mb-1">
                       <Users size={14} /> Population
                    </div>
                    <div className="text-4xl font-display font-bold text-primary">
                       {country.population}
                    </div>
                 </div>

                 {/* Success/Fail Icon Overlay */}
                 {result && isSelected && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-600 p-2 rounded-full shadow-sm">
                       <Check size={24} />
                    </div>
                 )}
                 {result && isLoser && (
                    <div className="absolute top-4 right-4 bg-red-100 text-red-600 p-2 rounded-full shadow-sm">
                       <X size={24} />
                    </div>
                 )}
               </div>
             );
           })}
        </div>

      </div>
    </div>
  );
}
