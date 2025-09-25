import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { Product } from '../types';
import { storageService } from '../lib/storage';
import Button from './Button';

interface RecentlyViewedProps {
  className?: string;
  maxItems?: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  className = '',
  maxItems = 5,
}) => {
  const [recentlyViewed, setRecentlyViewed] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const viewed = storageService.getRecentlyViewed();
    setRecentlyViewed(viewed.slice(0, maxItems));
  }, [maxItems]);

  const removeFromRecentlyViewed = (productId: number) => {
    const updated = recentlyViewed.filter(product => product.id !== productId);
    setRecentlyViewed(updated);
    storageService.setRecentlyViewed(updated);
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    storageService.setRecentlyViewed([]);
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          Recently Viewed
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRecentlyViewed}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        {recentlyViewed.map((product) => (
          <div key={product.id} className="flex items-center space-x-3 group">
            <Link
              to={`/products/${product.id}`}
              className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden"
            >
              <img
                src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            
            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${product.id}`}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors truncate block"
              >
                {product.name}
              </Link>
              <p className="text-sm text-gray-500">
                ${product.current_price}
              </p>
            </div>
            
            <button
              onClick={() => removeFromRecentlyViewed(product.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {recentlyViewed.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/products?recently_viewed=true"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all recently viewed →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
