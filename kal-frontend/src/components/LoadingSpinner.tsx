import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-6 h-6 border-b-2',
    md: 'w-12 h-12 border-b-4',
    lg: 'w-32 h-32 border-b-4',
  };

  return (
    <div className={`animate-spin rounded-full border-gray-300 ${dimensions[size]} border-t-primary-600`}></div>
  );
};

export default LoadingSpinner;
