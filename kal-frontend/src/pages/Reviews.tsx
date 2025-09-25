import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Star, Edit, Trash2, ThumbsUp } from 'lucide-react';
import { apiService } from '../lib/api';
import { Review } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

const Reviews: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery(
    'user-reviews',
    () => apiService.getUserReviews()
  );

  const updateReviewMutation = useMutation(
    ({ id, data }: { id: number; data: any }) => apiService.updateReview(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-reviews');
        setIsModalOpen(false);
        setEditingReview(null);
        toast.success('Review updated successfully');
      },
      onError: () => {
        toast.error('Failed to update review');
      },
    }
  );

  const deleteReviewMutation = useMutation(
    (id: number) => apiService.deleteReview(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-reviews');
        toast.success('Review deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete review');
      },
    }
  );

  const markHelpfulMutation = useMutation(
    (id: number) => apiService.markReviewHelpful(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-reviews');
        toast.success('Thank you for your feedback!');
      },
      onError: () => {
        toast.error('Failed to mark review as helpful');
      },
    }
  );

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(id);
    }
  };

  const handleMarkHelpful = (id: number) => {
    markHelpfulMutation.mutate(id);
  };

  const handleUpdateReview = (data: any) => {
    if (editingReview) {
      updateReviewMutation.mutate({ id: editingReview.id, data });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reviews</h1>

        {!reviews || reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No reviews yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't written any reviews yet. Start by reviewing products you've purchased.
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                      alt={review.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.product?.name}
                      </h3>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="text-sm text-gray-500">
                        Reviewed on {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                )}

                {review.comment && (
                  <p className="text-gray-600 mb-4">{review.comment}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleMarkHelpful(review.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.is_helpful_count})</span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Status: {review.is_approved ? 'Approved' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Review Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Edit Review"
          size="lg"
        >
          {editingReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src={editingReview.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                  alt={editingReview.product?.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {editingReview.product?.name}
                  </h3>
                  <StarRating rating={editingReview.rating} size="sm" />
                </div>
              </div>
              
              <ReviewForm
                productId={editingReview.product_id}
                onSubmit={handleUpdateReview}
                initialData={{
                  rating: editingReview.rating,
                  title: editingReview.title || '',
                  comment: review.comment || '',
                }}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Reviews;
