
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Users, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

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
  const [countryA, setCountryA] = useState<Country | null>(null);
  const [countryB, setCountryB] = useState<Country | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

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
    setResult(null);
    const idxA = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    let idxB = Math.floor(Math.random() * MOCK_COUNTRIES.length);
    while (idxB === idxA) idxB = Math.floor(Math.random() * MOCK_COUNTRIES.length);
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
    const isCorrect = selectedPop === Math.max(popA, popB);
    setResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 10);
    setTimeout(generateRound, 1500);
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <SEO title="Population Pursuit" description="Which country has more people?" />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><Users size={32} /></div>
          <h1 className="text-3xl font-display font-bold text-text mb-4">Population Pursuit</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed font-sans">Select the nation with the larger population count.</p>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
            <Link to="/games" className="w-full"><Button variant="secondary" size="md" className="w-full h-12">Back to Games</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent"><Trophy size={32} /></div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Time's Up!</h1>
          <div className="text-6xl font-display font-bold text-primary mb-10">{score}</div>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
            <Link to="/games" className="w-full">
               <Button variant="secondary" size="md" className="w-full h-12">Back to Games</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!countryA || !countryB) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <SEO title="Playing Population Pursuit" description="Choose the larger population." />
      
      {/* Header - Compacted top margin */}
      <div className="max-w-4xl mx-auto w-full flex shrink-0 items-center justify-between mb-4 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 mt-12 md:mt-16">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><ArrowLeft size={20} /></Link>
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" /><span className="font-display font-bold text-lg text-text tabular-nums">{score}</span>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
              <Timer size={18} />
              <span className="font-display font-bold text-lg tabular-nums min-w-[30px]">{timeLeft}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col min-h-0 pb-4 overflow-hidden">
           {/* Question - Reduced margin */}
           <div className="text-center mb-4 shrink-0">
             <h2 className="text-xl md:text-2xl font-display font-bold text-text tracking-tight animate-in fade-in slide-in-from-top-2 duration-500">
               Which country has a larger population?
             </h2>
           </div>

           {/* Cards Container - Gap reduced for tighter vertical space */}
           <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {[countryA, countryB].map((country, idx) => {
                  const other = idx === 0 ? countryB : countryA;
                  const isWinner = getNumericValue(country.population) >= getNumericValue(other!.population);
                  let cardStyle = "bg-white border-2 border-gray-100 hover:border-primary/40 shadow-sm";
                  if (result) {
                      if (isWinner) cardStyle = "bg-green-50 border-green-500 ring-4 ring-green-500/10 z-10 scale-[1.02]";
                      else cardStyle = "bg-gray-50 opacity-40 grayscale scale-[0.98] border-transparent";
                  }

                  return (
                    <div 
                      key={country.id} 
                      onClick={() => handleChoice(country)} 
                      className={`flex-1 relative rounded-[1.5rem] p-4 md:p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer active:bg-gray-50 ${cardStyle}`} 
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {/* Flag - Responsive sizing to prevent overflow */}
                      <div className="text-6xl md:text-7xl lg:text-[7.5rem] mb-2 drop-shadow-lg select-none transition-transform duration-500 hover:scale-105">
                        {country.flag}
                      </div>
                      
                      {/* Name - Responsive sizing */}
                      <h3 className="text-lg md:text-2xl font-display font-bold text-text mb-2 text-center leading-tight px-2 break-words">
                        {country.name}
                      </h3>

                      {/* Result Box - Absolute centering or controlled max-height */}
                      <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center ${result ? 'max-h-24 opacity-100 scale-100 mt-2' : 'max-h-0 opacity-0 scale-95'}`}>
                          <div className="flex items-center gap-1 text-gray-400 uppercase font-bold text-[9px] tracking-widest mb-0.5 font-sans">Reported Population</div>
                          <div className="text-2xl md:text-4xl font-display font-bold text-primary tracking-tighter tabular-nums">{country.population}</div>
                      </div>

                      {/* Floating Indicator */}
                      {result && isWinner && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
                            <Check size={24} strokeWidth={4} />
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
