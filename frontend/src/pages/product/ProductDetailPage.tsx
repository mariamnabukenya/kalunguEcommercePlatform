import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Product Details {id}
      </h1>
      <div className="text-center py-12">
        <p className="text-gray-600">Product details coming soon...</p>
      </div>
    </div>
  );
};

export default ProductDetailPage;