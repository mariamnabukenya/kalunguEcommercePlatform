import React, { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { Product } from '../types';
import Button from './Button';
import StarRating from './StarRating';
import Badge from './Badge';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: number) => void;
  onClearAll: () => void;
  className?: string;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
  onClearAll,
  className = '',
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    'name',
    'price',
    'rating',
    'description',
    'brand',
    'category',
    'weight',
    'dimensions',
    'materials',
    'care_instructions',
  ]);

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500">
          <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products to compare</h3>
          <p className="text-gray-500">Add products to compare their features and specifications.</p>
        </div>
      </div>
    );
  }

  const getAttributeValue = (product: Product, attribute: string): string => {
    switch (attribute) {
      case 'name':
        return product.name;
      case 'price':
        return `$${product.current_price}`;
      case 'rating':
        return `${product.average_rating}/5 (${product.review_count} reviews)`;
      case 'description':
        return product.description || 'No description available';
      case 'brand':
        return product.brand || 'N/A';
      case 'category':
        return product.category?.name || 'N/A';
      case 'weight':
        return product.weight ? `${product.weight}g` : 'N/A';
      case 'dimensions':
        return product.dimensions || 'N/A';
      case 'materials':
        return product.materials || 'N/A';
      case 'care_instructions':
        return product.care_instructions || 'N/A';
      default:
        return 'N/A';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Product Comparison ({products.length} items)
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Features
              </th>
              {products.map((product) => (
                <th key={product.id} className="px-6 py-3 text-center text-sm font-medium text-gray-500 relative">
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="pt-6">
                    <img
                      src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover mx-auto mb-2 rounded"
                    />
                    <h3 className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <StarRating rating={product.average_rating} size="sm" />
                    </div>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      {product.on_sale && (
                        <Badge variant="sale" size="sm">
                          {product.discount_percentage}% OFF
                        </Badge>
                      )}
                      {product.featured && (
                        <Badge variant="featured" size="sm">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedAttributes.map((attribute) => (
              <tr key={attribute} className="border-b border-gray-100">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                  {attribute.replace('_', ' ')}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="px-6 py-4 text-sm text-gray-600 text-center">
                    {attribute === 'rating' ? (
                      <div className="flex flex-col items-center space-y-1">
                        <StarRating rating={product.average_rating} size="sm" />
                        <span className="text-xs text-gray-500">
                          ({product.review_count} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="break-words">
                        {getAttributeValue(product, attribute)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;
