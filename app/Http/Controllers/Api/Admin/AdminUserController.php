<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Sorting
        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->latest();
        }

        return response()->json([
            'users' => $query->paginate(20),
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
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users',
            'password'      => 'required|string|min:8|confirmed',
            'role'          => 'required|in:customer,admin,super_admin',
            'phone'         => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'gender'        => 'nullable|in:male,female,other',
            'is_active'     => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $currentUser   = $request->user();
        $requestedRole = $request->role;

        // Role restrictions
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

        $userData                   = $validator->validated();
        $userData['password']       = Hash::make($userData['password']);
        $userData['email_verified_at'] = now();

        $user = User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = User::with('orders', 'addresses')->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name'          => 'sometimes|string|max:255',
            'email'         => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role'          => 'sometimes|in:customer,admin,super_admin',
            'phone'         => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'gender'        => 'nullable|in:male,female,other',
            'is_active'     => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user        = User::find($id);
        $currentUser = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Prevent updating your own account here
        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'Use profile endpoint to update your own account'
            ], 422);
        }

        // Role change validation
        if ($request->has('role')) {
            $newRole = $request->role;

            if (($newRole === 'super_admin' || $user->role === 'super_admin') && !$currentUser->isSuperAdmin()) {
                return response()->json([
                    'message' => 'Only Super Admins can manage Super Admin roles'
                ], 403);
            }

            if (($newRole === 'admin' || $user->role === 'admin') && !$currentUser->hasAdminAccess()) {
                return response()->json([
                    'message' => 'Insufficient privileges to manage admin roles'
                ], 403);
            }
        }

        $user->update($validator->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy(Request $request, $id)
    {
        $user        = User::find($id);
        $currentUser = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 422);
        }

        if ($user->isSuperAdmin() && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admins can delete Super Admin accounts'
            ], 403);
        }

        if ($user->isAdmin() && !$currentUser->hasAdminAccess()) {
            return response()->json([
                'message' => 'Insufficient privileges to delete admin accounts'
            ], 403);
        }

        if ($user->orders()->exists()) {
            return response()->json([
                'message' => 'Cannot delete user with existing orders'
            ], 422);
        }

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
                'errors'  => $validator->errors()
            ], 422);
        }

        $user        = User::find($id);
        $currentUser = $request->user();
        $newRole     = $request->role;

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->id === $currentUser->id) {
            return response()->json([
                'message' => 'You cannot change your own role'
            ], 422);
        }

        if (($newRole === 'super_admin' || $user->role === 'super_admin') && !$currentUser->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only Super Admins can manage Super Admin roles'
            ], 403);
        }

        $user->update(['role' => $newRole]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user'    => $user
        ]);
    }

    /**
     * User analytics for admins
     */
    public function analytics(Request $request)
    {
        $dashboard = [
            'user_segments' => [
                'customers'          => User::where('role', 'customer')->count(),
                'admins'             => User::where('role', 'admin')->count(),
                'super_admins'       => User::where('role', 'super_admin')->count(),
                'active_users'       => User::where('is_active', true)->count(),
                'new_users_this_month'=> User::where('created_at', '>=', now()->startOfMonth())->count(),
            ],

            'top_customers' => User::where('role', 'customer')
                ->withSum(['orders as total_spent' => function ($q) {
                    $q->where('payment_status', 'paid');
                }], 'total_amount')
                ->orderByDesc('total_spent')
                ->limit(10)
                ->get(['id', 'name', 'email']),

            'activity_stats' => [
                'users_with_orders'  => User::whereHas('orders')->count(),
                'users_with_reviews' => User::whereHas('reviews')->count(),
                'recently_active'    => User::where('last_login_at', '>=', now()->subDays(7))->count(),
            ],
        ];

        return response()->json($dashboard);
    }
}
