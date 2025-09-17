<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Get all active categories with optional hierarchy
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::active()
            ->with(['parent', 'children'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        // If flat structure is requested
        if ($request->boolean('flat')) {
            return response()->json([
                'categories' => $categories
            ]);
        }

        // Return hierarchical structure
        $rootCategories = $categories->whereNull('parent_id')->values();
        
        return response()->json([
            'categories' => $rootCategories
        ]);
    }

    /**
     * Get category by slug with products
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::with([
                'activeProducts' => function($query) {
                    $query->with(['images', 'variants'])
                          ->orderBy('featured', 'desc')
                          ->orderBy('created_at', 'desc');
                },
                'children.activeProducts'
            ])
            ->where('slug', $slug)
            ->active()
            ->first();

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'category' => $category,
            'products' => $category->activeProducts
        ]);
    }

    /**
     * Get featured categories
     */
    public function featured(): JsonResponse
    {
        $categories = Category::active()
            ->whereHas('products')
            ->orderBy('sort_order')
            ->limit(6)
            ->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Admin: Create a new category
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'slug' => 'nullable|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'meta_data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = \Str::slug($data['name']);
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    /**
     * Admin: Update a category
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $category->id,
            'slug' => 'sometimes|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'meta_data' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Prevent setting parent to itself or creating circular references
        if (isset($data['parent_id']) && $data['parent_id'] === $category->id) {
            return response()->json([
                'message' => 'A category cannot be its own parent'
            ], 422);
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category->fresh()
        ]);
    }

    /**
     * Admin: Delete a category
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with products'
            ], 409);
        }

        // Check if category has children
        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with subcategories'
            ], 409);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }
}