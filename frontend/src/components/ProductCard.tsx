import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { type Product, apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
  const currentPrice = product.sale_price || product.price;
  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }
    
    try {
      if (isWishlisted) {
        await apiService.removeFromWishlist(product.id.toString());
        setIsWishlisted(false);
      } else {
        await apiService.addToWishlist(product.id.toString());
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      return;
    }

    setIsAddingToCart(true);
    try {
      await apiService.addToCart({
        product_id: product.id,
        quantity: 1
      });
      // Show success message or update cart count
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          {primaryImage && (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-64 object-cover"
            />
          )}
          
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/products/${product.id}`} className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <button
            onClick={handleAddToWishlist}
            className={`ml-2 p-1 rounded-full transition-colors ${
              isWishlisted 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        )}

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.average_rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.review_count})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || isAddingToCart}
            className={`p-2 rounded-full transition-colors ${
              product.in_stock && !isAddingToCart
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {!product.in_stock && (
          <p className="text-sm text-red-600 mt-2">Currently unavailable</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;