import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Button from './Button';
import StarRating from './StarRating';
import Badge from './Badge';
import ProductGallery from './ProductGallery';
import QuantitySelector from './QuantitySelector';
import ProductVariants from './ProductVariants';
import ProductPrice from './ProductPrice';
import ProductRating from './ProductRating';
import ProductStockStatus from './ProductStockStatus';

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  React.useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(null);
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    const productToAdd = selectedVariant || product;
    addToCart(productToAdd, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
  };

  const currentProduct = selectedVariant || product;
  const isAvailable = currentProduct.in_stock;
  const maxQuantity = currentProduct.stock_quantity || 10;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Quick View
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <ProductGallery product={product} />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    <div className="flex items-center space-x-2">
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

                  <div className="mb-4">
                    <ProductPrice product={currentProduct} size="lg" />
                  </div>

                  <div className="mb-4">
                    <ProductRating product={product} size="md" showCount />
                  </div>

                  <div className="mb-4">
                    <ProductStockStatus 
                      product={currentProduct} 
                      selectedVariant={selectedVariant}
                      showQuantity 
                    />
                  </div>

                  <p className="text-gray-600 mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Product Variants */}
                {product.variants && product.variants.length > 0 && (
                  <ProductVariants
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={handleVariantSelect}
                  />
                )}

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={maxQuantity}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!isAvailable}
                      className="flex-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleWishlistToggle}
                      className={isInWishlist(product.id) ? 'text-red-600' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Product Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">SKU:</span> {product.sku}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {product.category?.name}
                    </div>
                    <div>
                      <span className="font-medium">Brand:</span> {product.brand}
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {product.weight}g
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
