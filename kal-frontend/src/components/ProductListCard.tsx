import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Button from './Button';
import StarRating from './StarRating';
import Badge from './Badge';

interface ProductListCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductListCard: React.FC<ProductListCardProps> = ({
  product,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Product Image */}
        <div className="w-48 h-48 flex-shrink-0">
          <Link to={`/products/${product.id}`}>
            <img
              src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {product.on_sale && (
                <Badge variant="sale">
                  {product.discount_percentage}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge variant="featured">Featured</Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  ${product.current_price}
                </span>
                {product.on_sale && product.original_price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <StarRating rating={product.average_rating} size="sm" />
                <span className="text-sm text-gray-500">
                  ({product.review_count})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickView}
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlistToggle}
                className={isInWishlist(product.id) ? 'text-red-600' : ''}
                title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            {product.in_stock ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
