
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Globe, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const REGIONS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function RegionRoundup() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledCountries, setShuffledCountries] = useState<Country[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
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

  const setupQuestion = (target: Country) => {
    setCurrentCountry(target);
    setSelectedAnswer(null);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    const queue = shuffle([...MOCK_COUNTRIES]);
    setShuffledCountries(queue);
    setQuestionIndex(0);
    if (queue.length > 0) {
      setupQuestion(queue[0]);
    }
  };

  const handleAnswer = (region: string) => {
    if (selectedAnswer || !currentCountry) return;
    setSelectedAnswer(region);
    const correct = region === currentCountry.region;
    if (correct) setScore(s => s + 10);
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < shuffledCountries.length) {
        setQuestionIndex(nextIndex);
        setupQuestion(shuffledCountries[nextIndex]);
      } else {
        setGameState('finished');
      }
    }, 800);
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <SEO title="Region Roundup" description="Sort the countries into continents." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Globe size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Region Roundup</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Categorize each country into its correct continent as fast as you can.</p>
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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent"><Trophy size={32} /></div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Time's Up!</h1>
          <div className="text-6xl font-display font-bold text-primary mb-10">{score}</div>
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

  if (!currentCountry) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <div className="max-w-2xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors duration-75">
           <ArrowLeft size={20} />
         </Link>
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" />
              <span className="font-display font-bold text-xl text-text tabular-nums">{score}</span>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner transition-all duration-300 ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-scary-pulse ring-2 ring-red-500' : 'bg-blue-50 text-primary'}`}>
              <Timer size={18} className={timeLeft < 10 ? 'animate-spin-slow' : ''} />
              <span className="font-display font-bold text-xl tabular-nums min-w-[30px]">{timeLeft}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col min-h-0 bg-white rounded-3xl border border-gray-100 p-6 overflow-hidden relative">
         <div className="flex flex-col items-center justify-center flex-1 min-h-0 pb-4 overflow-hidden">
            <span className="text-8xl md:text-9xl mb-4 drop-shadow-sm select-none">{currentCountry.flag}</span>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-text text-center px-2 leading-tight max-w-full break-words">
              {currentCountry.name}
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4 font-sans">Select Continent</p>
         </div>

         <div className="grid grid-cols-2 gap-3 shrink-0">
            {REGIONS.map((region) => {
              const isSelected = selectedAnswer === region;
              const isCorrect = region === currentCountry.region;
              const isWrong = isSelected && !isCorrect;
              
              let stateStyles = "bg-white border-2 border-gray-200 text-text active:bg-gray-50";
              if (selectedAnswer) {
                if (isCorrect) stateStyles = "bg-green-50 border-2 border-[#22c55e] text-green-900";
                else if (isSelected) stateStyles = "bg-red-50 border-2 border-red-600 text-red-900";
                else stateStyles = "bg-gray-50 border-2 border-gray-400 text-gray-300 opacity-40";
              }

              return (
                <button
                  key={region}
                  onClick={() => handleAnswer(region)}
                  disabled={!!selectedAnswer}
                  className={`relative p-4 rounded-2xl font-display font-bold text-base flex items-center justify-center min-h-[64px] transition-all ${selectedAnswer ? 'duration-250 ease-out' : 'duration-0'} ${stateStyles} ${isWrong ? 'animate-shake' : ''}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="px-2 text-center leading-tight">{region}</span>
                  {selectedAnswer && isCorrect && <Check size={18} className="absolute right-3 text-[#22c55e]" />}
                  {selectedAnswer && isSelected && !isCorrect && <X size={18} className="absolute right-3 text-red-600" />}
                </button>
              );
            })}
         </div>
      </div>
    </div>
  );
}
