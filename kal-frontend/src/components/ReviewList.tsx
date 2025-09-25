import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '../types';
import StarRating from './StarRating';
import { formatDate } from '../lib/utils';
import Button from './Button';

interface ReviewListProps {
  reviews: Review[];
  onMarkHelpful?: (reviewId: number) => void;
  className?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onMarkHelpful,
  className = '',
}) => {
  if (reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.user?.name || 'Anonymous'}
                </h4>
                <StarRating rating={review.rating} size="sm" showValue />
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </div>
          </div>

          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
          )}

          {review.comment && (
            <p className="text-gray-600 mb-4">{review.comment}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkHelpful?.(review.id)}
                className="text-gray-500 hover:text-green-600"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.is_helpful_count})
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
