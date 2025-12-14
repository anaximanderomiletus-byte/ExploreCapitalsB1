

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Search, Check, X, Eye, EyeOff, Globe2, Banknote, Languages, MapPin } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function GlobalDetective() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Game Logic State
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCapitalRevealed, setIsCapitalRevealed] = useState(false);
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);

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
    // Reset round state
    setSelectedAnswer(null);
    setRoundResult(null);
    setIsCapitalRevealed(false);

    // Pick target
    const target = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
    setTargetCountry(target);

    // Pick distractors
    const distractors: Country[] = [];
    while (distractors.length < 3) {
      const c = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
      if (c.id !== target.id && !distractors.find(d => d.id === c.id)) {
        distractors.push(c);
      }
    }
    const roundOptions = shuffle([target, ...distractors]);
    setOptions(roundOptions);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateRound();
  };

  const revealCapital = () => {
    if (isCapitalRevealed || roundResult) return;
    setIsCapitalRevealed(true);
    // Penalty logic could be added here, but for now we just change scoring potential
  };

  const handleAnswer = (countryName: string) => {
    if (roundResult || !targetCountry) return;

    setSelectedAnswer(countryName);
    const correct = countryName === targetCountry.name;
    setRoundResult(correct ? 'correct' : 'incorrect');

    if (correct) {
      // Base score 20. Penalty -5 if capital revealed.
      const roundScore = isCapitalRevealed ? 15 : 20;
      setScore(s => s + roundScore);
    }

    setTimeout(() => {
      generateRound();
    }, 1500);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO 
            title="Global Detective"
            description="Deduce the mystery country from 3 clues. Use your detective skills!"
        />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Search size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-4">Global Detective</h1>
          <p className="text-gray-500 text-lg mb-8">
            Identify the mystery country using only the clues provided. Revealing the capital city will reduce your score!
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
        <SEO title="Global Detective Results" description="See your score for the Global Detective game." />
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

  if (!targetCountry) return null;

  return (
    <div className="min-h-screen bg-surface pt-28 pb-12 px-4 md:px-6">
      <SEO 
        title="Playing Global Detective"
        description="Identify the country from clues."
      />
      <div className="max-w-2xl mx-auto h-full flex flex-col">
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

        {/* Dossier Card */}
        <div className="bg-white rounded-3xl shadow-premium p-6 md:p-8 mb-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe2 size={120} />
            </div>

            <div className="mb-6 relative z-10">
                <h2 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Search size={14} /> Subject Dossier
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Clue 1: Region */}
                    <div className="p-4 bg-surface rounded-xl border border-secondary/30">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                            <Globe2 size={14} /> Region
                        </div>
                        <div className="text-lg font-bold text-text">{targetCountry.region}</div>
                    </div>

                    {/* Clue 2: Currency */}
                    <div className="p-4 bg-surface rounded-xl border border-secondary/30">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                            <Banknote size={14} /> Currency
                        </div>
                        <div className="text-lg font-bold text-text">{targetCountry.currency}</div>
                    </div>

                    {/* Clue 3: Language */}
                    <div className="p-4 bg-surface rounded-xl border border-secondary/30">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                            <Languages size={14} /> Language
                        </div>
                        <div className="text-lg font-bold text-text">{targetCountry.languages[0]}</div>
                    </div>

                    {/* Clue 4: Capital (Hidden) */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${isCapitalRevealed ? 'bg-amber-50 border-amber-200' : 'bg-gray-800 border-gray-900 cursor-pointer group hover:bg-gray-700'}`} onClick={revealCapital}>
                         <div className={`flex items-center gap-2 text-xs font-bold uppercase mb-1 ${isCapitalRevealed ? 'text-amber-700' : 'text-gray-400'}`}>
                            <MapPin size={14} /> Capital City
                        </div>
                        
                        {isCapitalRevealed ? (
                            <div className="text-lg font-bold text-amber-900 animate-in fade-in">{targetCountry.capital}</div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-500 font-mono tracking-widest">REDACTED</span>
                                <EyeOff size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                        )}
                        
                        {!isCapitalRevealed && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Eye size={14} /> Reveal (-5 pts)
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                {options.map((option) => {
                     const isSelected = selectedAnswer === option.name;
                     let btnStyle = "bg-white border-2 border-gray-100 hover:border-primary hover:bg-blue-50/50 text-gray-700";
                     let icon = null;
     
                     if (selectedAnswer) {
                       if (option.name === targetCountry.name) {
                          btnStyle = "bg-green-50 border-2 border-green-500 text-green-800 shadow-none";
                          icon = <Check size={20} className="text-green-600" />;
                       } else if (isSelected) {
                          btnStyle = "bg-red-50 border-2 border-red-500 text-red-800 shadow-none";
                          icon = <X size={20} className="text-red-600" />;
                       } else {
                          btnStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-50 shadow-none";
                       }
                     }
     
                     return (
                       <button
                         key={option.id}
                         onClick={() => handleAnswer(option.name)}
                         disabled={!!selectedAnswer}
                         className={`relative p-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center min-h-[64px] ${btnStyle} ${!selectedAnswer ? 'shadow-sm hover:shadow-md active:translate-y-[4px] active:shadow-none shadow-[0_4px_0_#E5E7EB]' : ''}`}
                       >
                         <span className="z-10">{option.name}</span>
                         {icon && <div className="absolute right-4 z-10">{icon}</div>}
                       </button>
                     );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
