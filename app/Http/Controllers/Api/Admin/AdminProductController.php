<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\ProductImage;

class AdminProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Optional filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->with('images')->paginate(20));
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'status'      => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->only(['name', 'description', 'price', 'stock', 'category_id', 'status']));

        return response()->json($product, 201);
    }

    /**
     * Display the specified product
     */
    public function show($id)
    {
        $product = Product::with('images')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|string|max:255',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'status'      => 'sometimes|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->only(['name', 'description', 'price', 'stock', 'category_id', 'status']));

        return response()->json($product);
    }

    /**
     * Remove the specified product
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete related images first
        $product->images()->delete();
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Upload product images
     */
    public function uploadImages(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $uploadedImages = [];

            foreach ($request->file('images', []) as $image) {
                $path = $image->store('products', 'public');

                $img = $product->images()->create([
                    'path' => $path,
                ]);

                $uploadedImages[] = $img;
            }

            DB::commit();

            return response()->json([
                'message' => 'Images uploaded successfully',
                'images'  => $uploadedImages
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to upload images',
                'error'   => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete a product image
     */
    public function deleteImage($productId, $imageId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $image = $product->images()->where('id', $imageId)->first();

        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    /**
     * Product analytics
     */
    public function productAnalytics()
    {
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'inactive_products' => Product::where('status', 'inactive')->count(),
            'low_stock_products' => Product::where('stock', '<', 5)->count(),
        ];

        return response()->json($stats);
    }
}
