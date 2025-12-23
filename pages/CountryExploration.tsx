
import { AlertCircle, ArrowLeft, BrainCircuit, CheckCircle2, ChevronLeft, ChevronRight, Compass, Globe, HelpCircle, ImageOff, MapPin, Plane, RotateCcw, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useLayout } from '../context/LayoutContext';
import { MOCK_COUNTRIES } from '../constants';
import { getCountryTour, getGeneratedImage } from '../services/geminiService';
import { TourData } from '../types';

// Memoized Loading Visual
const LoadingVisual = React.memo(() => (
  <div className="relative mx-auto">
    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] flex items-center justify-center shadow-premium mb-8 z-10 relative border border-secondary/20">
      <Plane className="w-16 h-16 md:w-20 md:h-20 text-primary animate-color-pulse" strokeWidth={1.5} />
    </div>
    <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl animate-pulse"></div>
  </div>
));

// Container Wrapper
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, className = "", transparent = false }) => (
  <div 
    id="exploration-container"
    className={`min-h-screen z-40 relative ${transparent ? 'bg-transparent' : 'bg-surface'} ${className}`}
  >
    {children}
  </div>
);

// Image Helper
const ExpeditionVisual: React.FC<{ src: string | null; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
  if (src) {
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
  }

  return (
    <div className={`w-full h-full bg-blue-50 flex items-center justify-center flex-col p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-sm">
         <ImageOff className="text-blue-300 w-8 h-8" />
      </div>
      <span className="text-blue-300 font-bold uppercase tracking-widest text-xs">Visual Unavailable</span>
    </div>
  );
};

type ViewState = 'loading' | 'error' | 'intro' | 'tour' | 'quiz' | 'summary';

const CountryExploration: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const country = MOCK_COUNTRIES.find(c => c.id === id);
  const { setNavbarMode, setScrollThreshold } = useLayout();

  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState<TourData | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  
  const [introImage, setIntroImage] = useState<string | null>(null);
  const [stopImages, setStopImages] = useState<Record<number, string | null>>({});

  const [view, setView] = useState<ViewState>('loading');
  const [stepIndex, setStepIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  // Carousel Ref for Summary Screen
  const carouselRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<Record<number, boolean>>({});

  const loadingMessages = [
    "Curating itinerary...",
    "Securing local access...",
    "Reviewing historical archives...",
    "Finalizing details...",
  ];

  // Configure Navbar based on View
  useEffect(() => {
    if (view === 'tour') {
      setNavbarMode('hero');
      setScrollThreshold(window.innerHeight * 0.5); 
    } else {
      setNavbarMode('default');
      setScrollThreshold(20);
    }
  }, [view, setNavbarMode, setScrollThreshold]);

  useEffect(() => {
    return () => {
      setNavbarMode('default');
      setScrollThreshold(20);
    };
  }, [setNavbarMode, setScrollThreshold]);

  useEffect(() => {
    if (!country) return;

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 1500);

    const fetchContent = async () => {
      try {
        const data = await getCountryTour(country.name);

        if (data) {
          // Randomize quiz options order to prevent memorization by position
          const shuffledStops = data.stops.map(stop => ({
            ...stop,
            options: [...stop.options].sort(() => Math.random() - 0.5)
          }));
          const shuffledData = { ...data, stops: shuffledStops };

          setTourData(shuffledData);
          
          // Fetch static images
          let introImg = await getGeneratedImage(country.name, 'landscape');
          setIntroImage(introImg);

          const newStopImages: Record<number, string | null> = {};
          
          for (let i = 0; i < shuffledData.stops.length; i++) {
             const stop = shuffledData.stops[i];
             // Pass specific keyword for better static matching
             let img = await getGeneratedImage(stop.imageKeyword || stop.stopName, 'landmark');
             newStopImages[i] = img;
          }

          setStopImages(newStopImages);

          // Preload images to ensure they are cached before showing the tour
          const imagesToPreload = [introImg, ...Object.values(newStopImages)].filter((url): url is string => !!url);
          
          await Promise.all(imagesToPreload.map(src => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = resolve;
              img.onerror = resolve; // Resolve even on error to prevent blocking
            });
          }));

          setLoading(false);
          setView('intro');
        } else {
          setLoading(false);
          setView('error');
        }
      } catch (e) {
        console.error("Error loading tour content", e);
        setLoading(false);
        setView('error');
      }
      clearInterval(interval);
    };

    fetchContent();
    return () => clearInterval(interval);
  }, [country]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (view === 'tour') {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [view]);

  const startTour = () => {
    setTransitionDirection('forward');
    setIsTransitioning(true);
    setTimeout(() => {
      setView('tour');
      setStepIndex(0);
      setScrollY(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const nextStop = () => {
    if (!tourData) return;
    setTransitionDirection('forward');
    setIsTransitioning(true);

    if (stepIndex < tourData.stops.length - 1) {
      setTimeout(() => {
        setStepIndex(prev => prev + 1);
        setScrollY(0);
        window.scrollTo({ top: 0 });
      }, 500); 
    } else {
      setTimeout(() => {
        setView('quiz');
        setStepIndex(0);
        setScore(0);
        setQuizResults({});
        setSelectedOption(null);
        setIsCorrect(null);
        setFeedbackMessage(null);
        window.scrollTo({ top: 0 });
      }, 500);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); 
  };

  const prevStop = () => {
    setTransitionDirection('backward');
    setIsTransitioning(true);
    setTimeout(() => {
      if (stepIndex > 0) {
        setStepIndex(prev => prev - 1);
      } else {
        setView('intro');
      }
      setScrollY(0);
      window.scrollTo({ top: 0 });
    }, 500);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption || !tourData) return;
    
    setSelectedOption(option);
    const currentQuestion = tourData.stops[stepIndex];
    const correct = option === currentQuestion.answer;
    
    setIsCorrect(correct);
    setQuizResults(prev => ({ ...prev, [stepIndex]: correct }));

    if (correct) {
      setScore(s => s + 1);
      setFeedbackMessage(currentQuestion.explanation ? `Correct! ${currentQuestion.explanation}` : "Correct! Great job.");
    } else {
      setFeedbackMessage(currentQuestion.explanation ? `Incorrect. ${currentQuestion.explanation}` : `Incorrect. The correct answer is ${currentQuestion.answer}.`);
    }
  };

  const nextQuestion = () => {
    if (!tourData) return;
    setSelectedOption(null);
    if (stepIndex < tourData.stops.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setTransitionDirection('forward');
      setIsTransitioning(true);
      setTimeout(() => {
         setView('summary');
         window.scrollTo({ top: 0 });
      }, 500);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
  };

  const restartTour = () => {
    setTransitionDirection('forward');
    setIsTransitioning(true);
    setTimeout(() => {
      setView('intro'); 
      setScore(0);
      setQuizResults({});
      setScrollY(0);
      window.scrollTo({ top: 0 });
    }, 500);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -240 : 240;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!country) return <div className="p-10 text-center">Country not found.</div>;

  const renderContent = () => {
    if (view === 'loading' || loading) {
      return (
        <Container className="flex items-center justify-center px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center w-full animate-in fade-in zoom-in duration-500">
            <SEO title={`Traveling to ${country.name}...`} description="Preparing your virtual expedition." />
            <LoadingVisual />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-text mb-6 tracking-tight">
              Destination: {country.name}
            </h2>
            <div className="h-10 flex items-center justify-center w-full">
              <p key={loadingStep} className="text-gray-400 text-lg font-medium uppercase tracking-widest animate-in fade-in zoom-in duration-300">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        </Container>
      );
    }

    if (view === 'error' || !tourData) {
      return (
        <Container className="pt-24 pb-12 px-4 md:px-6">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500 border border-red-100">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-text">Connection Issue</h2>
            <p className="text-gray-500 mb-6 max-w-md">We couldn't retrieve the travel data for this location.</p>
            <Button onClick={() => navigate('/directory')} variant="secondary">Return to Directory</Button>
          </div>
        </Container>
      );
    }

    if (view === 'summary') {
      const isPerfect = score === tourData.stops.length;
      return (
        <Container className="pt-24 pb-12 px-4 md:px-6">
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="bg-white rounded-[2.5rem] shadow-premium p-8 md:p-12 max-w-2xl w-full text-center border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPerfect ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-primary'}`}>
                  {isPerfect ? <CheckCircle2 className="w-10 h-10" /> : <HelpCircle className="w-10 h-10" />}
                </div>
                <h1 className="text-3xl font-display font-bold text-text mb-2">Expedition Complete</h1>
                <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                  You scored <strong className="text-text">{score}</strong> out of <strong className="text-text">{tourData.stops.length}</strong>.
                </p>

                {/* Journey Review Carousel */}
                <div className="mb-10 w-full relative">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Journey Review</p>
                   
                   <div className="relative group">
                      {/* Left Arrow - Visible by default, styled for ICEBERG aesthetic */}
                      <button 
                        onClick={() => scrollCarousel('left')}
                        className="absolute left-[-1rem] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-premium rounded-full flex items-center justify-center text-primary border border-gray-100 transition-all active:scale-90 hover:bg-surface md:left-[-1.5rem]"
                        aria-label="Scroll left"
                      >
                         <ChevronLeft size={24} strokeWidth={2.5} />
                      </button>

                      {/* Right Arrow - Visible by default, styled for ICEBERG aesthetic */}
                      <button 
                        onClick={() => scrollCarousel('right')}
                        className="absolute right-[-1rem] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-premium rounded-full flex items-center justify-center text-primary border border-gray-100 transition-all active:scale-90 hover:bg-surface md:right-[-1.5rem]"
                        aria-label="Scroll right"
                      >
                         <ChevronRight size={24} strokeWidth={2.5} />
                      </button>

                      <div 
                        ref={carouselRef}
                        className="flex gap-3 overflow-x-auto py-4 px-2 snap-x no-scrollbar scroll-smooth"
                      >
                          {tourData.stops.map((stop, index) => {
                            const isCorrect = quizResults[index];
                            const image = stopImages[index];
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex-shrink-0 w-32 h-40 md:w-36 md:h-48 rounded-xl overflow-hidden relative border-2 snap-center transition-transform hover:scale-105 duration-75 ${isCorrect ? 'border-green-200 shadow-sm' : 'border-red-200 shadow-md'}`}
                              >
                                <ExpeditionVisual src={image} alt={stop.stopName} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 flex flex-col items-center justify-center p-2 text-center ${isCorrect ? 'bg-green-900/30' : 'bg-red-900/40'}`}>
                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                      {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                   </div>
                                   <p className="text-white text-[10px] md:text-xs font-bold leading-tight drop-shadow-md line-clamp-2">
                                     {stop.stopName}
                                    </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  <Link to="/directory" className="block w-full">
                    <Button variant="primary" className="w-full">Return to Directory</Button>
                  </Link>
                  <Button variant="secondary" onClick={restartTour} className="w-full flex items-center justify-center gap-2">
                    <RotateCcw size={16} /> Restart Tour
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      );
    }

    if (view === 'intro') {
      return (
        <Container className="pt-24 pb-0 px-0" transparent>
          <SEO title={`Explore ${country.name}`} description={tourData.introText} />
          
          <div className="max-w-4xl mx-auto w-full px-4 md:px-6 pb-20">
            <div className="bg-white rounded-[2rem] shadow-premium overflow-hidden border border-gray-100">
              <div className="relative min-h-[400px] md:h-[32rem] bg-gray-100 w-full group overflow-hidden flex flex-col justify-end">
                 
                 <div className="absolute inset-0">
                    <ExpeditionVisual src={introImage} alt="Intro visual" className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Gradient - Stronger to support text reading */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"></div>

                 {/* REFINED GLASS BUBBLE "Back to Directory" Button - Top Left */}
                 <div className="absolute top-6 left-6 z-20">
                    <Link 
                      to="/directory" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-xl text-white hover:bg-white/40 transition-all duration-300 ease-out group"
                    >
                       <ArrowLeft size={18} className="drop-shadow-md" />
                       <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Back to Directory</span>
                    </Link>
                 </div>
                 
                 {/* Overlay Content - Aligned Center */}
                 <div className="relative w-full p-8 md:p-12 text-white z-10 flex flex-col items-center text-center">
                    <div className="flex flex-col gap-4 items-center animate-in slide-in-from-bottom-4 duration-700 delay-100 max-w-3xl">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-4xl drop-shadow-lg">{country.flag}</span>
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center gap-1 shadow-lg">
                            <MapPin size={12} className="text-white" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">{country.name}</span>
                          </div>
                       </div>
                       <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight drop-shadow-xl text-white text-center">
                         {tourData.tourTitle}
                       </h1>
                       <p className="text-lg md:text-2xl text-white/90 leading-relaxed font-display text-left max-w-2xl drop-shadow-md">
                         {tourData.introText}
                       </p>
                    </div>
                 </div>
              </div>
              
              <div className="px-6 py-8 md:px-12 md:py-10 text-left">
                <div className="max-w-3xl mx-auto">
                  
                  {/* Itinerary List */}
                  <div className="mb-10">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <MapPin size={12} /> Itinerary Preview
                     </h3>
                     <div className="grid gap-3">
                         {tourData.stops.map((stop, index) => (
                           <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                               <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-sm">
                                 {index + 1}
                               </div>
                               <h4 className="font-bold text-text text-sm">{stop.stopName}</h4>
                           </div>
                         ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-4 items-center w-full">
                    {/* Knowledge Check Warning */}
                    <div className="w-full md:w-auto px-6 py-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                       <AlertCircle size={18} className="flex-shrink-0" />
                       <p className="text-xs font-bold uppercase tracking-wide text-center">
                         Get ready to test your knowledge.
                       </p>
                    </div>

                    <Button onClick={startTour} size="lg" className="w-full md:w-auto min-w-[280px]" variant="primary">
                      Begin Expedition <ChevronRight size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      );
    }

    if (view === 'tour') {
      const currentStop = tourData.stops[stepIndex];
      const isLastStop = stepIndex === tourData.stops.length - 1;
      const currentImage = stopImages[stepIndex];

      const headerOpacity = Math.max(0, 1 - scrollY / 300);
      const headerTranslateY = -(scrollY * 0.4); 

      const headerStyle: React.CSSProperties = {
        opacity: headerOpacity,
        transform: `translateY(${headerTranslateY}px)`,
        visibility: headerOpacity <= 0 ? 'hidden' : 'visible',
        willChange: 'opacity, transform'
      };

      return (
        <Container className="pt-0 pb-0 px-0" transparent>
           {/* Fixed background image - dark */}
           <div className="fixed inset-0 w-full h-full -z-10 bg-slate-900">
              <ExpeditionVisual src={currentImage} alt={currentStop.stopName} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/40 to-black/30"></div> 
              <div className="absolute inset-0 bg-black/20"></div>
           </div>

           <div className="relative z-10 w-full min-h-screen flex flex-col">
              <div className="h-[30vh] w-full flex-shrink-0 transition-all"></div>

              <div className="w-full px-6 flex flex-col items-center text-center pb-8" style={headerStyle}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Stop {stepIndex + 1} of {tourData.stops.length}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight drop-shadow-2xl max-w-5xl mx-auto">
                      {currentStop.stopName}
                  </h2>
              </div>

              <div className="w-full h-40 bg-gradient-to-b from-transparent to-surface flex-shrink-0 -mt-8"></div>

              <div className="bg-surface w-full flex-grow flex flex-col pb-0 min-h-screen">
                  {/* WIDENED TEXTBOX: max-w-6xl for better reading flow */}
                  <div className="max-w-6xl mx-auto px-6 flex-grow pt-10">
                      
                      {/* FIRST SECTION: STANDARD INTRO (Drop Cap Removed) */}
                      <div className="mb-12 text-center">
                          <p className="text-xl md:text-4xl font-display font-bold text-gray-900 leading-snug tracking-tight">
                            {(() => {
                                const text = currentStop.description[0];
                                // Bold the title prefix if it exists (e.g. "The Landscape:")
                                const colonIndex = text.indexOf(':');
                                if (colonIndex !== -1 && colonIndex < 40) {
                                    return (
                                        <>
                                            <span className="text-gray-900">{text.substring(0, colonIndex + 1)}</span>
                                            <span className="text-gray-600 font-medium"> {text.substring(colonIndex + 1)}</span>
                                        </>
                                    );
                                }
                                return text;
                            })()}
                          </p>
                      </div>

                      <div className="flex items-center gap-4 mb-12 opacity-30">
                          <div className="h-px bg-gray-400 flex-1"></div>
                          <Compass size={24} className="text-primary" />
                          <div className="h-px bg-gray-400 flex-1"></div>
                      </div>

                      {/* IMAGE MOVED BELOW THE COMPASS DIVIDER AND ABOVE THE SECOND PARAGRAPH */}
                      <div className="mb-12 w-full rounded-2xl overflow-hidden shadow-premium border-4 border-white ring-1 ring-gray-100">
                         <div className="aspect-video w-full bg-gray-100">
                            {/* Corrected: Use currentImage instead of undefined 'image' */}
                            <ExpeditionVisual src={currentImage} alt={currentStop.stopName} className="object-cover w-full h-full" />
                         </div>
                      </div>

                      {/* SECOND SECTION: SERIF TEXT */}
                      <div className="mb-12 pl-4 md:pl-0">
                          <p className="text-xl text-gray-700 leading-relaxed font-serif">
                            {(() => {
                                const text = currentStop.description[1];
                                const splitIndex = text.indexOf(':');
                                if (splitIndex > -1 && splitIndex < 50) {
                                    return (
                                        <>
                                            <strong className="text-gray-900 font-sans block mb-2 text-sm uppercase tracking-widest">{text.substring(0, splitIndex)}</strong>
                                            {text.substring(splitIndex + 1)}
                                        </>
                                    )
                                }
                                return text;
                            })()}
                          </p>
                      </div>

                      {/* THIRD SECTION: HIGHLIGHT BOX */}
                      {currentStop.description[2] && (
                          <div className="mb-12 pl-6 border-l-4 border-accent">
                            {(() => {
                                const text = currentStop.description[2];
                                const splitIndex = text.indexOf(':');
                                if (splitIndex > -1 && splitIndex < 50) {
                                    // With formatted title
                                    return (
                                        <>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{text.substring(0, splitIndex)}</h4>
                                            <p className="text-lg text-gray-800 font-medium italic">
                                                "{text.substring(splitIndex + 1).trim()}"
                                            </p>
                                        </>
                                    )
                                } else {
                                    // Default behavior without title
                                    return (
                                        <p className="text-lg text-gray-800 font-medium italic">
                                            {text}
                                        </p>
                                    )
                                }
                            })()}
                          </div>
                      )}

                      {currentStop.description[3] && (
                          <div className="mb-20">
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {currentStop.description[3]}
                            </p>
                          </div>
                      )}

                      <div className="flex flex-col justify-center items-center gap-4 pb-24">
                          {isLastStop ? (
                              <Button onClick={nextStop} className="w-full md:w-auto min-w-[320px]" variant="accent" size="lg">
                                  <BrainCircuit size={20} className="mr-2" />
                                  Start Knowledge Check
                              </Button>
                          ) : (
                              <Button onClick={nextStop} className="w-full md:w-auto min-w-[320px]" variant="primary" size="lg">
                                Continue Journey <ChevronRight size={20} className="ml-2" />
                              </Button>
                          )}

                          <button 
                              onClick={prevStop} 
                              className="flex items-center gap-2 px-6 py-2 text-gray-400 hover:text-gray-600 transition-colors font-display font-bold text-sm group duration-75"
                          >
                              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-75" /> Back
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        </Container>
      );
    }

    if (view === 'quiz') {
      const currentQuestion = tourData.stops[stepIndex];
      const isLastQuestion = stepIndex === tourData.stops.length - 1;
      const currentImage = stopImages[stepIndex];

      const bottomSheetClasses = selectedOption
        ? 'translate-y-0 opacity-100 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]'
        : 'translate-y-full opacity-0 shadow-none';

      return (
        <Container className="pt-16 md:pt-20 pb-0 px-4 md:px-6">
           <div className="max-w-4xl mx-auto w-full pb-32">
              <div className="text-center mb-2 md:mb-4">
                 <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Knowledge Check</h2>
                 <div className="flex justify-center gap-1">
                    {tourData.stops.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 w-6 rounded-full transition-colors duration-75 ${i === stepIndex ? 'bg-primary' : i < stepIndex ? 'bg-green-400' : 'bg-gray-200'}`} 
                      />
                    ))}
                 </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-premium overflow-hidden border border-gray-100">
                 {/* Height significantly reduced to ensure fit */}
                 <div className="relative h-44 md:h-64 bg-gray-100">
                    <ExpeditionVisual src={currentImage} alt="" />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm z-10 text-text">
                       {currentQuestion.stopName}
                    </div>
                 </div>

                 <div className="p-4 md:p-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-text mb-4 leading-tight">
                      {currentQuestion.question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                       {currentQuestion.options.map((option, idx) => {
                         const isSelected = selectedOption === option;
                         let stateStyles = "bg-white border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-blue-50/30";
                         let icon = null;

                         if (isSelected) {
                           if (isCorrect) {
                             stateStyles = "bg-green-50 border-green-500 text-green-900 ring-1 ring-green-500 shadow-none";
                             icon = <CheckCircle2 size={18} className="text-green-600" />;
                           } else {
                             stateStyles = "bg-red-50 border-red-600 text-red-900 ring-1 ring-red-600 shadow-none";
                             icon = <AlertCircle size={18} className="text-red-600" />;
                           }
                         } else if (selectedOption && option === currentQuestion.answer) {
                            stateStyles = "bg-green-50/50 border-green-300 text-green-800 opacity-70"; 
                            icon = <CheckCircle2 size={14} className="text-green-600 opacity-50" />;
                         } else if (selectedOption) {
                            stateStyles = "opacity-40 grayscale border-gray-100";
                         }

                         return (
                           <button
                             key={idx}
                             onClick={() => handleQuizAnswer(option)}
                             disabled={!!selectedOption}
                             className={`w-full text-left px-4 py-2 md:py-3 rounded-xl border-2 transition-all duration-500 font-medium text-sm leading-snug flex justify-between items-center ${stateStyles}`}
                             style={{ WebkitTapHighlightColor: 'transparent' }}
                           >
                             <span className="leading-snug">{option}</span>
                             {icon}
                           </button>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>

           <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white transition-all duration-300 cubic-bezier(0.32,0.72,0,1) border-t-2 ${bottomSheetClasses} ${isCorrect ? 'border-green-500' : 'border-red-600'}`}>
              <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1 text-center md:text-left">
                      {selectedOption && (
                        <>
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                              {isCorrect ? (
                                  <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                                      <CheckCircle2 size={20} />
                                  </div>
                              ) : (
                                  <div className="p-1.5 bg-red-100 rounded-full text-red-600">
                                      <AlertCircle size={20} />
                                  </div>
                              )}
                              <h3 className={`font-display font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                  {isCorrect ? 'Correct!' : 'Incorrect'}
                              </h3>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                              {feedbackMessage ? feedbackMessage.replace(/^(Correct!|Incorrect\.)\s*/, '') : ''}
                          </p>
                        </>
                      )}
                  </div>
                  <div className="w-full md:w-auto">
                       <Button 
                         onClick={nextQuestion} 
                         className="w-full md:min-w-[180px] flex items-center justify-center gap-2"
                         variant="primary"
                         size="md"
                         disabled={!selectedOption}
                       >
                         {isLastQuestion ? 'Finish' : 'Next Question'} <ChevronRight size={18} />
                       </Button>
                  </div>
              </div>
           </div>
        </Container>
      );
    }
    return null;
  };

  return (
    <>
      {isTransitioning && createPortal(
        <div className={`fixed inset-0 z-[100] bg-primary flex items-center justify-center pointer-events-none ${transitionDirection === 'forward' ? 'animate-wipe-forward' : 'animate-wipe-backward'}`}>
          <div className="text-white text-3xl font-display font-bold flex items-center gap-3">
            <Globe className="w-10 h-10 animate-spin" />
          </div>
        </div>,
        document.body
      )}

      {renderContent()}
    </>
  );
};

export default CountryExploration;
