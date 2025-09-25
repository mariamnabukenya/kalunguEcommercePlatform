import React from 'react';
import { Product } from '../types';
import StarRating from './StarRating';
import { cn } from '../lib/utils';

interface ProductRatingProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showValue?: boolean;
  className?: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({
  product,
  size = 'md',
  showCount = true,
  showValue = false,
  className = '',
}) => {
  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <StarRating
        rating={rating}
        size={size}
        showValue={showValue}
      />
      
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-gray-500">
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}
      
      {rating === 0 && reviewCount === 0 && (
        <span className="text-sm text-gray-500">
          No reviews yet
        </span>
      )}
    </div>
  );
};

export default ProductRating;
