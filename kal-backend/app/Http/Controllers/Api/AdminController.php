<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // Fetch products with categories
    public function index(Request $request)
{
    $query = Product::with('categories');

    // Optional: add search filter
    if ($search = $request->get('search')) {
        $query->where('name', 'like', "%{$search}%");
    }

    $products = $query->paginate(10);

    // Transform structure to match frontend
    $products->getCollection()->transform(function ($product) {
        $product->categories = $product->categories->map(function ($cat) {
            return ['name' => $cat->category_name];
        });
        unset($product->category_names);
        return $product;
    });

    // Return a clean frontend-friendly structure
    return response()->json([
        'products' => $products->items(),
        'pagination' => [
            'current_page' => $products->currentPage(),
            'total_pages' => $products->lastPage(),
            'total_items' => $products->total(),
        ],
    ]);
}


    // Get single product with categories
    public function show($product_id)
{
    $product = Product::with('categories')->where('product_id', $product_id)->firstOrFail();
    $product->categories = $product->categories->map(fn($cat) => ['name' => $cat->category_name]);
    return response()->json($product);
}



    // Create product with categories
   public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'categories' => 'required|array', // array of category names
        'categories.*' => 'string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $product = Product::create($request->only(['name', 'price', 'description', 'image']));

    // Attach categories
    $categoryIds = [];
    foreach ($request->categories as $catName) {
        $category = Category::firstOrCreate(['category_name' => $catName]);
        $categoryIds[] = $category->category_id;
    }
    $product->categories()->sync($categoryIds);

    // Return category names
    $product->category_names = $product->categories->pluck('category_name')->toArray();

    return response()->json($product, 201);
}

    // Update product and its categories
    public function update(Request $request, $product_id)
{
    $product = Product::where('product_id', $product_id)->firstOrFail();

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|string|max:255',
        'price' => 'sometimes|numeric',
        'categories' => 'sometimes|array',
        'categories.*' => 'string|max:255',
        'description' => 'nullable|string',
        'image' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $product->update($request->only(['name', 'price', 'description', 'image']));

    if ($request->has('categories')) {
        $categoryIds = [];
        foreach ($request->categories as $catName) {
            $category = Category::firstOrCreate(['category_name' => $catName]);
            $categoryIds[] = $category->category_id;
        }
        $product->categories()->sync($categoryIds);
    }

    $product->category_names = $product->categories->pluck('category_name')->toArray();
    unset($product->categories);

    return response()->json($product);
}

    // Delete product
    public function destroy($product_id)
{
    $product = Product::where('product_id', $product_id)->firstOrFail();
    $product->categories()->detach();
    $product->delete();

    return response()->json(['message' => 'Product deleted successfully']);
}


    // Bulk delete products
    public function bulkDelete(Request $request)
{
    $ids = $request->ids ?? [];
    $products = Product::whereIn('product_id', $ids)->get();

    foreach ($products as $product) {
        $product->categories()->detach();
        $product->delete();
    }

    return response()->json(['message' => 'Selected products deleted successfully']);
}


    // Admin dashboard stats
    public function stats(Request $request)
    {
        $user = $request->user();

        $data = [
            'products' => Product::count(),
            'orders' => Order::count(),
            'reviews' => Review::count(),
        ];

        if ($user->role === 'super_admin') {
            $data['users'] = User::count();
            $data['revenue'] = Order::sum('total_amount');
        }

        $data['recent_orders'] = Order::with('user:id,name')
            ->orderByDesc('created_at')
            ->take(5)
            ->get(['orders.id', 'orders.user_id', 'orders.total_amount', 'orders.status', 'orders.created_at']);

        $data['recent_reviews'] = Review::latest()
            ->take(5)
            ->with('user:id,name', 'product:product_id,name')
            ->get(['id', 'user_id', 'product_id', 'rating', 'comment', 'created_at']);

        $data['low_stock_products'] = Product::select('product_id', 'name', 'stock_quantity')
            ->where('stock_quantity', '<', 5)
            ->limit(5)
            ->get();

        $data['revenue_chart'] = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($data);
    }
}
