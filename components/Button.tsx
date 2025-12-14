
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  // Base Styles: Rounded, Bold, NO hover expansion or movement
  // Explicitly remove focus ring and tap highlight color with !outline-none !ring-0
  const baseStyles = "inline-flex items-center justify-center font-display font-bold transition-all duration-100 rounded-full outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 disabled:cursor-not-allowed relative select-none";
  
  const variants = {
    // Primary: Iceberg Blue -> Press down effect only.
    primary: "bg-primary text-white shadow-[0_4px_0_#4A8BB5] hover:brightness-105 active:shadow-none active:translate-y-[4px]",
    
    // Accent: Iceberg Rose
    accent: "bg-accent text-text shadow-[0_4px_0_#A89999] hover:brightness-105 active:shadow-none active:translate-y-[4px]",
    
    // Secondary: White with Grey Shadow. Added thin border.
    secondary: "bg-white text-text border border-gray-200 shadow-[0_4px_0_#94A3B8] hover:bg-gray-50 active:shadow-none active:translate-y-[4px]",
    
    // Outline: Transparent
    outline: "bg-transparent border-2 border-text text-text hover:bg-surface-dark/10 active:translate-y-[2px]",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
