<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::with(['products' => function($query) {
            $query->active()->inStock();
        }])
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories
            ]
        ]);
    }

    /**
     * Get single category with products
     */
    public function show(Request $request, $id): JsonResponse
    {
        $category = Category::with(['products' => function($query) use ($request) {
            $query->active()->inStock();
            
            // Apply filters if provided
            if ($request->filled('min_price')) {
                $query->where(function ($q) use ($request) {
                    $q->where('sale_price', '>=', $request->min_price)
                      ->orWhere(function ($q2) use ($request) {
                          $q2->whereNull('sale_price')
                             ->where('price', '>=', $request->min_price);
                      });
                });
            }

            if ($request->filled('max_price')) {
                $query->where(function ($q) use ($request) {
                    $q->where('sale_price', '<=', $request->max_price)
                      ->orWhere(function ($q2) use ($request) {
                          $q2->whereNull('sale_price')
                             ->where('price', '<=', $request->max_price);
                      });
                });
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
                    $query->orderByRaw('COALESCE(sale_price, price) ' . $sortOrder);
                    break;
                case 'rating':
                    $query->orderBy('average_rating', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', $sortOrder);
            }
        }])
        ->where('is_active', true)
        ->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $perPage = min($request->get('per_page', 12), 50);
        $products = $category->products()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
                'products' => $products->items(),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ]
            ]
        ]);
    }
}