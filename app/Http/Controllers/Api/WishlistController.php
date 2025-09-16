<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Get user's wishlist
     */
    public function index(Request $request)
    {
        $wishlistItems = $request->user()
            ->wishlistItems()
            ->with([
                'product.images',
                'product.categories:id,name'
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'wishlist_items' => $wishlistItems->items(),
            'pagination' => [
                'current_page' => $wishlistItems->currentPage(),
                'last_page' => $wishlistItems->lastPage(),
                'per_page' => $wishlistItems->perPage(),
                'total' => $wishlistItems->total(),
            ]
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function add(Request $request, $productId)
    {
        $product = Product::active()->find($productId);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $user = $request->user();

        if ($user->wishlistItems()->where('product_id', $productId)->exists()) {
            return response()->json([
                'message' => 'Product is already in wishlist',
                'in_wishlist' => true
            ], 422);
        }

        $user->wishlistItems()->create([
            'product_id' => $productId
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'in_wishlist' => true
        ]);
    }

    /**
     * Remove product from wishlist
     */
    public function remove(Request $request, $productId)
    {
        $wishlistItem = $request->user()
            ->wishlistItems()
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json([
                'message' => 'Product not found in wishlist'
            ], 404);
        }

        $wishlistItem->delete();

        return response()->json([
            'message' => 'Product removed from wishlist',
            'in_wishlist' => false
        ]);
    }

    /**
     * Check if product is in wishlist
     */
    public function check(Request $request, $productId)
    {
        $inWishlist = $request->user()
            ->wishlistItems()
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'in_wishlist' => $inWishlist
        ]);
    }

    /**
     * Move product from wishlist to cart
     */
    public function moveToCart(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'nullable|integer|min:1|max:99',
            'product_variant_id' => 'nullable|exists:product_variants,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $wishlistItem = $user->wishlistItems()->where('product_id', $productId)->first();

        if (!$wishlistItem) {
            return response()->json([
                'message' => 'Product not found in wishlist'
            ], 404);
        }

        $product = $wishlistItem->product;

        if (!$product->in_stock || $product->status !== 'active') {
            return response()->json([
                'message' => 'Product is no longer available'
            ], 422);
        }

        $quantity = $request->get('quantity', 1);

        try {
            $user->addToCart($productId, $quantity, $request->product_variant_id);
            $wishlistItem->delete();

            return response()->json([
                'message' => 'Product moved to cart successfully',
                'cart_count' => $user->getCartItemsCount()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add product to cart',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Clear wishlist
     */
    public function clear(Request $request)
    {
        $request->user()->wishlistItems()->delete();

        return response()->json([
            'message' => 'Wishlist cleared successfully'
        ]);
    }
}
