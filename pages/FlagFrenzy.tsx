
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Flag, Check, X } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function FlagFrenzy() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Queue System State
  const [shuffledCountries, setShuffledCountries] = useState<Country[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState<{ country: Country; options: Country[] } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null); // country name
  
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

  // Load a specific question based on the country target
  const setupQuestion = (target: Country) => {
    // Get 3 distractors
    const distractors: Country[] = [];
    while (distractors.length < 3) {
      const c = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
      // Ensure distractor is not the target and not already in list
      if (c.id !== target.id && !distractors.find(d => d.id === c.id)) {
        distractors.push(c);
      }
    }
    // Create options from the distractors and correct answer
    const options = shuffle([target, ...distractors]);
    
    setCurrentQuestion({ country: target, options });
    setSelectedAnswer(null);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    
    // Create a new shuffled queue of questions to ensure no repeats
    const queue = shuffle([...MOCK_COUNTRIES]);
    setShuffledCountries(queue);
    setQuestionIndex(0);
    
    // Load the first question
    if (queue.length > 0) {
      setupQuestion(queue[0]);
    }
  };

  const handleAnswer = (countryName: string) => {
    if (selectedAnswer || !currentQuestion) return; // Prevent double clicks

    setSelectedAnswer(countryName);
    const correct = countryName === currentQuestion.country.name;

    if (correct) {
      setScore(s => s + 10);
    }

    // Wait 1s then next question
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      
      if (nextIndex < shuffledCountries.length) {
        setQuestionIndex(nextIndex);
        setupQuestion(shuffledCountries[nextIndex]);
      } else {
        setGameState('finished');
      }
    }, 1000);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO 
            title="Flag Frenzy"
            description="Match the flag to its nation. You have 1 minute to prove your expertise."
        />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
            <Flag size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-4">Flag Frenzy</h1>
          <p className="text-gray-500 text-lg mb-8">
            Match the flag to its nation. You have 1 minute to prove your expertise.
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
        <SEO title="Flag Frenzy Results" description="See your score for the Flag Frenzy game." />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Time's Up!</h1>
          <p className="text-gray-500 mb-6">You scored</p>
          
          <div className="text-6xl font-display font-bold text-primary mb-8">
            {score}
            <span className="text-lg text-gray-400 font-medium ml-2">pts</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Consistent "Play Again" button with NO GLOW as requested */}
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

  // Loading state fallback
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-surface pt-28 pb-12 px-6">
      <SEO 
        title="Playing Flag Frenzy"
        description="Select the correct country name for the displayed flag."
      />
      <div className="max-w-2xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-premium p-8 mb-6 border border-gray-100 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
           <div className="mb-8">
              <h2 className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm mb-4">Identify this flag</h2>
              <div className="h-40 flex items-center justify-center">
                <span className="text-9xl transform hover:scale-110 transition-transform cursor-default select-none filter drop-shadow-sm">
                  {currentQuestion.country.flag}
                </span>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.name;
                
                let btnStyle = "bg-white border-2 border-gray-100 hover:border-primary hover:bg-blue-50/50 text-gray-700";
                let icon = null;

                if (selectedAnswer) {
                  if (option.name === currentQuestion.country.name) {
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
                    style={{ WebkitTapHighlightColor: 'transparent' }}
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
