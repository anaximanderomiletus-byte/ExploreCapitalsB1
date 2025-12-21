
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Flag, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Helper to calculate ISO code from emoji flag
const getCountryCode = (emoji: string) => {
    return Array.from(emoji)
        .map(char => String.fromCharCode(char.codePointAt(0)! - 127397).toLowerCase())
        .join('');
};

export default function FlagFrenzy() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledCountries, setShuffledCountries] = useState<Country[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ country: Country; options: Country[] } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

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
    const distractors: Country[] = [];
    while (distractors.length < 3) {
      const c = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
      if (c.id !== target.id && !distractors.find(d => d.id === c.id)) {
        distractors.push(c);
      }
    }
    const options = shuffle([target, ...distractors]);
    setCurrentQuestion({ country: target, options });
    setSelectedAnswer(null);
    setImgError(false);
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

  const handleAnswer = (countryName: string) => {
    if (selectedAnswer || !currentQuestion) return; 
    setSelectedAnswer(countryName);
    const correct = countryName === currentQuestion.country.name;
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

  const currentCountryCode = useMemo(() => {
    if (!currentQuestion) return '';
    return getCountryCode(currentQuestion.country.flag);
  }, [currentQuestion]);

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <SEO title="Flag Frenzy" description="Match the flag to the correct nation in 60 seconds." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-accent"><Flag size={32} /></div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Flag Frenzy</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">Match nations to their visual identity.</p>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play</Button>
            <Link to="/games" className="w-full">
              <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary"><Trophy size={32} /></div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Time's Up!</h1>
          <div className="text-6xl font-display font-bold text-primary mb-10">{score}</div>
          <div className="flex flex-col gap-6">
            <Button onClick={startGame} size="lg" className="w-full h-14">Play Again</Button>
            <Link to="/games" className="w-full">
               <Button variant="secondary" size="lg" className="w-full h-14">Back to Games</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <div className="max-w-2xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors duration-75"><ArrowLeft size={20} /></Link>
         <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" /><span className="font-display font-bold text-xl text-text tabular-nums">{score}</span>
           </div>
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl shadow-inner ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
              <Timer size={18} /><span className="font-display font-bold text-xl tabular-nums min-w-[30px]">{timeLeft}</span>
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col min-h-0 bg-white rounded-3xl border border-gray-100 p-6 md:p-10 overflow-hidden relative">
         <div className="flex flex-col items-center justify-center flex-1 min-h-0 pb-4 overflow-hidden">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 shrink-0">Analyze National Flag</p>
            <div className="flex-1 flex items-center justify-center overflow-hidden w-full min-h-[150px] relative">
              {!imgError ? (
                <img 
                  src={`https://flagcdn.com/w640/${currentCountryCode}.png`}
                  alt="Target Flag"
                  className="max-w-full max-h-[180px] object-contain animate-in zoom-in duration-500"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-8xl md:text-[8rem] select-none transform transition-transform duration-75 animate-in zoom-in duration-500">
                  {currentQuestion.country.flag}
                </span>
              )}
            </div>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.name;
              const isCorrect = option.name === currentQuestion.country.name;
              let stateStyles = "bg-white border-2 border-gray-200 text-text active:bg-gray-50";
              if (selectedAnswer) {
                if (isCorrect) stateStyles = "bg-green-50 border-4 border-[#22c55e] text-green-900";
                else if (isSelected) stateStyles = "bg-red-50 border-4 border-red-600 text-red-900";
                else stateStyles = "bg-gray-50 border-2 border-gray-400 text-gray-300 opacity-40";
              }
              return (
                <button key={option.id} onClick={() => handleAnswer(option.name)} disabled={!!selectedAnswer} className={`relative p-5 rounded-2xl font-display font-bold text-lg transition-all duration-75 flex items-center justify-center min-h-[72px] ${stateStyles}`}>
                  <span className="px-2 text-center truncate leading-tight">{option.name}</span>
                  {selectedAnswer && isCorrect && <Check size={20} className="absolute right-4 text-[#22c55e]" />}
                  {selectedAnswer && isSelected && !isCorrect && <X size={20} className="absolute right-4 text-red-600" />}
                </button>
              );
            })}
         </div>
      </div>
    </div>
  );
}
