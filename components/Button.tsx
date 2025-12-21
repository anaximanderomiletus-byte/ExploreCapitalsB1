
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isFlat?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isFlat = false,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-display font-bold transition-all duration-100 rounded-full outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 disabled:cursor-not-allowed relative select-none";
  
  const variants = {
    primary: isFlat 
      ? "bg-primary text-white hover:brightness-105 active:brightness-90" 
      : "bg-primary text-white shadow-[0_4px_0_#5ba4e5] hover:brightness-105 active:shadow-none active:translate-y-[4px]",
    accent: isFlat
      ? "bg-accent text-text hover:brightness-105 active:brightness-90"
      : "bg-accent text-text shadow-[0_4px_0_#b8a9a9] hover:brightness-105 active:shadow-none active:translate-y-[4px]",
    secondary: isFlat
      ? "bg-white text-text border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
      : "bg-white text-text border border-gray-200 shadow-[0_4px_0_#e5e7eb] hover:bg-gray-50 active:shadow-none active:translate-y-[4px]",
    outline: "bg-transparent border-2 border-text text-text hover:bg-text/5 active:scale-95",
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
