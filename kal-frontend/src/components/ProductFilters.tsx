import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductFilters as ProductFiltersType } from '../types';
import Button from './Button';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (key: keyof ProductFiltersType, value: any) => void;
  onClearFilters: () => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className = '',
}) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false
  );

  const categories = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'bags', label: 'Bags' },
    { value: 'jewelry', label: 'Jewelry' },
  ];

  const brands = [
    { value: 'kalungu', label: 'Kalungu' },
    { value: 'premium', label: 'Premium' },
    { value: 'classic', label: 'Classic' },
    { value: 'modern', label: 'Modern' },
  ];

  const priceRanges = [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: undefined },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={filters.category === category.value}
                  onChange={(e) => onFilterChange('category', e.target.value || undefined)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category.label}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => onFilterChange('category', undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">All Categories</span>
            </label>
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Brand</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brand === brand.value}
                  onChange={(e) => onFilterChange('brand', e.target.checked ? brand.value : undefined)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.min_price === range.min &&
                    filters.max_price === range.max
                  }
                  onChange={() => {
                    onFilterChange('min_price', range.min);
                    onFilterChange('max_price', range.max);
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                checked={!filters.min_price && !filters.max_price}
                onChange={() => {
                  onFilterChange('min_price', undefined);
                  onFilterChange('max_price', undefined);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Any Price</span>
            </label>
          </div>
        </div>

        {/* Custom Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Price</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => onFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => onFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Availability Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Availability</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.in_stock || false}
                onChange={(e) => onFilterChange('in_stock', e.target.checked || undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => onFilterChange('featured', e.target.checked || undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
