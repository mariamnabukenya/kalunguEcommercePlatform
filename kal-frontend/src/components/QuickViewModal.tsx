import React from 'react';
import { X, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Button from './Button';
import StarRating from './StarRating';
import Badge from './Badge';
import ImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  React.useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

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
                <ImageGallery
                  images={product.images || []}
                  productName={product.name}
                />
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

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${product.current_price}
                      </span>
                      {product.on_sale && product.original_price && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <StarRating rating={product.average_rating} size="md" showValue />
                    <span className="text-sm text-gray-500">
                      ({product.review_count} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <QuantitySelector
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.stock_quantity || 10}
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.in_stock}
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

                  {/* Stock Status */}
                  <div className="text-sm">
                    {product.in_stock ? (
                      <span className="text-green-600 font-medium">
                        ✓ In Stock ({product.stock_quantity} available)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        ✗ Out of Stock
                      </span>
                    )}
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

export default QuickViewModal;
