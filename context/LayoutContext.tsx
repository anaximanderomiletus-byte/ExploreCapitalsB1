import React, { createContext, useContext, useState } from 'react';

type NavbarMode = 'default' | 'hero';

interface LayoutContextType {
  navbarMode: NavbarMode;
  setNavbarMode: (mode: NavbarMode) => void;
  scrollThreshold: number;
  setScrollThreshold: (threshold: number) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  navbarMode: 'default',
  setNavbarMode: () => {},
  scrollThreshold: 20,
  setScrollThreshold: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navbarMode, setNavbarMode] = useState<NavbarMode>('default');
  const [scrollThreshold, setScrollThreshold] = useState<number>(20);

  return (
    <LayoutContext.Provider value={{ navbarMode, setNavbarMode, scrollThreshold, setScrollThreshold }}>
      {children}
    </LayoutContext.Provider>
  );
};