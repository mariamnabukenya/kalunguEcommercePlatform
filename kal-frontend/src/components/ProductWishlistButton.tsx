import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import Button from './Button';
import { cn } from '../lib/utils';

interface ProductWishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
  className?: string;
}

const ProductWishlistButton: React.FC<ProductWishlistButtonProps> = ({
  product,
  size = 'md',
  variant = 'outline',
  showText = false,
  className = '',
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlistState = isInWishlist(product.id);

  return (
    <Button
      onClick={handleToggle}
      size={size}
      variant={variant}
      className={cn(
        'transition-colors',
        isInWishlistState && 'text-red-600 hover:text-red-700',
        className
      )}
      title={isInWishlistState ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <Heart className={cn(
        'transition-colors',
        isInWishlistState ? 'fill-current' : '',
        showText ? 'mr-2' : ''
      )} />
      {showText && (
        <span>
          {isInWishlistState ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
};

export default ProductWishlistButton;
