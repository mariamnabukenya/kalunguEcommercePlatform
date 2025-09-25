import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';
import Button from './Button';

interface BackToTopProps {
  className?: string;
  threshold?: number;
  smooth?: boolean;
  showText?: boolean;
}

const BackToTop: React.FC<BackToTopProps> = ({
  className = '',
  threshold = 300,
  smooth = true,
  showText = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
        className
      )}
      size="sm"
      title="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
      {showText && (
        <span className="ml-2 hidden sm:inline">Back to Top</span>
      )}
    </Button>
  );
};

export default BackToTop;
