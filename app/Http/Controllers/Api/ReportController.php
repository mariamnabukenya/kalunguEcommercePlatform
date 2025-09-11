<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Order, User, Product, Review, Category};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Generate comprehensive sales report
     */
    public function salesReport(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $groupBy = $request->get('group_by', 'day'); // day, week, month
        $startDate = now()->subDays($period);

        // Determine date format based on grouping
        $dateFormat = match($groupBy) {
            'week' => '%Y-%u',
            'month' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $report = [
            'period_info' => [
                'period' => "{$period} days",
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => now()->format('Y-m-d'),
                'group_by' => $groupBy
            ],
            'overview' => [
                'total_sales' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')
                    ->sum('total_amount'),
                'total_orders' => Order::where('created_at', '>=', $startDate)->count(),
                'average_order_value' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')
                    ->avg('total_amount'),
                'total_items_sold' => DB::table('order_items')
                    ->join('orders', 'order_items.order_id', '=', 'orders.id')
                    ->where('orders.created_at', '>=', $startDate)
                    ->where('orders.payment_status', 'paid')
                    ->sum('order_items.quantity'),
            ],
            'sales_over_time' => Order::selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') as period, 
                                                  COUNT(*) as orders, 
                                                  SUM(total_amount) as revenue,
                                                  AVG(total_amount) as avg_order_value")
                ->where('created_at', '>=', $startDate)
                ->where('payment_status', 'paid')
                ->groupBy('period')
                ->orderBy('period')
                ->get(),
            'sales_by_status' => Order::selectRaw('status, COUNT(*) as orders, SUM(total_amount) as revenue')
                ->where('created_at', '>=', $startDate)
                ->groupBy('status')
                ->get(),
            'sales_by_payment_method' => Order::selectRaw('payment_method, COUNT(*) as orders, SUM(total_amount) as revenue')
                ->where('created_at', '>=', $startDate)
                ->where('payment_status', 'paid')
                ->whereNotNull('payment_method')
                ->groupBy('payment_method')
                ->get(),
            'top_selling_products' => DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('orders.created_at', '>=', $startDate)
                ->where('orders.payment_status', 'paid')
                ->select('products.name', 'products.price')
                ->selectRaw('SUM(order_items.quantity) as quantity_sold')
                ->selectRaw('SUM(order_items.total_price) as revenue')
                ->groupBy('products.id', 'products.name', 'products.price')
                ->orderBy('quantity_sold', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($report);
    }

    /**
     * Generate user analytics report
     */
    public function userReport(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays($period);

        $report = [
            'period_info' => [
                'period' => "{$period} days",
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => now()->format('Y-m-d'),
            ],
            'user_overview' => [
                'total_users' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'super_admins' => User::where('role', 'super_admin')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'verified_users' => User::whereNotNull('email_verified_at')->count(),
            ],
            'user_growth' => User::selectRaw('DATE(created_at) as date, COUNT(*) as new_users')
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'user_activity' => [
                'users_with_orders' => User::whereHas('orders')->count(),
                'users_with_reviews' => User::whereHas('reviews')->count(),
                'users_with_wishlist_items' => User::whereHas('wishlistItems')->count(),
                'recently_active' => User::where('last_login_at', '>=', now()->subDays(7))->count(),
            ],
            'customer_lifetime_value' => [
                'average_ltv' => User::where('role', 'customer')
                    ->withSum(['orders as total_spent' => function($q) {
                        $q->where('payment_status', 'paid');
                    }], 'total_amount')
                    ->avg('total_spent') ?? 0,
                'ltv_distribution' => [
                    '0-100' => User::where('role', 'customer')
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingRaw('COALESCE(total_spent, 0) <= 100')
                        ->count(),
                    '101-500' => User::where('role', 'customer')
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingRaw('total_spent BETWEEN 101 AND 500')
                        ->count(),
                    '501-1000' => User::where('role', 'customer')
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingRaw('total_spent BETWEEN 501 AND 1000')
                        ->count(),
                    '1000+' => User::where('role', 'customer')
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingRaw('total_spent > 1000')
                        ->count(),
                ]
            ],
            'top_customers' => User::where('role', 'customer')
                ->withSum(['orders as total_spent' => function($q) {
                    $q->where('payment_status', 'paid');
                }], 'total_amount')
                ->withCount('orders')
                ->orderBy('total_spent', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'email', 'created_at'])
        ];

        return response()->json($report);
    }

    /**
     * Generate product analytics report
     */
    public function productReport(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays($period);

        $report = [
            'period_info' => [
                'period' => "{$period} days",
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => now()->format('Y-m-d'),
            ],
            'product_overview' => [
                'total_products' => Product::count(),
                'active_products' => Product::where('status', 'active')->count(),
                'inactive_products' => Product::where('status', 'inactive')->count(),
                'draft_products' => Product::where('status', 'draft')->count(),
                'featured_products' => Product::where('featured', true)->count(),
                'out_of_stock' => Product::where('in_stock', false)->count(),
                'low_stock' => Product::where('stock_quantity', '<', 10)->where('in_stock', true)->count(),
            ],
            'category_breakdown' => Category::withCount(['products' => function($query) {
                    $query->where('status', 'active');
                }])
                ->orderBy('products_count', 'desc')
                ->get(),
            'top_selling_products' => Product::withCount(['orderItems' => function($query) use ($startDate) {
                    $query->whereHas('order', function($q) use ($startDate) {
                        $q->where('created_at', '>=', $startDate)
                          ->where('payment_status', 'paid');
                    });
                }])
                ->withSum(['orderItems as revenue' => function($query) use ($startDate) {
                    $query->whereHas('order', function($q) use ($startDate) {
                        $q->where('created_at', '>=', $startDate)
                          ->where('payment_status', 'paid');
                    });
                }], 'total_price')
                ->orderBy('order_items_count', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'price', 'stock_quantity']),
            'most_reviewed_products' => Product::where('review_count', '>', 0)
                ->orderBy('average_rating', 'desc')
                ->orderBy('review_count', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'average_rating', 'review_count']),
            'revenue_by_product' => DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('orders.created_at', '>=', $startDate)
                ->where('orders.payment_status', 'paid')
                ->select('products.name', 'products.price')
                ->selectRaw('SUM(order_items.total_price) as revenue')
                ->selectRaw('SUM(order_items.quantity) as quantity_sold')
                ->groupBy('products.id', 'products.name', 'products.price')
                ->orderBy('revenue', 'desc')
                ->limit(20)
                ->get(),
            'inventory_alerts' => [
                'out_of_stock' => Product::where('in_stock', false)->count(),
                'low_stock' => Product::where('stock_quantity', '<', 10)
                    ->where('in_stock', true)
                    ->select('id', 'name', 'stock_quantity')
                    ->get(),
                'overstock' => Product::where('stock_quantity', '>', 100)
                    ->select('id', 'name', 'stock_quantity')
                    ->orderBy('stock_quantity', 'desc')
                    ->limit(10)
                    ->get(),
            ]
        ];

        return response()->json($report);
    }

    /**
     * Generate comprehensive analytics dashboard
     */
    public function analyticsReport(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = now()->subDays($period);

        $analytics = [
            'period_info' => [
                'period' => "{$period} days",
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => now()->format('Y-m-d'),
            ],
            'key_metrics' => [
                'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
                'period_revenue' => Order::where('created_at', '>=', $startDate)
                    ->where('payment_status', 'paid')
                    ->sum('total_amount'),
                'total_orders' => Order::count(),
                'period_orders' => Order::where('created_at', '>=', $startDate)->count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'period_customers' => User::where('role', 'customer')
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'total_products' => Product::count(),
                'active_products' => Product::where('status', 'active')->count(),
            ],
            'growth_metrics' => [
                'revenue_growth' => $this->calculateGrowthRate('revenue', $period),
                'order_growth' => $this->calculateGrowthRate('orders', $period),
                'customer_growth' => $this->calculateGrowthRate('customers', $period),
            ],
            'conversion_metrics' => [
                'conversion_rate' => $this->calculateConversionRate(),
                'average_order_value' => Order::where('payment_status', 'paid')->avg('total_amount'),
                'repeat_customer_rate' => $this->calculateRepeatCustomerRate(),
                'customer_lifetime_value' => $this->calculateCustomerLTV(),
            ],
            'operational_metrics' => [
                'fulfillment_rate' => $this->calculateFulfillmentRate(),
                'return_rate' => $this->calculateReturnRate(),
                'average_delivery_time' => $this->calculateAverageDeliveryTime(),
                'customer_satisfaction' => Review::avg('rating') ?? 0,
            ],
            'recent_performance' => [
                'daily_metrics' => Order::selectRaw('DATE(created_at) as date')
                    ->selectRaw('COUNT(*) as orders')
                    ->selectRaw('SUM(CASE WHEN payment_status = "paid" THEN total_amount ELSE 0 END) as revenue')
                    ->selectRaw('COUNT(DISTINCT user_id) as unique_customers')
                    ->where('created_at', '>=', $startDate)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ],
            'alerts' => $this->getSystemAlerts(),
        ];

        return response()->json($analytics);
    }

    /**
     * Calculate growth rate for a metric
     */
    private function calculateGrowthRate($metric, $period)
    {
        $currentPeriodStart = now()->subDays($period);
        $previousPeriodStart = now()->subDays($period * 2);
        $previousPeriodEnd = now()->subDays($period);

        switch ($metric) {
            case 'revenue':
                $current = Order::where('created_at', '>=', $currentPeriodStart)
                    ->where('payment_status', 'paid')
                    ->sum('total_amount');
                $previous = Order::where('created_at', '>=', $previousPeriodStart)
                    ->where('created_at', '<', $previousPeriodEnd)
                    ->where('payment_status', 'paid')
                    ->sum('total_amount');
                break;
            case 'orders':
                $current = Order::where('created_at', '>=', $currentPeriodStart)->count();
                $previous = Order::where('created_at', '>=', $previousPeriodStart)
                    ->where('created_at', '<', $previousPeriodEnd)
                    ->count();
                break;
            case 'customers':
                $current = User::where('role', 'customer')
                    ->where('created_at', '>=', $currentPeriodStart)
                    ->count();
                $previous = User::where('role', 'customer')
                    ->where('created_at', '>=', $previousPeriodStart)
                    ->where('created_at', '<', $previousPeriodEnd)
                    ->count();
                break;
            default:
                return 0;
        }

        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }

    /**
     * Calculate conversion rate
     */
    private function calculateConversionRate()
    {
        $totalUsers = User::where('role', 'customer')->count();
        $usersWithOrders = User::where('role', 'customer')->whereHas('orders')->count();
        
        return $totalUsers > 0 ? round(($usersWithOrders / $totalUsers) * 100, 2) : 0;
    }

    /**
     * Calculate repeat customer rate
     */
    private function calculateRepeatCustomerRate()
    {
        $usersWithOrders = User::whereHas('orders')->count();
        $repeatCustomers = User::withCount('orders')
            ->having('orders_count', '>', 1)
            ->count();
        
        return $usersWithOrders > 0 ? round(($repeatCustomers / $usersWithOrders) * 100, 2) : 0;
    }

    /**
     * Calculate customer lifetime value
     */
    private function calculateCustomerLTV()
    {
        return User::where('role', 'customer')
            ->withSum(['orders as total_spent' => function($query) {
                $query->where('payment_status', 'paid');
            }], 'total_amount')
            ->avg('total_spent') ?? 0;
    }

    /**
     * Calculate fulfillment rate
     */
    private function calculateFulfillmentRate()
    {
        $totalOrders = Order::where('payment_status', 'paid')->count();
        $deliveredOrders = Order::where('payment_status', 'paid')
            ->where('status', 'delivered')
            ->count();
        
        return $totalOrders > 0 ? round(($deliveredOrders / $totalOrders) * 100, 2) : 0;
    }

    /**
     * Calculate return rate
     */
    private function calculateReturnRate()
    {
        $totalOrders = Order::where('payment_status', 'paid')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        
        return $totalOrders > 0 ? round(($cancelledOrders / $totalOrders) * 100, 2) : 0;
    }

    /**
     * Calculate average delivery time
     */
    private function calculateAverageDeliveryTime()
    {
        return Order::whereNotNull('delivered_at')
            ->whereNotNull('shipped_at')
            ->selectRaw('AVG(DATEDIFF(delivered_at, shipped_at)) as avg_days')
            ->value('avg_days') ?? 0;
    }

    /**
     * Get system alerts
     */
    private function getSystemAlerts()
    {
        $alerts = [];

        // Low stock alerts
        $lowStockCount = Product::where('stock_quantity', '<', 10)
            ->where('in_stock', true)
            ->count();
        
        if ($lowStockCount > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "{$lowStockCount} products have low stock",
                'action' => 'review_inventory'
            ];
        }

        // Pending orders
        $pendingOrders = Order::where('status', 'pending')
            ->where('created_at', '<', now()->subHours(24))
            ->count();
        
        if ($pendingOrders > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "{$pendingOrders} orders pending for over 24 hours",
                'action' => 'review_orders'
            ];
        }

        // Failed payments
        $failedPayments = Order::where('payment_status', 'failed')
            ->where('created_at', '>=', now()->subDays(7))
            ->count();
        
        if ($failedPayments > 0) {
            $alerts[] = [
                'type' => 'error',
                'message' => "{$failedPayments} failed payments in the last 7 days",
                'action' => 'review_payments'
            ];
        }

        return $alerts;
    }
}