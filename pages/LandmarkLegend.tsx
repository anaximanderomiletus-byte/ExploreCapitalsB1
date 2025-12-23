
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, Camera, Check, X, MapPin } from 'lucide-react';
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
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
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
    } else if (timeLeft === 0) {
      setGameState('finished');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const generateQuestions = () => {
    const validCountries = MOCK_COUNTRIES.filter(c => staticTours[c.name]);
    const shuffledValid = shuffle(validCountries);
    
    const newQuestions: Question[] = shuffledValid.map(country => {
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

    setQuestions(newQuestions);
    if (newQuestions.length > 0) {
        setCurrentQuestion(newQuestions[0]);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    setQuestionIndex(0);
    generateQuestions();
    setSelectedAnswerId(null);
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
    }, 1200);
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <SEO title="Landmark Legend" description="Identify countries by their landmarks." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Camera size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Landmark Legend</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Name the country where each famous landmark is located.</p>
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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-10 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent"><Trophy size={32} /></div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Epic Expedition!</h1>
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
      <div className="max-w-4xl mx-auto w-full flex shrink-0 items-center justify-between mb-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
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
                  className={`relative p-5 rounded-2xl font-display font-bold text-lg flex items-center justify-between min-h-[72px] transition-all ${selectedAnswerId ? 'duration-500' : 'duration-0'} ${stateStyles}`}
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
