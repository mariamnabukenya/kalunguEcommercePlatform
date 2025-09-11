<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Get reviews for a product
     */
    public function productReviews(Request $request, $productId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $query = $product->approvedReviews()
            ->with(['user:id,name'])
            ->orderBy('created_at', 'desc');

        // Filter by rating
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest_rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest_rating':
                $query->orderBy('rating', 'asc');
                break;
            case 'most_helpful':
                $query->orderByRaw('JSON_LENGTH(COALESCE(helpful_votes, "[]")) DESC');
                break;
            default: // newest
                $query->orderBy('created_at', 'desc');
        }

        $reviews = $query->paginate(10);

        // Get rating distribution
        $ratingDistribution = $product->approvedReviews()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get()
            ->pluck('count', 'rating')
            ->toArray();

        // Fill missing ratings with 0
        for ($i = 1; $i <= 5; $i++) {
            if (!isset($ratingDistribution[$i])) {
                $ratingDistribution[$i] = 0;
            }
        }

        return response()->json([
            'reviews' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
            'rating_summary' => [
                'average_rating' => $product->average_rating,
                'total_reviews' => $product->review_count,
                'rating_distribution' => $ratingDistribution,
            ]
        ]);
    }

    /**
     * Create a new review
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check if user already reviewed this product
        $existingReview = $user->reviews()
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        // Check if user purchased the product (for verified purchase)
        $hasPurchased = $user->orders()
            ->whereHas('items', function ($query) use ($request) {
                $query->where('product_id', $request->product_id);
            })
            ->where('status', 'delivered')
            ->exists();

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_verified_purchase' => $hasPurchased,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review->load('user:id,name')
        ], 201);
    }

    /**
     * Update user's review
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'sometimes|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review = $request->user()->reviews()->find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        $review->update($validator->validated());

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->load('user:id,name')
        ]);
    }

    /**
     * Delete user's review
     */
    public function destroy(Request $request, $id)
    {
        $review = $request->user()->reviews()->find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Get user's reviews
     */
    public function userReviews(Request $request)
    {
        $reviews = $request->user()
            ->reviews()
            ->with(['product:id,name,slug', 'product.images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'reviews' => $reviews->items(),
            'pagination' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ]
        ]);
    }

    /**
     * Mark review as helpful
     */
    public function markHelpful(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'message' => 'Review not found'
            ], 404);
        }

        $userId = $request->user()->id;
        $review->toggleHelpful($userId);

        return response()->json([
            'message' => 'Review helpfulness updated',
            'is_helpful' => $review->isHelpfulFor($userId),
            'helpful_count' => $review->helpful_votes_count
        ]);
    }
}