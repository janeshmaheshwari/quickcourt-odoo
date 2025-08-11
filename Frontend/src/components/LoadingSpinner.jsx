import React from 'react';

const LoadingSpinner = ({ 
  size = "default", 
  text = "Loading...", 
  variant = "primary",
  showText = true 
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12", 
    large: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg", 
    xl: "text-xl"
  };

  const variants = {
    primary: "border-primary-500",
    secondary: "border-secondary-500",
    accent: "border-accent-500",
    white: "border-white"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Main spinner */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-current rounded-full ${variants[variant]}`}></div>
        </div>
        
        {/* Pulsing ring effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-current rounded-full animate-ping opacity-20 ${variants[variant]}`}></div>
        
        {/* Inner glow */}
        <div className={`absolute inset-2 ${sizeClasses[size]} bg-current rounded-full opacity-10 animate-pulse ${variants[variant]}`}></div>
      </div>
      
      {showText && text && (
        <div className={`text-center ${textSizes[size]}`}>
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
