import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { ProductVariant } from '../types';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantSelect: (variant: ProductVariant) => void;
  className?: string;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  variants,
  selectedVariant,
  onVariantSelect,
  className = '',
}) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by attribute (e.g., size, color)
  const groupedVariants = variants.reduce((acc, variant) => {
    const attribute = variant.attribute_name;
    if (!acc[attribute]) {
      acc[attribute] = [];
    }
    acc[attribute].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(groupedVariants).map(([attributeName, attributeVariants]) => (
        <div key={attributeName}>
          <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">
            {attributeName}:
          </h4>
          <div className="flex flex-wrap gap-2">
            {attributeVariants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isAvailable = variant.stock_quantity > 0;
              
              return (
                <button
                  key={variant.id}
                  onClick={() => onVariantSelect(variant)}
                  disabled={!isAvailable}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md border transition-colors',
                    isSelected
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : isAvailable
                      ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-100'
                  )}
                >
                  {variant.attribute_value}
                  {!isAvailable && (
                    <span className="ml-1 text-xs">(Out of Stock)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariants;
