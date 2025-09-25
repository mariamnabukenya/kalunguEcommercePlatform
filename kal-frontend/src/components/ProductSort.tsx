import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  className?: string;
}

const ProductSort: React.FC<ProductSortProps> = ({
  sortBy,
  onSortChange,
  className = '',
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low_high', label: 'Price: Low to High' },
    { value: 'price_high_low', label: 'Price: High to Low' },
    { value: 'name_a_z', label: 'Name: A to Z' },
    { value: 'name_z_a', label: 'Name: Z to A' },
    { value: 'rating_high_low', label: 'Rating: High to Low' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-gray-500" />
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;
