
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Network, Check, X, AlertCircle } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import { Country } from '../types';
import SEO from '../components/SEO';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function KnowYourNeighbor() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Game Logic State
  const [validCountries, setValidCountries] = useState<Country[]>([]);
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<string[]>([]); // Array of country names
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize valid countries (those with borders)
  useEffect(() => {
    const valid = MOCK_COUNTRIES.filter(c => c.borders && c.borders.length > 0);
    setValidCountries(valid);
  }, []);

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

  const generateRound = () => {
    if (validCountries.length === 0) return;

    // Pick random target
    const target = validCountries[Math.floor(Math.random() * validCountries.length)];
    setTargetCountry(target);
    setSelectedOptions([]);
    setRoundResult(null);
    setFeedback(null);

    // Get Actual Neighbors
    const neighbors = target.borders || [];
    
    // Get Distractors (countries that are NOT the target and NOT neighbors)
    const potentialDistractors = MOCK_COUNTRIES.filter(c => 
      c.name !== target.name && !neighbors.includes(c.name)
    ).map(c => c.name);

    const shuffledDistractors = shuffle(potentialDistractors);
    
    // Select a number of distractors to fill the grid (e.g. total 9-12 items)
    // If a country has many borders (e.g. 14), we show more options.
    // Base amount: Neighbors + 4 to 6 distractors.
    const numDistractors = Math.max(4, 12 - neighbors.length); 
    const roundDistractors = shuffledDistractors.slice(0, numDistractors);

    // Combine and Shuffle
    const roundOptions = shuffle([...neighbors, ...roundDistractors]);
    setOptions(roundOptions);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateRound();
  };

  const toggleOption = (countryName: string) => {
    if (roundResult) return; // Prevent changing after submission

    setSelectedOptions(prev => {
      if (prev.includes(countryName)) {
        return prev.filter(c => c !== countryName);
      } else {
        return [...prev, countryName];
      }
    });
  };

  const submitAnswer = () => {
    if (!targetCountry || !targetCountry.borders) return;

    const actualNeighbors = targetCountry.borders;
    const selected = selectedOptions;

    // Logic:
    // 1. Must select ALL actual neighbors present in the options list.
    //    (Note: In a robust app we ensure all neighbors are in MOCK_COUNTRIES, here we assume options contain all neighbors)
    // 2. Must NOT select any non-neighbors.
    
    const missedNeighbors = actualNeighbors.filter(n => !selected.includes(n));
    const wrongSelections = selected.filter(s => !actualNeighbors.includes(s));

    if (missedNeighbors.length === 0 && wrongSelections.length === 0) {
      // Perfect
      setScore(s => s + 20); // Higher points for harder logic
      setRoundResult('correct');
      setFeedback("Perfect! You identified all borders.");
      setTimeout(generateRound, 1500);
    } else {
      setRoundResult('incorrect');
      if (missedNeighbors.length > 0 && wrongSelections.length > 0) {
        setFeedback(`Missed ${missedNeighbors.length} and picked ${wrongSelections.length} wrong.`);
      } else if (missedNeighbors.length > 0) {
        setFeedback(`You missed ${missedNeighbors.length} neighbor(s).`);
      } else {
        setFeedback(`You selected ${wrongSelections.length} incorrect country(s).`);
      }
      setTimeout(generateRound, 2500); // Longer delay to read feedback
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO 
            title="Know Your Neighbor"
            description="Can you name every bordering country? Test your border knowledge in this challenging puzzle."
        />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Network size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-4">Know Your Neighbor</h1>
          <p className="text-gray-500 text-lg mb-8">
            Identify <strong>every</strong> bordering country for the displayed nation. Only countries with land borders are included.
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
        <SEO title="Know Your Neighbor Results" description="See your score for the Know Your Neighbor game." />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Time's Up!</h1>
          <p className="text-gray-500 mb-6">You scored</p>
          
          <div className="text-6xl font-display font-bold text-primary mb-8">
            {score}
            <span className="text-lg text-gray-400 font-medium ml-2">pts</span>
          </div>

          <div className="flex flex-col gap-4">
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

  if (!targetCountry) return null;

  return (
    <div className="min-h-screen bg-surface pt-20 pb-6 px-4 md:px-6 flex flex-col justify-center">
      <SEO 
        title="Playing Know Your Neighbor"
        description="Select all the bordering countries."
      />
      <div className="max-w-3xl mx-auto w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
           <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
             <ArrowLeft size={20} />
           </Link>
           
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-md text-primary">
                  <Trophy size={16} />
                </div>
                <span className="font-display font-bold text-lg text-text">{score}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
                  <Timer size={16} />
                </div>
                <span className={`font-display font-bold text-lg tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-text'}`}>
                  {formatTime(timeLeft)}
                </span>
             </div>
           </div>
        </div>

        {/* Unified Game Board */}
        <div className="bg-white rounded-3xl shadow-premium p-5 md:p-6 border border-gray-100 text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
           
           {/* Target Header */}
           <div className="mb-2">
              <span className="text-6xl md:text-7xl drop-shadow-sm filter hover:scale-105 transition-transform cursor-default select-none block mb-2">
                {targetCountry.flag}
              </span>
              <h2 className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Select Neighbors of</h2>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-text leading-tight">{targetCountry.name}</h3>
           </div>
           
           {/* Instructions Banner */}
           <div className="mb-4 p-2 bg-blue-50/80 rounded-xl border border-blue-100 inline-flex items-center gap-2 text-blue-800 max-w-lg mx-auto">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <p className="text-[10px] md:text-xs font-medium leading-relaxed text-left md:text-center">
                 Select <strong>ALL</strong> countries that share a land border.
              </p>
           </div>

           {/* Options Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
             {options.map((countryName) => {
               const isSelected = selectedOptions.includes(countryName);
               const isActualNeighbor = targetCountry.borders?.includes(countryName);
               
               let btnStyle = "";
               let icon = null;
               
               // Controls if we show the 3D shadow/active press
               let is3D = !roundResult; 

               if (roundResult) {
                  // Reveal Phase (Flat Buttons for results)
                  if (isActualNeighbor && isSelected) {
                     // Correctly Identified -> Green
                     btnStyle = "bg-green-50 border-2 border-green-500 text-green-800 shadow-none";
                     icon = <Check size={16} className="text-green-600" />;
                  } else if (isActualNeighbor && !isSelected) {
                     // Missed Neighbor -> Amber
                     btnStyle = "bg-amber-50 border-2 border-amber-500 text-amber-900 shadow-none";
                     icon = <AlertCircle size={16} className="text-amber-600" />;
                  } else if (isSelected && !isActualNeighbor) {
                     // Wrong Selection -> Red
                     btnStyle = "bg-red-50 border-2 border-red-500 text-red-800 shadow-none";
                     icon = <X size={16} className="text-red-600" />;
                  } else {
                     // Neutral -> Fade out
                     btnStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-50 shadow-none";
                  }
               } else {
                  // Selection Phase (3D Buttons)
                  if (isSelected) {
                     // Selected State: Blue 3D button (Blue bg, Blue border, Blue shadow)
                     btnStyle = "bg-blue-50 border-2 border-primary text-primary shadow-[0_4px_0_#4A8BB5]";
                  } else {
                     // Default State: White 3D button
                     btnStyle = "bg-white border-2 border-gray-100 hover:border-primary hover:bg-blue-50/50 text-gray-700 shadow-[0_4px_0_#E5E7EB]";
                  }
               }

               return (
                 <button
                   key={countryName}
                   onClick={() => toggleOption(countryName)}
                   disabled={!!roundResult}
                   className={`relative p-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-between min-h-[48px] text-left 
                   ${btnStyle} 
                   ${is3D ? 'active:translate-y-[4px] active:shadow-none' : ''}`}
                 >
                   <span className="leading-tight pr-1 line-clamp-2">{countryName}</span>
                   {icon}
                 </button>
               );
             })}
           </div>

           {/* Footer Actions / Feedback */}
           <div>
             {roundResult ? (
               <div className={`p-3 rounded-xl border animate-in fade-in slide-in-from-bottom-2 ${roundResult === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <div className="font-bold flex items-center justify-center gap-2 mb-1 text-base">
                    {roundResult === 'correct' ? <Check size={20} /> : <X size={20} />}
                    {roundResult === 'correct' ? 'Correct!' : 'Incorrect'}
                  </div>
                  {feedback && <div className="text-xs opacity-90">{feedback}</div>}
               </div>
             ) : (
               <Button onClick={submitAnswer} disabled={selectedOptions.length === 0} className="w-full max-w-sm mx-auto h-12 text-sm" size="md">
                 Submit Answer
               </Button>
             )}
           </div>

        </div>
      </div>
    </div>
  );
}
