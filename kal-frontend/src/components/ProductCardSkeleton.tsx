import React from 'react';
import Skeleton from './Skeleton';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4" />
        
        {/* Price Skeleton */}
        <Skeleton className="h-5 w-1/2" />
        
        {/* Rating Skeleton */}
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-8 ml-2" />
        </div>
        
        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
