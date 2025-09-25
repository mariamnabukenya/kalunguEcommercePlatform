import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  rounded = false,
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

// Predefined skeleton components
export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <Skeleton height="200px" className="mb-4" />
    <Skeleton height="1rem" className="mb-2" />
    <Skeleton height="0.875rem" width="60%" className="mb-2" />
    <Skeleton height="1.25rem" width="40%" />
  </div>
);

export const ProductListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const CartItemSkeleton: React.FC = () => (
  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
    <Skeleton width="64px" height="64px" />
    <div className="flex-1 space-y-2">
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="0.875rem" width="60%" />
      <Skeleton height="0.875rem" width="40%" />
    </div>
    <Skeleton height="1.25rem" width="60px" />
  </div>
);

export default Skeleton;
