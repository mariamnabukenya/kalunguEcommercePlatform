// import React from 'react';
// import { SlidersHorizontal, X } from 'lucide-react';
// import { ProductFilters } from '../types';
// import Input from './Input';
// import Button from './Button';

// interface FilterSidebarProps {
//   filters: ProductFilters;
//   onFilterChange: (key: keyof ProductFilters, value: any) => void;
//   onClearFilters: () => void;
//   isOpen: boolean;
//   onClose: () => void;
//   className?: string;
// }

// const FilterSidebar: React.FC<FilterSidebarProps> = ({
//   filters,
//   onFilterChange,
//   onClearFilters,
//   isOpen,
//   onClose,
//   className = '',
// }) => {
//   const categories = [
//     { value: 'men', label: 'Men' },
//     { value: 'women', label: 'Women' },
//     { value: 'accessories', label: 'Accessories' },
//     { value: 'shoes', label: 'Shoes' },
//     { value: 'bags', label: 'Bags' },
//     { value: 'jewelry', label: 'Jewelry' },
//   ];

//   const brands = [
//     { value: 'kalungu', label: 'Kalungu' },
//     { value: 'premium', label: 'Premium' },
//     { value: 'classic', label: 'Classic' },
//     { value: 'modern', label: 'Modern' },
//   ];

//   const priceRanges = [
//     { label: 'Under $25', min: 0, max: 25 },
//     { label: '$25 - $50', min: 25, max: 50 },
//     { label: '$50 - $100', min: 50, max: 100 },
//     { label: '$100 - $200', min: 100, max: 200 },
//     { label: 'Over $200', min: 200, max: undefined },
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg lg:shadow-none
//           transform transition-transform duration-300 ease-in-out
//           ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           ${className}
//         `}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
//           <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6 overflow-y-auto h-full">
//           {/* Search */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Search</h3>
//             <Input
//               placeholder="Search products..."
//               value={filters.search || ''}
//               onChange={(e) => onFilterChange('search', e.target.value)}
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
//             <div className="space-y-2">
//               {categories.map((category) => (
//                 <label key={category.value} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="category"
//                     value={category.value}
//                     checked={filters.category === category.value}
//                     onChange={(e) => onFilterChange('category', e.target.value || undefined)}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">{category.label}</span>
//                 </label>
//               ))}
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="category"
//                   value=""
//                   checked={!filters.category}
//                   onChange={() => onFilterChange('category', undefined)}
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">All Categories</span>
//               </label>
//             </div>
//           </div>

//           {/* Brand */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Brand</h3>
//             <div className="space-y-2">
//               {brands.map((brand) => (
//                 <label key={brand.value} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={filters.brand === brand.value}
//                     onChange={(e) => onFilterChange('brand', e.target.checked ? brand.value : undefined)}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">{brand.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Price Range */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
//             <div className="space-y-2">
//               {priceRanges.map((range, index) => (
//                 <label key={index} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="priceRange"
//                     checked={
//                       filters.min_price === range.min &&
//                       filters.max_price === range.max
//                     }
//                     onChange={() => {
//                       onFilterChange('min_price', range.min);
//                       onFilterChange('max_price', range.max);
//                     }}
//                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">{range.label}</span>
//                 </label>
//               ))}
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   name="priceRange"
//                   checked={!filters.min_price && !filters.max_price}
//                   onChange={() => {
//                     onFilterChange('min_price', undefined);
//                     onFilterChange('max_price', undefined);
//                   }}
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Any Price</span>
//               </label>
//             </div>
//           </div>

//           {/* Custom Price Range */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Price</h3>
//             <div className="grid grid-cols-2 gap-2">
//               <Input
//                 type="number"
//                 placeholder="Min"
//                 value={filters.min_price || ''}
//                 onChange={(e) => onFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
//               />
//               <Input
//                 type="number"
//                 placeholder="Max"
//                 value={filters.max_price || ''}
//                 onChange={(e) => onFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
//               />
//             </div>
//           </div>

//           {/* Availability */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
//             <div className="space-y-2">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={filters.in_stock || false}
//                   onChange={(e) => onFilterChange('in_stock', e.target.checked || undefined)}
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={filters.featured || false}
//                   onChange={(e) => onFilterChange('featured', e.target.checked || undefined)}
//                   className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Featured Only</span>
//               </label>
//             </div>
//           </div>

//           {/* Clear Filters */}
//           <div className="pt-4 border-t border-gray-200">
//             <Button
//               variant="outline"
//               onClick={onClearFilters}
//               className="w-full"
//             >
//               <SlidersHorizontal className="w-4 h-4 mr-2" />
//               Clear All Filters
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FilterSidebar;
// src/components/FiltersBar.tsx
// src/components/FiltersBar.tsx
import React from "react";

interface Props {
  sortValue: string;
  onSortChange: (value: string) => void;
}

const FiltersBar: React.FC<Props> = ({ sortValue, onSortChange }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-6">
      <button className="text-sm font-medium">Filter</button>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
};

export default FiltersBar;
