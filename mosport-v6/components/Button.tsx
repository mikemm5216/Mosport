import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  themeColor?: string; // Optional override
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const widthStyle = fullWidth ? "w-full" : "";
  
  let variantStyle = "";
  
  switch (variant) {
    case 'primary':
      variantStyle = "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20";
      break;
    case 'secondary':
      variantStyle = "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-900/20";
      break;
    case 'outline':
      variantStyle = "border border-gray-600 text-gray-300 hover:border-white hover:text-white";
      break;
    case 'ghost':
      variantStyle = "text-gray-400 hover:text-white";
      break;
  }

  return (
    <button 
      className={`${baseStyles} ${widthStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};