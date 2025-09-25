import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn('flex items-center border border-gray-300 rounded-md', sizeClasses[size], className)}>
      <button
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className={cn(
          'flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300',
          buttonSizeClasses[size]
        )}
      >
        <Minus className={iconSizeClasses[size]} />
      </button>
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className={cn(
          'w-16 text-center border-0 focus:ring-0 focus:outline-none bg-transparent',
          textSizeClasses[size]
        )}
      />
      
      <button
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={cn(
          'flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300',
          buttonSizeClasses[size]
        )}
      >
        <Plus className={iconSizeClasses[size]} />
      </button>
    </div>
  );
};

export default QuantitySelector;
