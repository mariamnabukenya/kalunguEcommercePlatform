import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Send } from 'lucide-react';
import { ReviewForm as ReviewFormType } from '../types';
import { apiService } from '../lib/api';
import Button from './Button';
import Input from './Input';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
  className = '',
}) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<ReviewFormType, 'rating'>>();

  const onSubmit = async (data: Omit<ReviewFormType, 'rating'>) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createReview({
        product_id: productId,
        rating,
        title: data.title,
        comment: data.comment,
      });
      
      toast.success('Review submitted successfully!');
      reset();
      setRating(0);
      onReviewSubmitted?.();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={rating}
            interactive
            onRatingChange={setRating}
            size="lg"
          />
          {rating === 0 && (
            <p className="text-sm text-red-600 mt-1">Please select a rating</p>
          )}
        </div>

        {/* Title */}
        <Input
          label="Review Title"
          placeholder="Summarize your experience"
          {...register('title', {
            maxLength: {
              value: 100,
              message: 'Title must be no more than 100 characters',
            },
          })}
          error={errors.title?.message}
        />

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review *
          </label>
          <textarea
            {...register('comment', {
              required: 'Review is required',
              minLength: {
                value: 10,
                message: 'Review must be at least 10 characters long',
              },
              maxLength: {
                value: 1000,
                message: 'Review must be no more than 1000 characters',
              },
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Share your thoughts about this product..."
          />
          {errors.comment && (
            <p className="text-sm text-red-600 mt-1">{errors.comment.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={rating === 0}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Review
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
