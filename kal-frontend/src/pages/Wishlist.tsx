import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist: React.FC = () => {
  const {
    wishlistItems,
    isLoading,
    removeFromWishlist,
    moveToCart,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleMoveToCart = async (productId: number) => {
    try {
      await moveToCart(productId);
    } catch (error) {
      // If move to cart fails, try adding to cart directly
      await addToCart(productId, 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist and they'll appear here.
            </p>
            <Link to="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link to={`/products/${item.product?.id}`} className="block">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={item.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                    alt={item.product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Sale Badge */}
                  {item.product?.on_sale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{item.product.discount_percentage}%
                    </div>
                  )}

                  {/* Stock Status */}
                  {!item.product?.in_stock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMoveToCart(item.product?.id || 0);
                        }}
                        disabled={!item.product?.in_stock}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWishlist(item.product?.id || 0);
                        }}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Brand */}
                  {item.product?.brand && (
                    <p className="text-sm text-gray-500 mb-1">{item.product.brand}</p>
                  )}

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {item.product?.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product?.current_price || 0}
                    </span>
                    {item.product?.on_sale && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.price}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  {item.product?.in_stock ? (
                    <p className="text-sm text-green-600 mt-2">In Stock</p>
                  ) : (
                    <p className="text-sm text-red-600 mt-2">Out of Stock</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Select items to add to cart or remove from wishlist
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  // Add all available items to cart
                  wishlistItems.forEach(item => {
                    if (item.product?.in_stock) {
                      handleMoveToCart(item.product.id);
                    }
                  });
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  // Share wishlist (would implement sharing functionality)
                  console.log('Share wishlist');
                }}
              >
                Share Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would typically show recommended products based on wishlist items */}
            <div className="text-center py-8 text-gray-500">
              <p>Recommended products will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
