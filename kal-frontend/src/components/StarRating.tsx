import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = '',
  showValue = false,
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = i === Math.ceil(rating) && rating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          onClick={() => handleStarClick(i)}
          disabled={!interactive}
          className={cn(
            'transition-colors',
            interactive && 'hover:scale-110',
            !interactive && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              isFilled && 'fill-yellow-400 text-yellow-400',
              isHalfFilled && 'fill-yellow-400 text-yellow-400 opacity-50',
              !isFilled && !isHalfFilled && 'text-gray-300',
              interactive && 'cursor-pointer'
            )}
          />
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex">
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
