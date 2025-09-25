<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;    
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartItemController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with(['product.images', 'variant'])
            ->get()
            ->map(function ($item) {
                return [
                    'id'              => $item->id,
                    'product'         => $item->product,
                    'variant'         => $item->variant,
                    'quantity'        => $item->quantity,
                    'price'           => $item->price,
                    'total_price'     => $item->total_price,
                    'current_price'   => $item->getCurrentProductPrice(),
                    'is_available'    => $item->isAvailable(),
                    'available_stock' => $item->getAvailableStock(),
                ];
            });

        $total      = $cartItems->sum('total_price');
        $totalItems = $cartItems->sum('quantity');

        return response()->json([
            'cart_items' => $cartItems,
            'totals' => [
                'subtotal'          => $total,
                'total_items'       => $totalItems,
                'tax_estimate'      => $total * 0.1, 
                'shipping_estimate' => $total > 100 ? 0 : 10,
                'total_estimate'    => $total + ($total * 0.1) + ($total > 100 ? 0 : 10),
            ]
        ]);
    }

    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity'   => 'required|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $product = Product::find($request->product_id);
        $variant = $request->variant_id ? ProductVariant::find($request->variant_id) : null;

        if (!$product->in_stock || $product->status !== 'active') {
            return response()->json(['message' => 'Product is not available'], 422);
        }

        if ($variant && !$variant->in_stock) {
            return response()->json(['message' => 'Product variant is not available'], 422);
        }

        $availableStock = $variant ? $variant->stock_quantity : $product->stock_quantity;
        if ($request->quantity > $availableStock) {
            return response()->json([
                'message' => 'Insufficient stock. Only ' . $availableStock . ' items available.'
            ], 422);
        }

        $existingItem = $request->user()->cartItems()
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $request->quantity;

            if ($newQuantity > $availableStock) {
                return response()->json([
                    'message' => 'Cannot add more items. Total would exceed available stock of ' . $availableStock
                ], 422);
            }

            $existingItem->update([
                'quantity' => $newQuantity,
                'price'    => $variant ? $variant->current_price : $product->current_price,
            ]);

            $cartItem = $existingItem;
        } else {
            $cartItem = $request->user()->cartItems()->create([
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'quantity'   => $request->quantity,
                'price'      => $variant ? $variant->current_price : $product->current_price,
            ]);
        }

        return response()->json([
            'message'     => 'Item added to cart successfully',
            'cart_item'   => $cartItem->load(['product.images', 'variant']),
            'cart_count'  => $request->user()->getCartItemsCount()
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $cartItem = $request->user()->cartItems()->find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        if ($request->quantity > $cartItem->getAvailableStock()) {
            return response()->json([
                'message' => 'Insufficient stock. Only ' . $cartItem->getAvailableStock() . ' items available.'
            ], 422);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
            'price'    => $cartItem->getCurrentProductPrice(),
        ]);

        return response()->json([
            'message'    => 'Cart item updated successfully',
            'cart_item'  => $cartItem->load(['product.images', 'variant']),
            'cart_count' => $request->user()->getCartItemsCount()
        ]);
    }

    public function remove(Request $request, $id)
    {
        $cartItem = $request->user()->cartItems()->find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json([
            'message'    => 'Item removed from cart successfully',
            'cart_count' => $request->user()->getCartItemsCount()
        ]);
    }

    public function clear(Request $request)
    {
        $request->user()->cartItems()->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }

    public function count(Request $request)
    {
        return response()->json([
            'count' => $request->user()->getCartItemsCount()
        ]);
    }
}
