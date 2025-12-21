
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Users, Check, X } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><ArrowLeft size={20} /></Link>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Compare Populations</p>
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" /><span className="font-display font-bold text-xl text-text tabular-nums">{score}</span>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
              <Timer size={18} /><span className="font-display font-bold text-xl tabular-nums min-w-[30px]">{timeLeft}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-4 min-h-0 pb-6 overflow-hidden">
           {[countryA, countryB].map((country, idx) => {
             const other = idx === 0 ? countryB : countryA;
             const isWinner = getNumericValue(country.population) >= getNumericValue(other!.population);
             let cardStyle = "bg-white border-2 border-transparent hover:border-primary/40 shadow-sm";
             if (result) {
                if (isWinner) cardStyle = "bg-green-50 border-green-500 ring-8 ring-green-500/10 z-10 scale-105";
                else cardStyle = "bg-gray-50 opacity-40 grayscale scale-95 border-transparent";
             }

             return (
               <div key={country.id} onClick={() => handleChoice(country)} className={`flex-1 relative rounded-[2.5rem] p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer active:bg-gray-50 ${cardStyle}`} style={{ WebkitTapHighlightColor: 'transparent' }}>
                 <div className="text-7xl md:text-[8rem] mb-2 drop-shadow-xl select-none">{country.flag}</div>
                 <h3 className="text-2xl md:text-3xl font-display font-bold text-text mb-4 text-center leading-tight px-4 break-words">{country.name}</h3>
                 <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center ${result ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-1 text-gray-400 uppercase font-bold text-[9px] tracking-widest mb-1 font-sans">Reported Population</div>
                    <div className="text-3xl md:text-5xl font-display font-bold text-primary tracking-tighter tabular-nums">{country.population}</div>
                 </div>
                 {result && isWinner && (
                    <div className="absolute top-6 right-6 bg-green-500 text-white p-2 rounded-full shadow-lg animate-in zoom-in"><Check size={28} strokeWidth={4} /></div>
                 )}
               </div>
             );
           })}
      </div>
    </div>
  );
}
