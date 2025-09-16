<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Get all categories with hierarchy
     */
    public function index(Request $request)
    {
        $query = Category::with(['children' => fn($q) => $q->active()->orderBy('sort_order')])
            ->active()
            ->root()
            ->orderBy('sort_order');

        if ($request->boolean('with_products')) {
            $query->withCount('activeProducts');
        }

        return response()->json([
            'categories' => $query->get()
        ]);
    }

    /**
     * Get single category with children
     */
    public function show($id)
    {
        $category = Category::with(['children' => fn($q) => $q->active()->orderBy('sort_order')])
            ->active()
            ->find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['category' => $category]);
    }

    /**
     * Get products for a category
     */
    public function products($id, Request $request)
    {
        $category = Category::active()->find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $query = $category->activeProducts()
            ->with(['images', 'categories'])
            ->inStock();

        // Filters
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'name':
                $query->orderBy('name', $sortOrder);
                break;
            case 'price':
                $query->orderBy('price', $sortOrder);
                break;
            case 'rating':
                $query->orderBy('average_rating', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', $sortOrder);
        }

        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'category' => $category,
            'products' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * Create new category (Admin only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['name']);

        // Ensure unique slug
        $originalSlug = $data['slug'];
        $counter = 1;
        while (Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    /**
     * Update category (Admin only)
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id|not_in:' . $id,
            'image' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // If name changed, regenerate slug
        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = Str::slug($data['name']);

            $originalSlug = $data['slug'];
            $counter = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    /**
     * Delete category (Admin only)
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category that has products. Please move or delete products first.'
            ], 422);
        }

        if ($category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category that has subcategories. Please delete subcategories first.'
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
