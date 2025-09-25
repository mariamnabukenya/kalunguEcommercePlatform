import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Star,
  Eye,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { apiService } from '../../lib/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

const AdminReviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery(
    ['admin-reviews', currentPage, searchTerm, statusFilter],
    () => apiService.getAdminReviews({ 
      page: currentPage, 
      search: searchTerm,
      status: statusFilter 
    }),
    {
      keepPreviousData: true,
    }
  );

  const approveReviewMutation = useMutation(
    (id: number) => apiService.approveReview(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-reviews');
        toast.success('Review approved successfully');
      },
      onError: () => {
        toast.error('Failed to approve review');
      },
    }
  );

  const rejectReviewMutation = useMutation(
    (id: number) => apiService.rejectReview(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-reviews');
        toast.success('Review rejected successfully');
      },
      onError: () => {
        toast.error('Failed to reject review');
      },
    }
  );

  const deleteReviewMutation = useMutation(
    (id: number) => apiService.deleteReview(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-reviews');
        toast.success('Review deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete review');
      },
    }
  );

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  const handleApproveReview = (id: number) => {
    approveReviewMutation.mutate(id);
  };

  const handleRejectReview = (id: number) => {
    rejectReviewMutation.mutate(id);
  };

  const handleDeleteReview = (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(id);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600 mt-2">Moderate and manage customer reviews</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviewsData?.reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 truncate">
                          {review.title || 'No title'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {review.comment}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={review.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                          alt={review.product?.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{review.product?.name}</p>
                          <p className="text-sm text-gray-500">SKU: {review.product?.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{review.user?.name}</p>
                        <p className="text-sm text-gray-500">{review.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StarRating rating={review.rating} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : review.is_approved === false
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.is_approved === null ? 'Pending' : 
                         review.is_approved ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewReview(review)}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Review"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {review.is_approved === null && (
                          <>
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="text-gray-400 hover:text-green-600"
                              title="Approve Review"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectReview(review.id)}
                              className="text-gray-400 hover:text-red-600"
                              title="Reject Review"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {reviewsData?.reviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">Customer reviews will appear here for moderation.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {reviewsData?.pagination && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={reviewsData.pagination.total_pages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Review Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Review #${selectedReview?.id}`}
          size="lg"
        >
          {selectedReview && (
            <div className="space-y-6">
              {/* Review Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedReview.title || 'No title'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    By {selectedReview.user?.name} on {new Date(selectedReview.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StarRating rating={selectedReview.rating} size="lg" />
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Product Reviewed</h4>
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedReview.product?.images?.[0]?.image_url || '/placeholder-product.jpg'}
                    alt={selectedReview.product?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReview.product?.name}</p>
                    <p className="text-sm text-gray-600">SKU: {selectedReview.product?.sku}</p>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Review Content</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">{selectedReview.comment}</p>
                </div>
              </div>

              {/* Review Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Helpful Votes</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {selectedReview.is_helpful_count || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {selectedReview.rating}/5
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedReview.is_approved 
                      ? 'bg-green-100 text-green-800' 
                      : selectedReview.is_approved === false
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedReview.is_approved === null ? 'Pending Review' : 
                     selectedReview.is_approved ? 'Approved' : 'Rejected'}
                  </span>
                </div>
                
                {selectedReview.is_approved === null && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleApproveReview(selectedReview.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectReview(selectedReview.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminReviews;
