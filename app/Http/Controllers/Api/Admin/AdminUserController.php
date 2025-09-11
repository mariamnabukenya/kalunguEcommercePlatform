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
     * Display a listing of users
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
                'roles' => ['customer', 'admin', 'super_admin'],
                'statuses' => ['active', 'inactive'],
            ],
            'summary' => [
                'total_users' => User::count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'total_admins' => User::where('role', 'admin')->count(),
                'total_super_admins' => User::where('role', 'super_admin')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'new_users_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            ]
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,admin,super_admin',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if current user can create this role
        $currentUser = $request->user();
        $requestedRole = $request->role;

        if ($requestedRole === 'super_admin' && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admins can create Super Admin accounts'
            ], 403);
        }

        if ($requestedRole === 'admin' && !$currentUser->hasAdminAccess()) {
            return response()->json([
                'message' => 'Insufficient privileges to create admin accounts'
            ], 403);
        }

        $userData = $validator->validated();
        $userData['password'] = Hash::make($userData['password']);
        $userData['email_verified_at'] = now();

        $user = User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user
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
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|in:customer,admin,super_admin',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $currentUser = $request->user();

        // Don't allow updating your own account through this endpoint
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'Use profile endpoint to update your own account'
            ], 422);
        }

        // Role change validation
        if ($request->has('role')) {
            $newRole = $request->role;
            
            // Only super admins can change roles to/from super_admin
            if (($newRole === 'super_admin' || $user->role === 'super_admin') && !$currentUser->isSuperAdmin()) {
                return response()->json([
                    'message' => 'Only Super Admins can manage Super Admin roles'
                ], 403);
            }

            // Only admins and above can change admin roles
            if (($newRole === 'admin' || $user->role === 'admin') && !$currentUser->hasAdminAccess()) {
                return response()->json([
                    'message' => 'Insufficient privileges to manage admin roles'
                ], 403);
            }
        }

        $user->update($validator->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $currentUser = $request->user();

        // Don't allow deleting yourself
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 422);
        }

        // Only super admins can delete other super admins
        if ($user->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admins can delete Super Admin accounts'
            ], 403);
        }

        // Only admins and above can delete admin accounts
        if ($user->isAdmin() && !$currentUser->hasAdminAccess()) {
            return response()->json([
                'message' => 'Insufficient privileges to delete admin accounts'
            ], 403);
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
     * Update user role (separate endpoint for better control)
     */
    public function updateRole(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|in:customer,admin,super_admin',
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

        $currentUser = $request->user();
        $newRole = $request->role;

        // Don't allow changing your own role
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'You cannot change your own role'
            ], 422);
        }

        // Only super admins can manage super_admin roles
        if (($newRole === 'super_admin' || $user->role === 'super_admin') && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admins can manage Super Admin roles'
            ], 403);
        }

        $user->update(['role' => $newRole]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    /**
     * User analytics for admins
     */
    public function analytics(Request $request)
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
                'customers' => User::where('role', 'customer')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'super_admins' => User::where('role', 'super_admin')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'new_users_this_month' => User::where('created_at', '>=', now()->startOfMonth())->count(),
            ],

            // Top customers by spending
            'top_customers' => User::where('role', 'customer')
                ->withSum(['orders as total_spent' => function($q) {
                    $q->where('payment_status', 'paid');
                }], 'total_amount')
                ->withCount('orders')
                ->orderBy('total_spent', 'desc')
                ->limit(20)
                ->get(['id', 'name', 'email', 'created_at']),

            // Activity stats
            'activity_stats' => [
                'users_with_orders' => User::whereHas('orders')->count(),
                'users_with_reviews' => User::whereHas('reviews')->count(),
                'recently_active' => User::where('last_login_at', '>=', now()->subDays(7))->count(),
            ],
        ];

        return response()->json($analytics);
    }
}