
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Camera, Check, X, MapPin, Loader2 } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import { staticTours } from '../data/staticTours';
import { STATIC_IMAGES } from '../data/images';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface Question {
    country: Country;
    landmarkName: string;
    imageUrl: string;
    options: Country[];
}

export default function LandmarkLegend() {
  const [gameState, setGameState] = useState<'start' | 'preparing' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Generate a finite list of questions for this session (Limit to 15 for faster loading)
  const getQuestionsList = useCallback((): Question[] => {
    const validCountries = MOCK_COUNTRIES.filter(c => staticTours[c.name]);
    const shuffledValid = shuffle(validCountries).slice(0, 15); // Limit to 15 questions per game
    
    return shuffledValid.map(country => {
        const tour = staticTours[country.name];
        const stop = tour.stops[Math.floor(Math.random() * tour.stops.length)];
        const landmarkName = stop.stopName;
        const imageUrl = STATIC_IMAGES[stop.imageKeyword || landmarkName] || STATIC_IMAGES[country.name];
        
        const distractors: Country[] = [];
        while (distractors.length < 3) {
            const c = MOCK_COUNTRIES[Math.floor(Math.random() * MOCK_COUNTRIES.length)];
            if (c.id !== country.id && !distractors.find(d => d.id === c.id)) {
                distractors.push(c);
            }
        }
        
        return {
            country,
            landmarkName,
            imageUrl,
            options: shuffle([country, ...distractors])
        };
    }).filter(q => q.imageUrl);
  }, []);

  const startGame = async () => {
    setGameState('preparing');
    const newQuestions = getQuestionsList();
    
    // Pre-load all images for the current set
    const imagePromises = newQuestions.map(q => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = q.imageUrl;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to not block the game flow
      });
    });

    // Wait for all assets to be cached in browser memory
    await Promise.all(imagePromises);

    setQuestions(newQuestions);
    setScore(0);
    setTimeLeft(60);
    setQuestionIndex(0);
    setCurrentQuestion(newQuestions[0]);
    setSelectedAnswerId(null);
    setGameState('playing');
  };

  const handleAnswer = (countryId: string) => {
    if (selectedAnswerId || !currentQuestion) return;
    setSelectedAnswerId(countryId);
    const correct = countryId === currentQuestion.country.id;
    if (correct) setScore(s => s + 20);
    
    setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < questions.length) {
        setQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setSelectedAnswerId(null);
      } else {
        setGameState('finished');
      }
    }, 800);
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <SEO title="Landmark Legend" description="Identify countries by their landmarks." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Camera size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Landmark Legend</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Identify the country from a famous landmark image. Images are pre-loaded for seamless play.</p>
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

  if (gameState === 'preparing') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <div className="text-center">
          <div className="relative mb-6 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-premium relative z-10">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full"></div>
          </div>
          <h2 className="text-2xl font-display font-bold text-text mb-2">Preparing Expedition</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Caching Landmarks...</p>
          <Link 
            to="/games" 
            className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-text transition-colors font-display font-bold text-sm group mt-12"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans relative">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent"><Trophy size={32} /></div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Epic Expedition!</h1>
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

  if (!currentQuestion) return null;

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
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

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col md:flex-row gap-6 min-h-0 bg-white rounded-3xl border border-gray-100 p-4 md:p-6 overflow-hidden relative shadow-premium">
         <div className="flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img 
                    src={currentQuestion.imageUrl} 
                    alt="Landmark" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-white flex items-center gap-3">
                   <div className="p-2 bg-primary/20 rounded-lg"><MapPin size={20} className="text-primary" /></div>
                   <span className="font-display font-bold text-lg md:text-xl drop-shadow-md truncate">{currentQuestion.landmarkName}</span>
                </div>
            </div>
         </div>

         <div className="w-full md:w-80 flex flex-col justify-center gap-3 shrink-0">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center mb-1 font-sans">Which country is this?</p>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswerId === option.id;
              const isCorrect = option.id === currentQuestion.country.id;
              const isWrong = isSelected && !isCorrect;
              
              let stateStyles = "bg-white border-2 border-gray-200 text-text hover:border-primary/50 hover:bg-blue-50/20";
              
              if (selectedAnswerId) {
                if (isCorrect) stateStyles = "bg-green-50 border-2 border-[#22c55e] text-green-900";
                else if (isSelected) stateStyles = "bg-red-50 border-2 border-red-600 text-red-900";
                else stateStyles = "bg-gray-50 border-2 border-gray-200 text-gray-300 opacity-40";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={!!selectedAnswerId}
                  className={`relative p-5 rounded-2xl font-display font-bold text-lg flex items-center justify-between min-h-[72px] transition-all ${selectedAnswerId ? 'duration-250 ease-out' : 'duration-0'} ${stateStyles} ${isWrong ? 'animate-shake' : ''}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="text-left leading-tight truncate pr-2">{option.name}</span>
                  <span className="text-2xl">{option.flag}</span>
                </button>
              );
            })}
         </div>
      </div>
    </div>
  );
}
