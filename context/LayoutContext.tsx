
import React, { createContext, useContext, useState } from 'react';

type NavbarMode = 'default' | 'hero';

interface LayoutContextType {
  navbarMode: NavbarMode;
  setNavbarMode: (mode: NavbarMode) => void;
  scrollThreshold: number;
  setScrollThreshold: (threshold: number) => void;
  isTransitioning: boolean;
  setIsTransitioning: (val: boolean) => void;
  isPageLoading: boolean;
  setPageLoading: (val: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  navbarMode: 'default',
  setNavbarMode: () => {},
  scrollThreshold: 20,
  setScrollThreshold: () => {},
  isTransitioning: false,
  setIsTransitioning: () => {},
  isPageLoading: false,
  setPageLoading: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navbarMode, setNavbarMode] = useState<NavbarMode>('default');
  const [scrollThreshold, setScrollThreshold] = useState<number>(20);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageLoading, setPageLoading] = useState(false);

  return (
    <LayoutContext.Provider value={{ 
      navbarMode, 
      setNavbarMode, 
      scrollThreshold, 
      setScrollThreshold,
      isTransitioning,
      setIsTransitioning,
      isPageLoading,
      setPageLoading
    }}>
      {children}
    </LayoutContext.Provider>
  );
};
