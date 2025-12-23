
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Search, Check, X, EyeOff } from 'lucide-react';
import { MOCK_COUNTRIES, GAMES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function GlobalDetective() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<Country[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCapitalRevealed, setIsCapitalRevealed] = useState(false);
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);

  const gameImage = GAMES.find(g => g.id === '6')?.image;

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

  const generateRound = () => {
    setSelectedAnswer(null);
    setRoundResult(null);
    setIsCapitalRevealed(false);
    const target = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
    setTargetCountry(target);
    const distractors: Country[] = [];
    while (distractors.length < 3) {
      const c = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
      if (c.id !== target.id && !distractors.find(d => d.id === c.id)) distractors.push(c);
    }
    setOptions(shuffle([target, ...distractors]));
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
  };

  const handleAnswer = (countryName: string) => {
    if (roundResult || !targetCountry) return;
    setSelectedAnswer(countryName);
    const correct = countryName === targetCountry.name;
    setRoundResult(correct ? 'correct' : 'incorrect');
    if (correct) setScore(s => s + (isCapitalRevealed ? 15 : 20));
    setTimeout(generateRound, 1500);
  };

  const clueBarBase = "px-4 rounded-xl border-2 flex justify-between items-center h-[54px] transition-all duration-300";

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center px-4 overflow-hidden font-sans">
      <SEO title="Global Detective" description="Deduce the mystery country from clues." />
      
      <div className="absolute inset-0 -z-10">
        <img src={gameImage} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" />
      </div>

      {gameState === 'start' && (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300 relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Search size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Global Detective</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Identify the country using the provided clues.</p>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
            <Link to="/games" className="w-full">
              <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
            </Link>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Trophy size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Time's Up!</h1>
          <div className="text-6xl font-display font-bold text-primary mb-10 tabular-nums">{score}</div>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
            <Link to="/games" className="w-full">
               <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
            </Link>
          </div>
        </div>
      )}

      {gameState === 'playing' && targetCountry && (
        <div className="w-full max-w-2xl flex flex-col min-h-0 relative z-10">
          <div className="w-full flex shrink-0 items-center justify-between mb-2 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/50 mt-16 md:mt-20">
             <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors duration-75">
               <ArrowLeft size={20} />
             </Link>
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-primary" />
                  <span className="font-display font-bold text-xl text-text tabular-nums">{score}</span>
               </div>
               <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
                  <Timer size={18} />
                  <span className="font-display font-bold text-xl tabular-nums min-w-[30px]">{timeLeft}</span>
               </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-md rounded-3xl border border-white/50 pt-1 px-5 pb-5 md:pt-2 md:px-8 md:pb-8 overflow-hidden relative shadow-2xl">
                <div className="flex-1 min-h-0 flex flex-col">
                    <h2 className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-2 mt-2 flex items-center gap-2 font-sans">
                      <Search size={12} /> Clues
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-2 mb-4 flex-1 justify-center">
                        <div className={`${clueBarBase} bg-surface/50 border-secondary/10 group hover:bg-white`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Region</span>
                          <span className="font-display font-bold text-text text-base">{targetCountry.region}</span>
                        </div>
                        
                        <div className={`${clueBarBase} bg-surface/50 border-secondary/10 group hover:bg-white`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Currency</span>
                          <span className="font-display font-bold text-text text-base truncate ml-4">{targetCountry.currency}</span>
                        </div>
                        
                        <div className={`${clueBarBase} bg-surface/50 border-secondary/10 group hover:bg-white`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Language</span>
                          <span className="font-display font-bold text-text text-base">{targetCountry.languages[0]}</span>
                        </div>
                        
                        <div 
                          className={`${clueBarBase} relative overflow-hidden ${isCapitalRevealed ? 'bg-amber-50 border-amber-400 shadow-sm' : 'bg-gray-800 border-gray-800 cursor-pointer group active:scale-[0.98]'}`} 
                          onClick={revealCapital}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${isCapitalRevealed ? 'text-amber-700' : 'text-gray-400'}`}>Capital</span>
                            
                            {isCapitalRevealed ? (
                              <span className="font-display font-bold text-amber-900 text-base">{targetCountry.capital}</span>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">REDACTED</span>
                                <EyeOff size={14} className="text-gray-500" />
                              </div>
                            )}
                            
                            {!isCapitalRevealed && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-[9px] font-black uppercase tracking-widest">Reveal Clue (-5 pts)</span>
                              </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
                        {options.map((option) => {
                             const isSelected = selectedAnswer === option.name;
                             const isCorrect = option.name === targetCountry.name;
                             let stateStyles = "bg-white/80 border-2 border-gray-200 text-text active:bg-white";
                             if (selectedAnswer) {
                               if (isCorrect) stateStyles = "bg-green-50 border-2 border-[#22c55e] text-green-900";
                               else if (isSelected) stateStyles = "bg-red-50 border-2 border-red-600 text-red-900";
                               else stateStyles = "bg-gray-50/50 border-2 border-gray-400 text-gray-300 opacity-40";
                             }
                             return (
                               <button 
                                 key={option.id} 
                                 onClick={() => handleAnswer(option.name)} 
                                 disabled={!!selectedAnswer} 
                                 className={`relative p-4 rounded-2xl font-display font-bold text-base flex items-center justify-center min-h-[64px] transition-all ${selectedAnswer ? 'duration-500' : 'duration-0'} ${stateStyles}`}
                                 style={{ WebkitTapHighlightColor: 'transparent' }}
                               >
                                 <span className="text-center leading-tight">{option.name}</span>
                                 {selectedAnswer && isCorrect && <Check size={18} className="absolute right-4 text-[#22c55e]" />}
                                 {selectedAnswer && isSelected && !isCorrect && <X size={18} className="absolute right-4 text-red-600" />}
                               </button>
                             );
                        })}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
