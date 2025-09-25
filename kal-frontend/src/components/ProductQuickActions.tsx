import React from 'react';
import { Heart, ShoppingCart, Eye, Share2, BarChart3 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Button from './Button';

interface ProductQuickActionsProps {
  product: Product;
  onQuickView?: () => void;
  onCompare?: () => void;
  onShare?: () => void;
  className?: string;
}

const ProductQuickActions: React.FC<ProductQuickActionsProps> = ({
  product,
  onQuickView,
  onCompare,
  onShare,
  className = '',
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      onShare?.();
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Quick View */}
      <Button
        variant="outline"
        size="sm"
        onClick={onQuickView}
        title="Quick View"
        className="flex-1"
      >
        <Eye className="w-4 h-4 mr-1" />
        Quick View
      </Button>

      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        disabled={!product.in_stock}
        size="sm"
        className="flex-1"
      >
        <ShoppingCart className="w-4 h-4 mr-1" />
        Add to Cart
      </Button>

      {/* Wishlist */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleWishlistToggle}
        className={isInWishlist(product.id) ? 'text-red-600' : ''}
        title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
      </Button>

      {/* Compare */}
      <Button
        variant="outline"
        size="sm"
        onClick={onCompare}
        title="Compare Products"
      >
        <BarChart3 className="w-4 h-4" />
      </Button>

      {/* Share */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        title="Share Product"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProductQuickActions;