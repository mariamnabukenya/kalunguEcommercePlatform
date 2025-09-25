import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { apiService } from '../lib/api';
import { Product } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search products...',
  showSuggestions = true,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2 && showSuggestions) {
      setIsLoading(true);
      apiService.searchProducts(debouncedQuery)
        .then(results => {
          setSuggestions(results.slice(0, 5)); // Show top 5 suggestions
          setShowSuggestionsList(true);
        })
        .catch(error => {
          console.error('Search error:', error);
          setSuggestions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [debouncedQuery, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestionsList(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/products/${product.id}`);
    setQuery('');
    setShowSuggestionsList(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestionsList(true)}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {isLoading && (
            <div className="absolute right-8 top-2.5">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${product.current_price}
                  </p>
                </div>
              </div>
            </button>
          ))}
          
          {query && (
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(query)}`);
                  setShowSuggestionsList(false);
                }}
                className="w-full text-left text-sm text-primary-600 hover:text-primary-700"
              >
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
