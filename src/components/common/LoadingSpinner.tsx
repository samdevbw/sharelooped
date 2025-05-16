import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'indigo' | 'gray' | 'white';
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'indigo',
  text
}: LoadingSpinnerProps) {
  // Determine size dimensions
  const dimensions = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  // Determine border color
  const borderColor = {
    indigo: 'border-indigo-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full ${dimensions[size]} border-t-2 border-b-2 ${borderColor[color]}`}
      />
      {text && (
        <p className="mt-4 text-gray-600">{text}</p>
      )}
    </div>
  );
}