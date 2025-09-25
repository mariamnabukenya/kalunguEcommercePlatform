import React, { useState } from 'react';
import { cn } from '../lib/utils';
import StarRating from './StarRating';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductTabsProps {
  product: any;
  reviews?: any[];
  onReviewSubmitted?: () => void;
  className?: string;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviews = [],
  onReviewSubmitted,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="text-gray-600">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Brand:</span>
                  <span className="text-gray-600">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="text-gray-600">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Weight:</span>
                  <span className="text-gray-600">{product.weight ? `${product.weight}g` : 'N/A'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Dimensions:</span>
                  <span className="text-gray-600">{product.dimensions || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Materials:</span>
                  <span className="text-gray-600">{product.materials || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Care Instructions:</span>
                  <span className="text-gray-600">{product.care_instructions || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Origin:</span>
                  <span className="text-gray-600">{product.origin || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                  <StarRating rating={product.average_rating} size="lg" showValue />
                  <span className="text-sm text-gray-500">
                    Based on {product.review_count} reviews
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Rating Distribution</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = product.review_count > 0 ? (count / product.review_count) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-8">{rating}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Review Highlights</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Most customers love the quality</p>
                    <p>• Great value for money</p>
                    <p>• Fast shipping and delivery</p>
                    <p>• Excellent customer service</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={onReviewSubmitted}
            />

            {/* Review List */}
            <ReviewList reviews={reviews} />
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Standard Shipping:</span>
                    <span>3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Shipping:</span>
                    <span>1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Shipping:</span>
                    <span>Orders over $50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>International:</span>
                    <span>7-14 business days</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Return Policy</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Return Period:</span>
                    <span>30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Condition:</span>
                    <span>Unused, with tags</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Return Shipping:</span>
                    <span>Free over $50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refund Time:</span>
                    <span>3-5 business days</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-800">
                If you have any questions about shipping, returns, or this product, 
                please contact our customer service team. We're here to help!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;
