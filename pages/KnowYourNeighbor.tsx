
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Network, Check, X, AlertCircle } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function KnowYourNeighbor() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [validCountries, setValidCountries] = useState<Country[]>([]);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const valid = MOCK_COUNTRIES.filter(c => c.borders && c.borders.length > 0);
    setValidCountries(valid);
  }, []);

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

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const generateRound = () => {
    if (validCountries.length === 0) return;
    const target = validCountries[Math.floor(Math.random() * validCountries.length)];
    setTargetCountry(target);
    setSelectedOptions([]);
    setRoundResult(null);
    setFeedback(null);

    const neighbors = target.borders || [];
    const potentialDistractors = MOCK_COUNTRIES.filter(c => 
      c.name !== target.name && !neighbors.includes(c.name)
    ).map(c => c.name);
    const shuffledDistractors = shuffle(potentialDistractors);
    const numDistractors = Math.max(4, 12 - neighbors.length); 
    const roundDistractors = shuffledDistractors.slice(0, numDistractors);
    setOptions(shuffle([...neighbors, ...roundDistractors]));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateRound();
  };

  const toggleOption = (countryName: string) => {
    if (roundResult) return; 
    setSelectedOptions(prev => prev.includes(countryName) ? prev.filter(c => c !== countryName) : [...prev, countryName]);
  };

  const submitAnswer = () => {
    if (!targetCountry || !targetCountry.borders) return;
    const actualNeighbors = targetCountry.borders;
    const selected = selectedOptions;
    const missedNeighbors = actualNeighbors.filter(n => !selected.includes(n));
    const wrongSelections = selected.filter(s => !actualNeighbors.includes(s));

    if (missedNeighbors.length === 0 && wrongSelections.length === 0) {
      setScore(s => s + 20);
      setRoundResult('correct');
      setFeedback("Perfect!");
      setTimeout(generateRound, 1500);
    } else {
      setRoundResult('incorrect');
      setFeedback(`${missedNeighbors.length} missed, ${wrongSelections.length} wrong.`);
      setTimeout(generateRound, 2500);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <SEO title="Know Your Neighbor" description="Identify all the bordering countries." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Network size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Know Your Neighbor</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Identify <strong>every</strong> bordering country for the displayed nation.</p>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
            <Link 
              to="/games" 
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-text transition-colors font-display font-bold text-sm group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent ring-4 ring-accent/5">
            <Trophy size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Finished!</h1>
          <p className="text-gray-500 mb-4 font-sans">Total Points</p>
          <div className="text-5xl font-display font-bold text-primary mb-10">{score}</div>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
            <Link 
              to="/games" 
              className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-text transition-colors font-display font-bold text-sm group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!targetCountry) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <SEO title="Playing Know Your Neighbor" description="Select all the bordering countries." />
      <div className="max-w-2xl mx-auto w-full flex shrink-0 items-center justify-between mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors duration-75">
           <ArrowLeft size={20} />
         </Link>
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              <span className="font-display font-bold text-lg tabular-nums">{score}</span>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-scary-pulse ring-2 ring-red-500' : 'bg-blue-50 text-primary'}`}>
              <Timer size={16} className={timeLeft < 10 ? 'animate-spin-slow' : ''} />
              <span className="font-display font-bold text-lg tabular-nums">{formatTime(timeLeft)}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col min-h-0 bg-white rounded-3xl border border-gray-100 p-4 md:p-6 overflow-hidden">
           <div className="text-center mb-4 shrink-0 overflow-hidden">
              <span className="text-5xl md:text-6xl mb-1 block drop-shadow-sm select-none">{targetCountry.flag}</span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-text leading-tight px-2">{targetCountry.name}</h3>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mt-1 font-sans">Select all land neighbors</p>
           </div>
           
           <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-1 pb-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
               {options.map((countryName) => {
                 const isSelected = selectedOptions.includes(countryName);
                 const isActualNeighbor = targetCountry.borders?.includes(countryName);
                 const isIncorrectSelection = isSelected && !isActualNeighbor;
                 
                 let btnStyle = "bg-white border-2 border-gray-200 text-text active:bg-gray-50";
                 let icon = null;

                 if (roundResult) {
                    if (isActualNeighbor && isSelected) {
                       btnStyle = "bg-green-50 border-2 border-[#22c55e] text-green-800";
                       icon = <Check size={14} className="text-[#22c55e]" />;
                    } else if (isActualNeighbor && !isSelected) {
                       btnStyle = "bg-amber-50 border-2 border-amber-500 text-amber-900";
                       icon = <AlertCircle size={14} className="text-amber-600" />;
                    } else if (isSelected && !isActualNeighbor) {
                       btnStyle = "bg-red-50 border-2 border-red-600 text-red-800";
                       icon = <X size={14} className="text-red-600" />;
                    } else {
                       btnStyle = "bg-gray-50 border-2 border-gray-400 text-gray-300 opacity-40";
                    }
                 } else {
                    if (isSelected) {
                       btnStyle = "bg-blue-50 border-2 border-primary text-primary";
                    }
                 }

                 return (
                   <button
                     key={countryName}
                     onClick={() => toggleOption(countryName)}
                     disabled={!!roundResult}
                     className={`relative p-2.5 rounded-xl font-bold text-xs flex items-center justify-between min-h-[48px] text-left transition-all ${roundResult || isSelected ? 'duration-250 ease-out' : 'duration-0'} ${btnStyle} ${roundResult && isIncorrectSelection ? 'animate-shake' : ''}`}
                     style={{ WebkitTapHighlightColor: 'transparent' }}
                   >
                     <span className="leading-tight pr-1 line-clamp-2 font-sans">{countryName}</span>
                     {icon}
                   </button>
                 );
               })}
             </div>
           </div>

           <div className="shrink-0 pt-2 border-t border-gray-50">
             {roundResult ? (
               <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-sans ${roundResult === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  {roundResult === 'correct' ? <Check size={18} /> : <X size={18} />}
                  <span className="font-bold text-sm">{feedback}</span>
               </div>
             ) : (
               <Button onClick={submitAnswer} disabled={selectedOptions.length === 0} className="w-full h-14" size="lg">Submit Selection</Button>
             )}
           </div>
      </div>
    </div>
  );
}
