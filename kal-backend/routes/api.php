<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AuthController; // Your token-based auth controller

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

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

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
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
    Route::get('orders', [OrderController::class, 'index']); 
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::post('orders/{order}/update-status', [OrderController::class, 'updateStatus']); 

    // Users
    Route::get('users', [UserController::class, 'index']); 
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']); 
    Route::delete('users/{user}', [UserController::class, 'destroy']); 

    // Reviews moderation
    Route::get('reviews', [ReviewController::class, 'allReviews']); 
    Route::post('reviews/{id}/approve', [ReviewController::class, 'approve']); 
    Route::post('reviews/{id}/reject', [ReviewController::class, 'reject']);  
});
