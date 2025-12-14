
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Network, Building2 } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import SEO from '../components/SEO';

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

interface GameCard {
  id: string;
  label: string;
  type: 'country' | 'capital';
  countryId: string;
  isMatched: boolean;
  isSelected: boolean;
  isWrong: boolean;
  icon?: React.ReactNode;
}

export default function CapitalConnection() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Board State
  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const generateBoard = () => {
    // Pick 6 random countries
    const roundCountries = shuffle(MOCK_COUNTRIES).slice(0, 6);
    
    const newCards: GameCard[] = [];
    
    roundCountries.forEach(country => {
      // Country Card
      newCards.push({
        id: `country-${country.id}`,
        label: country.name,
        type: 'country',
        countryId: country.id,
        isMatched: false,
        isSelected: false,
        isWrong: false,
        icon: <span className="text-2xl md:text-3xl leading-none drop-shadow-sm">{country.flag}</span>
      });
      
      // Capital Card
      newCards.push({
        id: `capital-${country.id}`,
        label: country.capital,
        type: 'capital',
        countryId: country.id,
        isMatched: false,
        isSelected: false,
        isWrong: false,
        icon: <Building2 size={16} className="text-gray-400" />
      });
    });

    setCards(shuffle(newCards));
    setSelectedIds([]);
    setIsProcessing(false);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateBoard();
  };

  const handleCardClick = (cardId: string) => {
    if (isProcessing || gameState !== 'playing') return;
    
    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isSelected) return;

    // Select the card
    const newSelectedIds = [...selectedIds, cardId];
    setSelectedIds(newSelectedIds);
    
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isSelected: true } : c));

    // If 2 cards selected, check match
    if (newSelectedIds.length === 2) {
      setIsProcessing(true);
      const card1 = cards.find(c => c.id === newSelectedIds[0]);
      const card2 = clickedCard; 

      if (card1 && card2) {
        if (card1.countryId === card2.countryId) {
          // MATCH
          setTimeout(() => {
            setCards(prev => prev.map(c => 
              (c.id === card1.id || c.id === card2.id) 
                ? { ...c, isMatched: true, isSelected: false } 
                : c
            ));
            setScore(s => s + 10);
            setSelectedIds([]);
            setIsProcessing(false);

            // Check if board cleared
            setCards(currentCards => {
               const allMatched = currentCards.every(c => c.isMatched || c.id === card1.id || c.id === card2.id);
               if (allMatched) {
                 setTimeout(generateBoard, 500);
               }
               return currentCards;
            });
          }, 300);
        } else {
          // MISMATCH
          setTimeout(() => {
            setCards(prev => prev.map(c => 
              (c.id === card1.id || c.id === card2.id) 
                ? { ...c, isWrong: true } 
                : c
            ));
          }, 300);

          setTimeout(() => {
            setCards(prev => prev.map(c => 
              (c.id === card1.id || c.id === card2.id) 
                ? { ...c, isSelected: false, isWrong: false } 
                : c
            ));
            setSelectedIds([]);
            setIsProcessing(false);
          }, 1000);
        }
      }
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-12 px-6 flex items-center justify-center">
        <SEO 
            title="Capital Connection"
            description="Match countries to their capitals in a race against time."
        />
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <Network size={40} />
          </div>
          <h1 className="text-4xl font-display font-bold text-text mb-4">Capital Connection</h1>
          <p className="text-gray-500 text-lg mb-8">
            Connect countries to their capitals. Clear the board as fast as you can!
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
        <SEO title="Capital Connection Results" description="See your score." />
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

  return (
    <div className="min-h-screen bg-surface pt-24 md:pt-28 pb-12 px-3 md:px-6">
      <SEO 
        title="Playing Capital Connection"
        description="Match the country to its capital."
      />
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100">
           <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
             <ArrowLeft size={20} className="md:w-6 md:h-6" />
           </Link>
           
           <div className="flex items-center gap-4 md:gap-6">
             <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-md text-primary">
                  <Trophy size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <span className="font-display font-bold text-lg md:text-xl text-text">{score}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
                  <Timer size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <span className={`font-display font-bold text-lg md:text-xl tabular-nums ${timeLeft < 10 ? 'text-red-500' : 'text-text'}`}>
                  {formatTime(timeLeft)}
                </span>
             </div>
           </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {cards.map(card => {
                let cardStyle = "bg-white border-2 border-gray-100 hover:border-primary/50 text-gray-700 shadow-sm";
                
                if (card.isMatched) {
                    // Matched: Green, faded, disabled
                    cardStyle = "bg-green-50 border-2 border-green-500 opacity-50 scale-95 cursor-default";
                } else if (card.isWrong) {
                    // Wrong: Red shake
                    cardStyle = "bg-red-50 border-2 border-red-500 text-red-800 animate-pulse";
                } else if (card.isSelected) {
                    // Selected: Blue active
                    cardStyle = "bg-blue-50 border-2 border-primary text-primary shadow-md -translate-y-1";
                }

                return (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.isMatched}
                        // Mobile optimized: shorter height (h-24), smaller text (text-xs/sm), tighter padding (p-2)
                        className={`h-24 md:h-32 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col items-center justify-center text-center transition-all duration-200 ${cardStyle}`}
                    >
                        <div className={`mb-1 md:mb-2 transform scale-75 md:scale-100 ${card.type === 'country' ? '' : 'opacity-50'}`}>
                            {card.icon}
                        </div>
                        <span className="font-bold leading-tight text-xs md:text-base line-clamp-3">
                            {card.label}
                        </span>
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
}
