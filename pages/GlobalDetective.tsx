
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Search, Check, X, EyeOff } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
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

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <SEO title="Global Detective" description="Deduce the mystery country from clues." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary"><Search size={32} /></div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Global Detective</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">Identify the country using the provided clues.</p>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
            <Link to="/games" className="w-full">
              <Button variant="secondary" size="md" className="w-full h-12">Back to Games</Button>
            </Link>
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
          <div className="text-5xl font-display font-bold text-primary mb-10">{score}</div>
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

  if (!targetCountry) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <div className="max-w-2xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><ArrowLeft size={20} /></Link>
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 font-bold"><Trophy size={14} className="text-primary" /> <span className="tabular-nums">{score}</span></div>
           <div className={`px-2 py-0.5 rounded font-bold tabular-nums ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>{timeLeft}</div>
         </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col min-h-0 bg-white rounded-3xl border border-gray-100 p-4 overflow-hidden">
            <div className="flex-1 min-h-0 flex flex-col">
                <h2 className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-3 flex items-center gap-2 font-sans"><Search size={12} /> Dossier Clues</h2>
                <div className="grid grid-cols-1 gap-2 mb-4 flex-1 justify-center">
                    <div className="p-3 bg-surface/50 rounded-xl border border-secondary/20 flex justify-between items-center"><span className="text-[10px] font-bold text-gray-500 uppercase">Region</span><span className="text-sm font-bold text-text">{targetCountry.region}</span></div>
                    <div className="p-3 bg-surface/50 rounded-xl border border-secondary/20 flex justify-between items-center"><span className="text-[10px] font-bold text-gray-500 uppercase">Currency</span><span className="text-sm font-bold text-text truncate ml-2">{targetCountry.currency}</span></div>
                    <div className="p-3 bg-surface/50 rounded-xl border border-secondary/20 flex justify-between items-center"><span className="text-[10px] font-bold text-gray-500 uppercase">Language</span><span className="text-sm font-bold text-text">{targetCountry.languages[0]}</span></div>
                    <div className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden flex justify-between items-center ${isCapitalRevealed ? 'bg-amber-50 border-amber-200' : 'bg-gray-800 border-gray-900 cursor-pointer group active:bg-gray-700'}`} onClick={revealCapital}>
                        <span className={`text-[10px] font-bold uppercase ${isCapitalRevealed ? 'text-amber-700' : 'text-gray-400'}`}>Capital</span>
                        {isCapitalRevealed ? <span className="text-sm font-bold text-amber-900 animate-in fade-in">{targetCountry.capital}</span> : <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-500 tracking-widest">REDACTED</span><EyeOff size={14} className="text-gray-500" /></div>}
                        {!isCapitalRevealed && <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-[9px] font-bold uppercase">Reveal (-5 pts)</span></div>}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
                    {options.map((option) => {
                         const isSelected = selectedAnswer === option.name;
                         const isCorrect = option.name === targetCountry.name;
                         let btnStyle = "bg-white border-2 border-gray-100 text-text active:bg-gray-50";
                         if (selectedAnswer) {
                           if (isCorrect) btnStyle = "bg-green-50 border-green-500 text-green-900";
                           else if (isSelected) btnStyle = "bg-red-50 border-red-500 text-red-900";
                           else btnStyle = "bg-gray-50 border-transparent text-gray-300 opacity-40";
                         }
                         return (
                           <button key={option.id} onClick={() => handleAnswer(option.name)} disabled={!!selectedAnswer} className={`relative p-3 rounded-xl font-display font-bold text-sm transition-all duration-200 flex items-center justify-center min-h-[56px] ${btnStyle}`}>
                             <span className="text-center leading-tight">{option.name}</span>
                             {selectedAnswer && isCorrect && <Check size={16} className="absolute right-3 text-green-600" />}
                             {selectedAnswer && isSelected && !isCorrect && <X size={16} className="absolute right-3 text-red-600" />}
                           </button>
                         );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
}
