<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get user's orders
     */
    public function index(Request $request)
    {
        $query = $request->user()->orders()
            ->with(['items.product.images', 'items.variant'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $orders = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ]
            ]
        ]);
    }

    /**
     * Create new order from cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'required|exists:addresses,id',
            'shipping_method' => 'nullable|string|max:100',
            'payment_method' => 'required|string|max:50',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $cartItems = $user->cartItems()->with(['product', 'variant'])->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 422);
        }

        // Verify addresses belong to user
        $shippingAddress = $user->addresses()->find($request->shipping_address_id);
        $billingAddress = $user->addresses()->find($request->billing_address_id);

        if (!$shippingAddress || !$billingAddress) {
            return response()->json([
                'message' => 'Invalid address selected'
            ], 422);
        }

        // Check stock availability for all items
        foreach ($cartItems as $item) {
            if (!$item->isAvailable()) {
                return response()->json([
                    'message' => 'Some items in your cart are no longer available. Please review your cart.'
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = $cartItems->sum('total_price');
            $taxRate = 0.1; // 10% tax
            $taxAmount = $subtotal * $taxRate;
            $shippingAmount = $subtotal > 100 ? 0 : 10; // Free shipping over $100
            $totalAmount = $subtotal + $taxAmount + $shippingAmount;

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'shipping_amount' => $shippingAmount,
                'total_amount' => $totalAmount,
                'payment_method' => $request->payment_method,
                'shipping_address' => $shippingAddress->toAddressArray(),
                'billing_address' => $billingAddress->toAddressArray(),
                'shipping_method' => $request->shipping_method,
                'notes' => $request->notes,
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                $variant = $cartItem->variant;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'product_name' => $product->name,
                    'product_sku' => $variant?->sku ?? $product->sku,
                    'product_attributes' => $variant?->attributes,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->price,
                    'total_price' => $cartItem->total_price,
                ]);

                // Update stock quantities
                if ($variant) {
                    $variant->decrement('stock_quantity', $cartItem->quantity);
                    if ($variant->stock_quantity <= 0) {
                        $variant->update(['in_stock' => false]);
                    }
                } else {
                    $product->decrement('stock_quantity', $cartItem->quantity);
                    if ($product->stock_quantity <= 0) {
                        $product->update(['in_stock' => false]);
                    }
                }
            }

            // Clear cart
            $user->cartItems()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product.images')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to place order. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get single order details
     */
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with(['items.product.images', 'items.variant'])
            ->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'order' => $order
        ]);
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, $id)
    {
        $order = $request->user()->orders()->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'message' => 'Order cannot be cancelled at this stage'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Restore stock quantities
            foreach ($order->items as $item) {
                if ($item->variant) {
                    $item->variant->increment('stock_quantity', $item->quantity);
                    $item->variant->update(['in_stock' => true]);
                } else {
                    $item->product->increment('stock_quantity', $item->quantity);
                    $item->product->update(['in_stock' => true]);
                }
            }

            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'refunded' // In real app, this would trigger refund process
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => $order
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to cancel order. Please try again.'
            ], 500);
        }
    }

    /**
     * Track order
     */
    public function track(Request $request, $id)
    {
        $order = $request->user()->orders()->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        // Order tracking timeline
        $timeline = [
            [
                'status' => 'pending',
                'label' => 'Order Placed',
                'completed' => true,
                'date' => $order->created_at,
            ],
            [
                'status' => 'processing',
                'label' => 'Processing',
                'completed' => in_array($order->status, ['processing', 'shipped', 'delivered']),
                'date' => $order->status === 'processing' ? $order->updated_at : null,
            ],
            [
                'status' => 'shipped',
                'label' => 'Shipped',
                'completed' => in_array($order->status, ['shipped', 'delivered']),
                'date' => $order->shipped_at,
            ],
            [
                'status' => 'delivered',
                'label' => 'Delivered',
                'completed' => $order->status === 'delivered',
                'date' => $order->delivered_at,
            ],
        ];

        return response()->json([
            'order' => $order,
            'timeline' => $timeline,
            'tracking_number' => $order->tracking_number,
            'estimated_delivery' => $order->shipped_at
                ? $order->shipped_at->addDays(3)
                : now()->addDays(5)
        ]);
    }
}
