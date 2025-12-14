
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Menu, X } from 'lucide-react';
import Button from './Button';
import { useLayout } from '../context/LayoutContext';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  
  // Use Context for determining navbar mode and threshold
  const { navbarMode, scrollThreshold } = useLayout();
  const isHeroMode = navbarMode === 'hero';
  const isMapPage = location.pathname === '/map';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine visibility based on scroll direction
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Check threshold from context
      setIsScrolled(currentScrollY > scrollThreshold);
      
      lastScrollY.current = currentScrollY;
    };
    
    // Check initially
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/directory', label: 'Directory' },
    { path: '/map', label: 'Map' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Navigation Logic:
  // 1. Hero Mode:
  //    - Top: Transparent BG, White Text.
  //    - Scrolled: Transparent BG (content handles bg), Dark Text.
  // 2. Default Mode:
  //    - Top: Transparent BG, Dark Text.
  //    - Scrolled: White/Blur BG, Dark Text.
  
  let navClasses = "";
  let textColorClass = "text-[#37393A]"; // Enforce dark color by default
  let logoBgClass = "bg-primary text-white";

  if (isHeroMode) {
    // Hero Mode
    navClasses = "bg-transparent py-5"; 
    
    if (isScrolled) {
      // Scrolled past threshold: Dark Text
      textColorClass = "text-[#37393A]"; 
      logoBgClass = "bg-primary text-white shadow-sm"; 
    } else {
      // At top: White Text
      textColorClass = "text-white drop-shadow-md"; 
      logoBgClass = "bg-white/20 backdrop-blur-md text-white border border-white/30";
    }
  } else {
    // Default Mode
    navClasses = isScrolled
      ? 'bg-surface/90 backdrop-blur-md shadow-sm py-3' 
      : 'bg-transparent py-5';
    // Always dark text for default mode
    textColorClass = "text-[#37393A]";
    logoBgClass = "bg-primary text-white";
  }

  // Mobile menu open overrides everything for the Header itself
  if (isMobileMenuOpen) {
    // Use py-5 to match the 'top' state padding, preventing the header from "pushing up" (shrinking) when opening menu
    navClasses = "bg-surface shadow-sm py-5";
    textColorClass = "text-[#37393A]";
    // Ensure logo is visible on surface background
    logoBgClass = "bg-primary text-white";
  }

  // Logic to hide header on Map Page in Landscape mode, UNLESS menu is open
  const hideOnMapLandscape = isMapPage && !isMobileMenuOpen;

  return (
    <>
      <nav 
        className={`fixed w-full z-[2000] transition-all duration-300 ease-in-out ${
          // Ensure nav is visible if menu is open, otherwise follow scroll logic
          (isVisible || isMobileMenuOpen) ? 'translate-y-0' : '-translate-y-full'
        } ${navClasses} ${hideOnMapLandscape ? '[@media(max-height:620px)]:-translate-y-full' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className={`p-2 rounded-xl shadow-sm transition-all duration-300 ${logoBgClass}`}>
              <Globe2 size={24} />
            </div>
            <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${textColorClass}`}>
              ExploreCapitals
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`font-medium text-sm transition-colors duration-200 ${
                  isActive(link.path) 
                    ? 'text-primary font-semibold' 
                    : `${textColorClass} hover:text-primary`
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/games">
              <Button variant="primary" size="sm">
                Play Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden relative z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${textColorClass} p-2 active:scale-95 transition-transform duration-200`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Slide-in from Right (Drawer) */}
      <div 
        className={`fixed inset-0 bg-surface z-[1999] md:hidden transition-transform duration-300 ease-in-out flex flex-col pt-24 px-6 overflow-y-auto ${
          isMobileMenuOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        }
        /* Landscape Optimization: Reduce padding, center content, disable scroll if it fits */
        [@media(max-height:620px)]:pt-20
        [@media(max-height:620px)]:px-8
        [@media(max-height:620px)]:overflow-hidden
        [@media(max-height:620px)]:justify-center
        `}
      >
        <div className={`flex flex-col gap-2
            /* Landscape: Grid layout to save vertical space */
            [@media(max-height:620px)]:grid
            [@media(max-height:620px)]:grid-cols-2
            [@media(max-height:620px)]:gap-x-6
            [@media(max-height:620px)]:gap-y-3
            [@media(max-height:620px)]:w-full
            [@media(max-height:620px)]:max-w-2xl
            [@media(max-height:620px)]:mx-auto
        `}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`block py-4 text-xl font-display font-bold border-b border-gray-100 ${
                isActive(link.path) ? 'text-primary' : 'text-[#37393A]'
              }
              /* Landscape: Card-like style, no border, centered */
              [@media(max-height:620px)]:border-none
              [@media(max-height:620px)]:py-3
              [@media(max-height:620px)]:text-center
              [@media(max-height:620px)]:bg-white/50
              [@media(max-height:620px)]:rounded-xl
              [@media(max-height:620px)]:active:bg-white
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        <div className={`mt-8 mb-8
             /* Landscape: Reduce margin, span full width */
             [@media(max-height:620px)]:mt-6
             [@media(max-height:620px)]:mb-2
             [@media(max-height:620px)]:w-full
             [@media(max-height:620px)]:max-w-sm
             [@media(max-height:620px)]:mx-auto
        `}>
          <Link to="/games">
            <Button variant="primary" size="lg" className="w-full justify-center">
              Play Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
