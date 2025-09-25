<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

class ProductController extends Controller
{
    /**
     * Get paginated list of products with filters
     */
    public function index(Request $request)
    {
        $query = Product::with(['images', 'categories', 'variants'])
            ->active()
            ->inStock();

        // Category filter
        if ($request->filled('category_id')) {
            $query->whereHas('categories', function (Builder $q) use ($request) {
                $q->where('categories.id', $request->category_id);
            });
        }

        if ($request->filled('category_slug')) {
            $query->whereHas('categories', function (Builder $q) use ($request) {
                $q->where('categories.slug', $request->category_slug);
            });
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where(function (Builder $q) use ($request) {
                $q->where('sale_price', '>=', $request->min_price)
                  ->orWhere(function (Builder $q2) use ($request) {
                      $q2->whereNull('sale_price')
                         ->where('price', '>=', $request->min_price);
                  });
            });
        }

        if ($request->filled('max_price')) {
            $query->where(function (Builder $q) use ($request) {
                $q->where('sale_price', '<=', $request->max_price)
                  ->orWhere(function (Builder $q2) use ($request) {
                      $q2->whereNull('sale_price')
                         ->where('price', '<=', $request->max_price);
                  });
            });
        }

        // Brand filter
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        // Size filter (variants JSON attributes)
        if ($request->filled('size')) {
            $query->whereHas('variants', function (Builder $q) use ($request) {
                $q->whereJsonContains('attributes->size', $request->size);
            });
        }

        // Color filter
        if ($request->filled('color')) {
            $query->whereHas('variants', function (Builder $q) use ($request) {
                $q->whereJsonContains('attributes->color', $request->color);
            });
        }

        // Featured filter
        if ($request->boolean('featured')) {
            $query->featured();
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
            case 'popularity':
                $query->withCount('orderItems')->orderBy('order_items_count', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', $sortOrder);
        }

        $perPage = min($request->get('per_page', 12), 50); 
        $products = $query->paginate($perPage);

        return response()->json([
            'products' => $products,
            'filters' => $this->getAvailableFilters()
        ]);
    }

    /**
     * Get featured products
     */
    public function featured(Request $request)
    {
        $perPage = min($request->get('per_page', 8), 20);

        $products = Product::with(['images', 'categories'])
            ->active()
            ->featured()
            ->inStock()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'products' => $products
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (empty($query)) {
            return response()->json([
                'message' => 'Search query is required',
                'products' => []
            ], 422);
        }

        $products = Product::with(['images', 'categories'])
            ->active()
            ->search($query)
            ->paginate(20);

        return response()->json([
            'query' => $query,
            'products' => $products
        ]);
    }

    /**
     * Get single product details
     */
    public function show($id)
    {
        $product = Product::with([
            'images' => fn($q) => $q->orderBy('sort_order'),
            'categories',
            'variants' => fn($q) => $q->inStock(),
            'approvedReviews' => fn($q) => $q->with('user')->orderBy('created_at', 'desc')->limit(10),
        ])->active()->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $relatedProducts = Product::with(['images', 'categories'])
            ->active()
            ->inStock()
            ->whereHas('categories', function (Builder $q) use ($product) {
                $q->whereIn('categories.id', $product->categories->pluck('id'));
            })
            ->where('id', '!=', $product->id)
            ->paginate(6);

        return response()->json([
            'product' => $product,
            'related_products' => $relatedProducts,
            'available_attributes' => $this->getProductAttributes($product)
        ]);
    }

    private function getAvailableFilters()
    {
        return [
            'categories' => Category::active()
                ->whereHas('products')
                ->select('id', 'name', 'slug')
                ->get(),
            'brands' => Product::active()
                ->distinct()
                ->whereNotNull('brand')
                ->pluck('brand')
                ->sort()
                ->values(),
            'price_range' => [
                'min' => Product::active()->min('price'),
                'max' => Product::active()->max('price'),
            ],
        ];
    }

    private function getProductAttributes(Product $product)
    {
        $attributes = [];

        foreach ($product->variants as $variant) {
            if ($variant->attributes) {
                foreach ($variant->attributes as $key => $value) {
                    if (!isset($attributes[$key])) {
                        $attributes[$key] = [];
                    }
                    if (!in_array($value, $attributes[$key])) {
                        $attributes[$key][] = $value;
                    }
                }
            }
        }

        foreach ($attributes as $key => $values) {
            sort($attributes[$key]);
        }

        return $attributes;
    }
}
