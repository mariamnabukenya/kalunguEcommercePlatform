<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get user profile with stats
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load([
            'addresses',
            'orders' => fn($q) => $q->latest()->limit(5),
            'reviews' => fn($q) => $q->with('product:id,name')->latest()->limit(5)
        ]);

        return response()->json([
            'user' => $user,
            'stats' => [
                'total_orders' => $user->orders()->count(),
                'total_spent' => $user->orders()->where('payment_status', 'paid')->sum('total_amount'),
                'total_reviews' => $user->reviews()->count(),
                'wishlist_count' => $user->wishlistItems()->count(),
                'cart_count' => $user->getCartItemsCount(),
            ]
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $request->user()->update($validator->validated());

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $request->user()
        ]);
    }

    /**
     * Get user orders
     */
    public function orders(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with(['items.product.images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'orders' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    /**
     * Get user addresses
     */
    public function addresses(Request $request)
    {
        $addresses = $request->user()
            ->addresses()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'addresses' => $addresses
        ]);
    }

    /**
     * Add new address
     */
    public function addAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:shipping,billing',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = $request->user()->id;

        // If default, unset other defaults of same type
        if (!empty($data['is_default'])) {
            $request->user()->addresses()
                ->where('type', $data['type'])
                ->update(['is_default' => false]);
        }

        $address = Address::create($data);

        return response()->json([
            'message' => 'Address added successfully',
            'address' => $address
        ], 201);
    }

    /**
     * Update address
     */
    public function updateAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|in:shipping,billing',
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'company' => 'nullable|string|max:255',
            'address_line_1' => 'sometimes|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // If set as default, unset other defaults of same type
        if (!empty($data['is_default'])) {
            $request->user()->addresses()
                ->where('type', $address->type)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address
        ]);
    }

    /**
     * Delete address
     */
    public function deleteAddress(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully'
        ]);
    }
}
