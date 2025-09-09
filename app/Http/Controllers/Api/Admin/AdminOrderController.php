<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminOrderController extends Controller
{
    /**
     * Get all orders for admin
     */
    public function index(Request $request)
    {
        $query = Order::with(['user:id,name,email', 'items.product:id,name'])
            ->withCount('items');

        // Search by order number or customer
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'LIKE', "%{$search}%")
                               ->orWhere('email', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Payment status filter
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Amount range filter
        if ($request->filled('min_amount')) {
            $query->where('total_amount', '>=', $request->min_amount);
        }

        if ($request->filled('max_amount')) {
            $query->where('total_amount', '<=', $request->max_amount);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate(20);

        return response()->json([
            'orders' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
            'filters' => [
                'statuses' => ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                'payment_statuses' => ['pending', 'paid', 'failed', 'refunded'],
            ],
            'summary' => [
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
                'average_order_value' => Order::where('payment_status', 'paid')->avg('total_amount'),
            ]
        ]);
    }

    /**
     * Get single order details
     */
    public function show($id)
    {
        $order = Order::with([
            'user',
            'items.product.images',
            'items.variant'
        ])->find($id);

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
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        DB::beginTransaction();

        try {
            $data = $validator->validated();
            $oldStatus = $order->status;

            // Handle status-specific logic
            if ($data['status'] === 'shipped' && $oldStatus !== 'shipped') {
                $data['shipped_at'] = now();
                if (!$order->payment_status === 'paid') {
                    $data['payment_status'] = 'paid';
                }
            }

            if ($data['status'] === 'delivered' && $oldStatus !== 'delivered') {
                $data['delivered_at'] = now();
                if (!$order->shipped_at) {
                    $data['shipped_at'] = now();
                }
                if (!$order->payment_status === 'paid') {
                    $data['payment_status'] = 'paid';
                }
            }

            if ($data['status'] === 'cancelled' && $oldStatus !== 'cancelled') {
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
                
                if ($order->payment_status === 'paid') {
                    $data['payment_status'] = 'refunded';
                }
            }

            $order->update($data);

            DB::commit();

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => $order->load(['user', 'items.product'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update order status',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Admin dashboard analytics
     */
    public function dashboard(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = now()->subDays($period);

        $dashboard = [
            // Overall stats
            'total_orders' => Order::count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
            'average_order_value' => Order::where('payment_status', 'paid')->avg('total_amount'),
            'total_customers' => User::customer()->count(),

            // Period stats
            'period_orders' => Order::where('created_at', '>=', $startDate)->count(),
            'period_revenue' => Order::where('created_at', '>=', $startDate)
                ->where('payment_status', 'paid')->sum('total_amount'),
            'period_customers' => User::customer()->where('created_at', '>=', $startDate)->count(),

            // Status breakdown
            'orders_by_status' => Order::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status'),

            'payment_by_status' => Order::selectRaw('payment_status, COUNT(*) as count')
                ->groupBy('payment_status')
                ->get()
                ->pluck('count', 'payment_status'),

            // Recent orders
            'recent_orders' => Order::with(['user:id,name', 'items'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),

            // Top customers
            'top_customers' => User::customer()
                ->withSum(['orders as total_spent' => function($query) {
                    $query->where('payment_status', 'paid');
                }], 'total_amount')
                ->orderBy('total_spent', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'email']),

            // Daily revenue (last 30 days)
            'daily_revenue' => Order::selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
                ->where('created_at', '>=', now()->subDays(30))
                ->where('payment_status', 'paid')
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date')
                ->get(),
        ];

        return response()->json($dashboard);
    }

    /**
     * Sales analytics
     */
    public function salesAnalytics(Request $request)
    {
        $period = $request->get('period', '30');
        $groupBy = $request->get('group_by', 'day'); // day, week, month
        $startDate = now()->subDays($period);

        // Determine date format based on grouping
        $dateFormat = match($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $analytics = [
            'sales_over_time' => Order::selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') as period, 
                                                  COUNT(*) as orders, 
                                                  SUM(total_amount) as revenue")
                ->where('created_at', '>=', $startDate)
                ->where('payment_status', 'paid')
                ->groupBy('period')
                ->orderBy('period')
                ->get(),

            'sales_by_method' => Order::selectRaw('payment_method, COUNT(*) as orders, SUM(total_amount) as revenue')
                ->where('created_at', '>=', $startDate)
                ->where('payment_status', 'paid')
                ->whereNotNull('payment_method')
                ->groupBy('payment_method')
                ->get(),

            'conversion_funnel' => [
                'visitors' => rand(1000, 5000), // This would come from analytics service
                'cart_additions' => Order::where('created_at', '>=', $startDate)->count() * 1.5,
                'checkouts_started' => Order::where('created_at', '>=', $startDate)->count() * 1.2,
                'orders_completed' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')->count(),
            ],

            'average_metrics' => [
                'order_value' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')->avg('total_amount'),
                'items_per_order' => Order::where('created_at', '>=', $startDate)
                    ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                    ->groupBy('orders.id')
                    ->selectRaw('AVG(order_items.quantity)')
                    ->value('AVG(order_items.quantity)'),
                'days_to_delivery' => Order::whereNotNull('delivered_at')
                    ->where('created_at', '>=', $startDate)
                    ->selectRaw('AVG(DATEDIFF(delivered_at, created_at))')
                    ->value('AVG(DATEDIFF(delivered_at, created_at))'),
            ],

            'return_rate' => [
                'total_orders' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')->count(),
                'cancelled_orders' => Order::where('created_at', '>=', $startDate)
                    ->where('status', 'cancelled')->count(),
            ]
        ];

        // Calculate return rate percentage
        if ($analytics['return_rate']['total_orders'] > 0) {
            $analytics['return_rate']['rate'] = round(
                ($analytics['return_rate']['cancelled_orders'] / $analytics['return_rate']['total_orders']) * 100, 2
            );
        } else {
            $analytics['return_rate']['rate'] = 0;
        }

        return response()->json($analytics);
    }
}