import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

interface ProductZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ProductZoom: React.FC<ProductZoomProps> = ({
  src,
  alt,
  isOpen,
  onClose,
  className = '',
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <Button
            onClick={handleZoomIn}
            size="sm"
            variant="outline"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleZoomOut}
            size="sm"
            variant="outline"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleRotate}
            size="sm"
            variant="outline"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
          >
            Reset
          </Button>
        </div>

        {/* Image */}
        <div
          className="flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className={cn(
              'max-w-full max-h-full object-contain transition-transform duration-200',
              className
            )}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            }}
            draggable={false}
          />
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 px-3 py-1 rounded text-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default ProductZoom;
