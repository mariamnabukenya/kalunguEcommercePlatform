<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminUserController extends Controller
{
    /**
     * Get all users for admin
     */
    public function index(Request $request)
    {
        $query = User::withCount(['orders', 'reviews'])
            ->withSum(['orders as total_spent' => function($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Registration date filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Spending filter
        if ($request->filled('min_spent')) {
            $query->having('total_spent', '>=', $request->min_spent);
        }

        if ($request->filled('max_spent')) {
            $query->having('total_spent', '<=', $request->max_spent);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'total_spent') {
            $query->orderBy('total_spent', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $users = $query->paginate(20);

        return response()->json([
            'users' => $users->items(),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
            'filters' => [
                'roles' => ['customer', 'admin'],
                'statuses' => ['active', 'inactive'],
            ],
            'summary' => [
                'total_users' => User::count(),
                'total_customers' => User::customer()->count(),
                'total_admins' => User::admin()->count(),
                'active_users' => User::active()->count(),
                'new_users_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            ]
        ]);
    }

    /**
     * Get single user details
     */
    public function show($id)
    {
        $user = User::with([
            'addresses',
            'orders' => fn($q) => $q->with('items.product')->latest()->limit(10),
            'reviews' => fn($q) => $q->with('product:id,name')->latest()->limit(10),
            'cartItems.product',
            'wishlistItems.product'
        ])
        ->withCount(['orders', 'reviews', 'cartItems', 'wishlistItems'])
        ->withSum(['orders as total_spent' => function($q) {
            $q->where('payment_status', 'paid');
        }], 'total_amount')
        ->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Calculate additional stats
        $stats = [
            'average_order_value' => $user->orders()
                ->where('payment_status', 'paid')
                ->avg('total_amount') ?? 0,
            'last_order_date' => $user->orders()->latest()->value('created_at'),
            'total_refunds' => $user->orders()
                ->where('payment_status', 'refunded')
                ->sum('total_amount'),
            'cancelled_orders' => $user->orders()
                ->where('status', 'cancelled')
                ->count(),
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats
        ]);
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|in:customer,admin',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Don't allow changing your own role
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot change your own role'
            ], 422);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Deactivate/activate user
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Don't allow deactivating yourself
        if ($user->id === auth()->id() && !$request->is_active) {
            return response()->json([
                'message' => 'You cannot deactivate your own account'
            ], 422);
        }

        $user->update(['is_active' => $request->is_active]);

        // Revoke all tokens if deactivating
        if (!$request->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Don't allow deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 422);
        }

        // Check if user has orders
        if ($user->orders()->exists()) {
            return response()->json([
                'message' => 'Cannot delete user with existing orders. Deactivate instead.'
            ], 422);
        }

        // Delete related data
        $user->addresses()->delete();
        $user->cartItems()->delete();
        $user->wishlistItems()->delete();
        $user->reviews()->delete();
        $user->tokens()->delete();
        
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * User analytics
     */
    public function userAnalytics(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = now()->subDays($period);

        $analytics = [
            // User growth
            'user_growth' => User::selectRaw('DATE(created_at) as date, COUNT(*) as new_users')
                ->where('created_at', '>=', $startDate)
                ->groupBy('date')
                ->orderBy('date')
                ->get(),

            // User segments
            'user_segments' => [
                'new_users' => User::where('created_at', '>=', now()->subDays(30))->count(),
                'returning_customers' => User::whereHas('orders', function($q) {
                    $q->where('created_at', '>=', now()->subDays(30));
                })->whereHas('orders', function($q) {
                    $q->where('created_at', '<', now()->subDays(30));
                })->count(),
                'vip_customers' => User::withSum(['orders as total_spent' => function($q) {
                    $q->where('payment_status', 'paid');
                }], 'total_amount')
                ->having('total_spent', '>', 1000)
                ->count(),
                'inactive_users' => User::where('last_login_at', '<', now()->subDays(90))
                    ->orWhereNull('last_login_at')
                    ->count(),
            ],

            // Geographic distribution (mock data - in real app, this would come from user addresses)
            'geographic_distribution' => [
                'US' => User::whereHas('addresses', function($q) {
                    $q->where('country', 'United States');
                })->count(),
                'CA' => User::whereHas('addresses', function($q) {
                    $q->where('country', 'Canada');
                })->count(),
                'UK' => User::whereHas('addresses', function($q) {
                    $q->where('country', 'United Kingdom');
                })->count(),
            ],

            // Customer lifetime value
            'lifetime_value' => [
                'average_ltv' => User::customer()
                    ->withSum(['orders as total_spent' => function($q) {
                        $q->where('payment_status', 'paid');
                    }], 'total_amount')
                    ->avg('total_spent') ?? 0,
                
                'ltv_distribution' => [
                    '0-100' => User::customer()
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->having('total_spent', '<=', 100)
                        ->count(),
                    '101-500' => User::customer()
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingBetween('total_spent', [101, 500])
                        ->count(),
                    '501-1000' => User::customer()
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->havingBetween('total_spent', [501, 1000])
                        ->count(),
                    '1000+' => User::customer()
                        ->withSum(['orders as total_spent' => function($q) {
                            $q->where('payment_status', 'paid');
                        }], 'total_amount')
                        ->having('total_spent', '>', 1000)
                        ->count(),
                ]
            ],

            // Top customers
            'top_customers' => User::customer()
                ->withSum(['orders as total_spent' => function($q) {
                    $q->where('payment_status', 'paid');
                }], 'total_amount')
                ->withCount('orders')
                ->orderBy('total_spent', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'email', 'created_at']),

            // Activity stats
            'activity_stats' => [
                'daily_active' => User::where('last_login_at', '>=', now()->subDay())->count(),
                'weekly_active' => User::where('last_login_at', '>=', now()->subWeek())->count(),
                'monthly_active' => User::where('last_login_at', '>=', now()->subMonth())->count(),
            ],
        ];

        return response()->json($analytics);
    }
}