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
     * Get reviews for a specific product
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
            ->with(['user:id,name']);

        // Filter by rating
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        // Sorting
        switch ($request->get('sort_by', 'newest')) {
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

        // Rating distribution
        $ratingDistribution = $product->approvedReviews()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        // Ensure all star levels are present
        for ($i = 1; $i <= 5; $i++) {
            $ratingDistribution[$i] = $ratingDistribution[$i] ?? 0;
        }

        return response()->json([
            'success' => true,
            'data' => [
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
            ]
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'order_id'   => 'nullable|exists:orders,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:255',
            'comment'    => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Prevent duplicate review
        if ($user->reviews()->where('product_id', $request->product_id)->exists()) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        // Check verified purchase
        $hasPurchased = $user->orders()
            ->whereHas('items', fn($q) => $q->where('product_id', $request->product_id))
            ->where('status', 'delivered')
            ->exists();

        $review = Review::create([
            'user_id'             => $user->id,
            'product_id'          => $request->product_id,
            'order_id'            => $request->order_id,
            'rating'              => $request->rating,
            'title'               => $request->title,
            'comment'             => $request->comment,
            'is_verified_purchase'=> $hasPurchased,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => $review->load('user:id,name')
        ], 201);
    }

    /**
     * Update an existing review
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating'  => 'sometimes|integer|min:1|max:5',
            'title'   => 'nullable|string|max:255',
            'comment' => 'sometimes|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
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
            'review'  => $review->load('user:id,name')
        ]);
    }

    /**
     * Delete a review
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
     * Get logged-in user's reviews
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
                'last_page'    => $reviews->lastPage(),
                'per_page'     => $reviews->perPage(),
                'total'        => $reviews->total(),
            ]
        ]);
    }

    /**
     * Toggle helpful vote on a review
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
            'message'       => 'Review helpfulness updated',
            'is_helpful'    => $review->isHelpfulFor($userId),
            'helpful_count' => $review->helpful_votes_count
        ]);
    }
}
