<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
// Categories
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/featured', [CategoryController::class, 'featured']);
Route::get('categories/{slug}', [CategoryController::class, 'show']);

// Products
Route::get('products', [ProductController::class, 'index']);
Route::get('products/featured', [ProductController::class, 'featured']);
Route::get('products/search', [ProductController::class, 'search']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Reviews for products
Route::get('products/{productId}/reviews', [ReviewController::class, 'productReviews']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // User Profile
    Route::get('user/profile', [UserController::class, 'profile']);
    Route::put('user/profile', [UserController::class, 'updateProfile']);
    Route::get('user/orders', [UserController::class, 'orders']);
    Route::get('user/addresses', [UserController::class, 'addresses']);

    // Addresses
    Route::post('user/addresses', [UserController::class, 'addAddress']);
    Route::put('user/addresses/{id}', [UserController::class, 'updateAddress']);
    Route::delete('user/addresses/{id}', [UserController::class, 'deleteAddress']);

    // Orders
    Route::apiResource('orders', OrderController::class)->only(['index', 'store', 'show']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('orders/{order}/track', [OrderController::class, 'track']);

    // Wishlist
    Route::get('wishlist', [WishlistController::class, 'index']);
    Route::post('wishlist/add/{product}', [WishlistController::class, 'add']);
    Route::delete('wishlist/remove/{product}', [WishlistController::class, 'remove']);
    Route::get('wishlist/check/{product}', [WishlistController::class, 'check']);
    Route::post('wishlist/move-to-cart/{product}', [WishlistController::class, 'moveToCart']);
    Route::delete('wishlist/clear', [WishlistController::class, 'clear']);

    // Cart
    Route::get('cart', [CartItemController::class, 'index']);
    Route::post('cart/add', [CartItemController::class, 'store']);
    Route::put('cart/{id}', [CartItemController::class, 'update']);
    Route::delete('cart/{id}', [CartItemController::class, 'destroy']);

    // Reviews
    Route::post('reviews', [ReviewController::class, 'store']);
    Route::put('reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('user/reviews', [ReviewController::class, 'userReviews']);
    Route::post('reviews/{id}/helpful', [ReviewController::class, 'markHelpful']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'isAdmin'])->prefix('admin')->group(function () {

    // Products
    Route::apiResource('products', ProductController::class);

    // Orders
    Route::get('orders', [OrderController::class, 'index']); // Admin can see all orders
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::post('orders/{order}/update-status', [OrderController::class, 'updateStatus']); // Optional admin status update

    // Users (example)
    Route::get('users', [UserController::class, 'index']); // Admin user list
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']); // Admin can update user
    Route::delete('users/{user}', [UserController::class, 'destroy']); // Delete user

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Reviews moderation
    Route::get('reviews', [ReviewController::class, 'allReviews']); // Admin sees all reviews
    Route::post('reviews/{id}/approve', [ReviewController::class, 'approve']); // Approve review
    Route::post('reviews/{id}/reject', [ReviewController::class, 'reject']);  // Reject review
});
// Route to get authenticated user details