import React from 'react';
import { Grid, List } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const ProductViewToggle: React.FC<ProductViewToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = '',
}) => {
  return (
    <div className={cn('flex items-center border border-gray-300 rounded-md overflow-hidden', className)}>
      <button
        onClick={() => onViewModeChange('grid')}
        className={cn(
          'p-2 transition-colors',
          viewMode === 'grid'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        )}
        title="Grid View"
      >
        <Grid className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => onViewModeChange('list')}
        className={cn(
          'p-2 transition-colors border-l border-gray-300',
          viewMode === 'list'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        )}
        title="List View"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProductViewToggle;
