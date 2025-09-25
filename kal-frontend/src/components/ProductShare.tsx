import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Product } from '../types';
import Button from './Button';
import Modal from './Modal';
import { cn } from '../lib/utils';

interface ProductShareProps {
  product: Product;
  className?: string;
}

const ProductShare: React.FC<ProductShareProps> = ({
  product,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}/products/${product.id}`;
  const shareText = `Check out this amazing ${product.name} from Kalungu!`;

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-400 hover:text-white',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
      },
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'hover:bg-pink-600 hover:text-white',
      action: () => {
        // Instagram doesn't support direct sharing, so we'll copy the link
        navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'hover:bg-gray-600 hover:text-white',
      action: () => {
        const subject = `Check out this ${product.name}`;
        const body = `${shareText}\n\n${productUrl}`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Share2 className="w-4 h-4 mr-1" />
        Share
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Share Product"
        size="md"
      >
        <div className="space-y-6">
          {/* Product Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={product.images?.[0]?.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">${product.current_price}</p>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors',
                      option.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Link */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Copy Link</h4>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={productUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Native Share (Mobile) */}
          {navigator.share && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleNativeShare}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share via Device
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProductShare;
