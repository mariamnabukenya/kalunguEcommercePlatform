import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface ProductStockStatusProps {
  product: Product;
  selectedVariant?: any;
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  className?: string;
}

const ProductStockStatus: React.FC<ProductStockStatusProps> = ({
  product,
  selectedVariant,
  size = 'md',
  showQuantity = true,
  className = '',
}) => {
  const stockQuantity = selectedVariant 
    ? selectedVariant.stock_quantity 
    : product.stock_quantity || 0;

  const isInStock = stockQuantity > 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getStatusConfig = () => {
    if (isInStock) {
      if (isLowStock) {
        return {
          icon: AlertCircle,
          text: 'Low Stock',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      } else {
        return {
          icon: CheckCircle,
          text: 'In Stock',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      }
    } else {
      return {
        icon: XCircle,
        text: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'flex items-center space-x-2 px-3 py-1 rounded-full',
        statusConfig.bgColor
      )}>
        <Icon className={cn(iconSizeClasses[size], statusConfig.color)} />
        <span className={cn(
          'font-medium',
          sizeClasses[size],
          statusConfig.color
        )}>
          {statusConfig.text}
        </span>
      </div>
      
      {showQuantity && isInStock && (
        <span className={cn(
          'text-gray-600',
          sizeClasses[size]
        )}>
          ({stockQuantity} available)
        </span>
      )}
    </div>
  );
};

export default ProductStockStatus;
