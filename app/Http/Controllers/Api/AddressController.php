<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    /**
     * Display a listing of the user's addresses.
     */
    public function index(Request $request)
    {
        $addresses = $request->user()
            ->addresses()
            ->orderByDesc('is_default')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($addresses);
    }

    /**
     * Store a newly created address.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'label'       => 'required|string|max:50', // e.g. "Home", "Work"
            'street'      => 'required|string|max:255',
            'city'        => 'required|string|max:100',
            'state'       => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country'     => 'required|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'is_default'  => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // If marking as default, clear other defaults
        if ($request->boolean('is_default')) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($validator->validated());

        return response()->json([
            'message' => 'Address added successfully',
            'address' => $address
        ], 201);
    }

    /**
     * Display the specified address.
     */
    public function show(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        return response()->json($address);
    }

    /**
     * Update the specified address.
     */
    public function update(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'label'       => 'sometimes|string|max:50',
            'street'      => 'sometimes|string|max:255',
            'city'        => 'sometimes|string|max:100',
            'state'       => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country'     => 'sometimes|string|max:100',
            'phone'       => 'nullable|string|max:20',
            'is_default'  => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // If setting as default, unset others
        if (isset($data['is_default']) && $data['is_default']) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json([
            'message' => 'Address updated successfully',
            'address' => $address
        ]);
    }

    /**
     * Remove the specified address.
     */
    public function destroy(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }

    /**
     * Set an address as default.
     */
    public function setDefault(Request $request, $id)
    {
        $address = $request->user()->addresses()->find($id);

        if (!$address) {
            return response()->json(['message' => 'Address not found'], 404);
        }

        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json([
            'message' => 'Default address updated successfully',
            'address' => $address
        ]);
    }
}
