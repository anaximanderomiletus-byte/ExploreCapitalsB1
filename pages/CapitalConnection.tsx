
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowLeft, RefreshCw, Network, Building2 } from 'lucide-react';
import { MOCK_COUNTRIES } from '../constants';
import Button from '../components/Button';
import SEO from '../components/SEO';

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
  
  const [cards, setCards] = useState<GameCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const generateBoard = () => {
    const roundCountries = shuffle(MOCK_COUNTRIES).slice(0, 6);
    const newCards: GameCard[] = [];
    roundCountries.forEach(country => {
      newCards.push({
        id: `country-${country.id}`,
        label: country.name,
        type: 'country',
        countryId: country.id,
        isMatched: false,
        isSelected: false,
        isWrong: false,
        icon: <span className="text-2xl md:text-3xl leading-none drop-shadow-sm select-none">{country.flag}</span>
      });
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
    const newSelectedIds = [...selectedIds, cardId];
    setSelectedIds(newSelectedIds);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isSelected: true } : c));
    if (newSelectedIds.length === 2) {
      setIsProcessing(true);
      const card1 = cards.find(c => c.id === newSelectedIds[0]);
      const card2 = clickedCard; 
      if (card1 && card2) {
        if (card1.countryId === card2.countryId) {
          setTimeout(() => {
            setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true, isSelected: false } : c));
            setScore(s => s + 10);
            setSelectedIds([]);
            setIsProcessing(false);
            setCards(currentCards => {
               if (currentCards.every(c => c.isMatched || c.id === card1.id || c.id === card2.id)) setTimeout(generateBoard, 500);
               return currentCards;
            });
          }, 300);
        } else {
          setTimeout(() => {
            setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, isWrong: true } : c));
          }, 300);
          setTimeout(() => {
            setCards(prev => prev.map(c => (c.id === card1.id || c.id === card2.id) ? { ...c, isSelected: false, isWrong: false } : c));
            setSelectedIds([]);
            setIsProcessing(false);
          }, 1000);
        }
      }
    }
  };

  if (gameState === 'start') {
    return (
      <div className="h-[100dvh] bg-surface flex items-center justify-center px-4 overflow-hidden font-sans">
        <SEO title="Capital Connection" description="Match countries to their capitals." />
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Network size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Capital Link</h1>
          <p className="text-gray-500 text-sm mb-8 font-sans">Connect countries to their capitals.</p>
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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
            <Trophy size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-text mb-1">Board Cleared!</h1>
          <p className="text-gray-500 mb-4 font-sans">Total Score</p>
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

  return (
    <div className="h-[100dvh] bg-surface flex flex-col p-4 overflow-hidden font-sans">
      <SEO title="Playing Capital Connection" description="Match the country to its capital." />
      <div className="max-w-4xl mx-auto w-full flex shrink-0 items-center justify-between mb-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mt-16 md:mt-20">
         <Link to="/games" className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
           <ArrowLeft size={18} />
         </Link>
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 font-bold"><Trophy size={14} className="text-yellow-500" /> <span className="tabular-nums">{score}</span></div>
           <div className={`px-2 py-0.5 rounded font-bold tabular-nums ${timeLeft < 10 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-primary'}`}>
             {formatTime(timeLeft)}
           </div>
         </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 min-h-0 overflow-y-auto no-scrollbar pb-4">
          {cards.map(card => {
              let cardStyle = "bg-white border-2 border-gray-100 text-text active:bg-gray-50";
              if (card.isMatched) {
                  cardStyle = "bg-green-50 border-2 border-green-500 opacity-40 cursor-default";
              } else if (card.isWrong) {
                  cardStyle = "bg-red-50 border-2 border-red-500 text-red-800 animate-pulse";
              } else if (card.isSelected) {
                  cardStyle = "bg-blue-50 border-2 border-primary text-primary";
              }

              return (
                  <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.isMatched}
                      className={`h-28 md:h-36 rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all duration-100 ${cardStyle}`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                      <div className={`mb-1 transform scale-90 ${card.type === 'country' ? '' : 'opacity-50'}`}>
                          {card.icon}
                      </div>
                      <span className="font-bold leading-tight text-[11px] md:text-sm line-clamp-3 font-sans">
                          {card.label}
                      </span>
                  </button>
              )
          })}
      </div>
    </div>
  );
}
