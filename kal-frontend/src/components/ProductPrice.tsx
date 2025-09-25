import React from 'react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductPriceProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showOriginal?: boolean;
  showDiscount?: boolean;
  className?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  product,
  size = 'md',
  showOriginal = true,
  showDiscount = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const originalSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const discountSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* Current Price */}
      <div className="flex items-center space-x-2">
        <span className={cn('font-bold text-gray-900', sizeClasses[size])}>
          ${product.current_price}
        </span>
        
        {/* Original Price */}
        {showOriginal && product.on_sale && product.original_price && (
          <span className={cn(
            'text-gray-500 line-through',
            originalSizeClasses[size]
          )}>
            ${product.original_price}
          </span>
        )}
      </div>

      {/* Discount Badge */}
      {showDiscount && product.on_sale && product.discount_percentage && (
        <div className={cn(
          'inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium',
          discountSizeClasses[size]
        )}>
          {product.discount_percentage}% OFF
        </div>
      )}

      {/* Price Note */}
      {product.on_sale && (
        <p className={cn(
          'text-green-600 font-medium',
          discountSizeClasses[size]
        )}>
          You save ${(product.original_price || 0) - product.current_price}
        </p>
      )}
    </div>
  );
};

export default ProductPrice;
