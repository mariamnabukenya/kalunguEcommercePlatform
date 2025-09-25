import React, { useState } from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import { cn } from '../lib/utils';

interface ProductAddToCartButtonProps {
  product: Product;
  selectedVariant?: any;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductAddToCartButton: React.FC<ProductAddToCartButtonProps> = ({
  product,
  selectedVariant,
  size = 'md',
  className = '',
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productToAdd = selectedVariant || product;
    const quantityToAdd = quantity;
    
    if (onAddToCart) {
      onAddToCart(productToAdd, quantityToAdd);
    } else {
      addToCart(productToAdd, quantityToAdd);
    }
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isAvailable = selectedVariant 
    ? selectedVariant.stock_quantity > 0 
    : product.in_stock;

  const maxQuantity = selectedVariant 
    ? selectedVariant.stock_quantity 
    : product.stock_quantity || 10;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Quantity Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={maxQuantity}
          disabled={!isAvailable}
        />
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!isAvailable}
        size={size}
        className="w-full"
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>

      {/* Stock Status */}
      <div className="text-sm">
        {isAvailable ? (
          <span className="text-green-600 font-medium">
            ✓ In Stock ({maxQuantity} available)
          </span>
        ) : (
          <span className="text-red-600 font-medium">
            ✗ Out of Stock
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductAddToCartButton;
