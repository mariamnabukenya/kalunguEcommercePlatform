import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import Button from './Button';
import ProductZoom from './ProductZoom';

interface ProductGalleryProps {
  product: Product;
  className?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openZoom = () => {
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
  };

  if (images.length === 0) {
    return (
      <div className={cn('aspect-square bg-gray-100 rounded-lg flex items-center justify-center', className)}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      <div className={cn('relative group', className)}>
        {/* Main Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-white">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || product.name}
            className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
            onClick={openZoom}
          />
          
          {/* Zoom Icon */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn className="w-8 h-8 text-white" />
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'aspect-square overflow-hidden rounded-lg border-2 transition-colors',
                  index === currentIndex
                    ? 'border-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || `${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <ProductZoom
        src={currentImage.image_url}
        alt={currentImage.alt_text || product.name}
        isOpen={isZoomOpen}
        onClose={closeZoom}
      />
    </>
  );
};

export default ProductGallery;
