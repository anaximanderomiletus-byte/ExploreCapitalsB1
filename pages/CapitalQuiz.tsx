
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Globe2, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function CapitalQuiz() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shuffledCountries, setShuffledCountries] = useState<Country[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ country: Country; options: Country[] } | null>(null);
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

  const handleAnswer = (capital: string) => {
    if (selectedAnswer || !currentQuestion) return;
    setSelectedAnswer(capital);
    const correct = capital === currentQuestion.country.capital;
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
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden">
        <SEO title="Capital Quiz" description="Identify the world capitals in 60 seconds." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Globe2 size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Capital Quiz</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Identify the world capitals in 60 seconds.</p>
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
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent"><Trophy size={32} /></div>
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
      <SEO title="Playing Capital Quiz" description="Select the correct capital city." />
      <div className="max-w-2xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
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

      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col min-h-0 bg-white rounded-3xl border border-gray-100 p-6 overflow-hidden relative">
         <div className="flex flex-col items-center justify-center flex-1 min-h-0 pb-4 overflow-hidden">
            <span className="text-7xl md:text-8xl mb-2 drop-shadow-sm select-none">{currentQuestion.country.flag}</span>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-sans">Capital of</p>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-text text-center px-2 leading-tight max-w-full break-words">
              {currentQuestion.country.name}
            </h3>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.capital;
              const isCorrect = option.capital === currentQuestion.country.capital;
              let stateStyles = "bg-white border-2 border-gray-200 text-text active:bg-gray-50";
              if (selectedAnswer) {
                if (isCorrect) stateStyles = "bg-green-50 border-4 border-[#22c55e] text-green-900";
                else if (isSelected) stateStyles = "bg-red-50 border-4 border-red-600 text-red-900";
                else stateStyles = "bg-gray-50 border-2 border-gray-400 text-gray-300 opacity-40";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.capital)}
                  disabled={!!selectedAnswer}
                  className={`relative p-5 rounded-2xl font-display font-bold text-lg transition-all duration-75 flex items-center justify-center min-h-[72px] ${stateStyles}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="px-2 text-center leading-tight">{option.capital}</span>
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
