<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    /**
     * Get all products for admin
     */
    public function index(Request $request)
    {
        $query = Product::with(['images', 'categories', 'variants'])
            ->withCount(['orderItems', 'reviews']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('sku', 'LIKE', "%{$search}%")
                  ->orWhere('brand', 'LIKE', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        // Stock filter
        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'in_stock') {
                $query->where('in_stock', true);
            } elseif ($request->stock_status === 'out_of_stock') {
                $query->where('in_stock', false);
            } elseif ($request->stock_status === 'low_stock') {
                $query->where('stock_quantity', '<', 10)->where('in_stock', true);
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate(20);

        return response()->json([
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
            'filters' => [
                'categories' => Category::active()->select('id', 'name')->get(),
                'statuses' => ['active', 'inactive', 'draft'],
                'stock_statuses' => ['in_stock', 'out_of_stock', 'low_stock'],
            ]
        ]);
    }

    /**
     * Create new product
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'stock_quantity' => 'required|integer|min:0',
            'manage_stock' => 'boolean',
            'product_type' => 'required|in:simple,variable',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string',
            'brand' => 'nullable|string|max:255',
            'featured' => 'boolean',
            'status' => 'required|in:active,inactive,draft',
            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'attributes' => 'nullable|array',
            'variants' => 'nullable|array',
            'variants.*.sku' => 'required_with:variants|string|unique:product_variants,sku',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.sale_price' => 'nullable|numeric|min:0',
            'variants.*.stock_quantity' => 'required_with:variants|integer|min:0',
            'variants.*.attributes' => 'required_with:variants|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $data = $validator->validated();
            $data['slug'] = Str::slug($data['name']);
            
            // Ensure slug uniqueness
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Product::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            $data['in_stock'] = $data['stock_quantity'] > 0;
            
            // Remove category_ids and variants from product data
            $categoryIds = $data['category_ids'];
            $variants = $data['variants'] ?? [];
            unset($data['category_ids'], $data['variants']);

            $product = Product::create($data);

            // Attach categories
            $product->categories()->attach($categoryIds);

            // Create variants if product type is variable
            if ($product->product_type === 'variable' && !empty($variants)) {
                foreach ($variants as $variantData) {
                    $variantData['product_id'] = $product->id;
                    $variantData['in_stock'] = $variantData['stock_quantity'] > 0;
                    ProductVariant::create($variantData);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product->load(['categories', 'variants', 'images'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create product',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get single product for admin
     */
    public function show($id)
    {
        $product = Product::with([
            'categories',
            'variants',
            'images' => fn($q) => $q->orderBy('sort_order'),
            'reviews' => fn($q) => $q->with('user')->orderBy('created_at', 'desc')->limit(10),
        ])->withCount(['orderItems', 'reviews', 'wishlistItems'])->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'product' => $product
        ]);
    }

    /**
     * Update product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'sometimes|string|unique:products,sku,' . $id,
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'manage_stock' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string',
            'brand' => 'nullable|string|max:255',
            'featured' => 'boolean',
            'status' => 'sometimes|in:active,inactive,draft',
            'category_ids' => 'sometimes|array|min:1',
            'category_ids.*' => 'exists:categories,id',
            'attributes' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $data = $validator->validated();

            // Update slug if name changed
            if (isset($data['name']) && $data['name'] !== $product->name) {
                $data['slug'] = Str::slug($data['name']);
                
                $originalSlug = $data['slug'];
                $counter = 1;
                while (Product::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                    $data['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // Update in_stock status if stock_quantity changed
            if (isset($data['stock_quantity'])) {
                $data['in_stock'] = $data['stock_quantity'] > 0;
            }

            // Handle categories
            if (isset($data['category_ids'])) {
                $product->categories()->sync($data['category_ids']);
                unset($data['category_ids']);
            }

            $product->update($data);

            DB::commit();

            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product->load(['categories', 'variants', 'images'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update product',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete product
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        // Check if product has orders
        if ($product->orderItems()->exists()) {
            return response()->json([
                'message' => 'Cannot delete product that has orders associated with it.'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Delete related data
            $product->images()->delete();
            $product->variants()->delete();
            $product->reviews()->delete();
            $product->cartItems()->delete();
            $product->wishlistItems()->delete();
            $product->categories()->detach();
            
            $product->delete();

            DB::commit();

            return response()->json([
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete product',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Upload product images
     */
    public function uploadImages(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'images' => 'required|array|max:10',
            'images.*.image_url' => 'required|string',
            'images.*.alt_text' => 'nullable|string|max:255',
            'images.*.is_primary' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $images = $request->images;
            
            // If one of the new images is set as primary, remove primary from existing images
            $hasPrimary = collect($images)->contains('is_primary', true);
            if ($hasPrimary) {
                $product->images()->update(['is_primary' => false]);
            }

            foreach ($images as $index => $imageData) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageData['image_url'],
                    'alt_text' => $imageData['alt_text'] ?? null,
                    'sort_order' => $product->images()->count() + $index + 1,
                    'is_primary' => $imageData['is_primary'] ?? false,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Images uploaded successfully',
                'images' => $product->images()->orderBy('sort_order')->get()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to upload images',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Delete product image
     */
    public function deleteImage($productId, $imageId)
    {
        $product = Product::find($productId);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $image = $product->images()->find($imageId);

        if (!$image) {
            return response()->json([
                'message' => 'Image not found'
            ], 404);
        }

        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully'
        ]);
    }

    /**
     * Get product analytics
     */
    public function productAnalytics(Request $request)
    {
        $period = $request->get('period', '30'); // days

        $analytics = [
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'out_of_stock' => Product::where('in_stock', false)->count(),
            'low_stock' => Product::where('stock_quantity', '<', 10)->where('in_stock', true)->count(),
            'featured_products' => Product::where('featured', true)->count(),
            
            'top_selling' => Product::withCount(['orderItems' => function($query) use ($period) {
                $query->whereHas('order', function($q) use ($period) {
                    $q->where('created_at', '>=', now()->subDays($period));
                });
            }])
            ->orderBy('order_items_count', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'price']),

            'most_reviewed' => Product::where('review_count', '>', 0)
                ->orderBy('review_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'average_rating', 'review_count']),

            'revenue_by_product' => Product::select('products.id', 'products.name')
                ->join('order_items', 'products.id', '=', 'order_items.product_id')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.created_at', '>=', now()->subDays($period))
                ->where('orders.payment_status', 'paid')
                ->groupBy('products.id', 'products.name')
                ->selectRaw('SUM(order_items.total_price) as revenue')
                ->orderBy('revenue', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($analytics);
    }
}