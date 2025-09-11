<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SystemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Public product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/featured', [ProductController::class, 'featured']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/{id}/reviews', [ReviewController::class, 'productReviews']);
});

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/products', [CategoryController::class, 'products']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth user routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);
    });

    // User profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserController::class, 'profile']);
        Route::put('/', [UserController::class, 'updateProfile']);
        Route::get('/orders', [UserController::class, 'orders']);
        Route::get('/addresses', [UserController::class, 'addresses']);
        Route::post('/addresses', [UserController::class, 'addAddress']);
        Route::put('/addresses/{id}', [UserController::class, 'updateAddress']);
        Route::delete('/addresses/{id}', [UserController::class, 'deleteAddress']);
    });

    // Shopping cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'remove']);
        Route::delete('/', [CartController::class, 'clear']);
        Route::get('/count', [CartController::class, 'count']);
    });

    // Wishlist
    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/add/{productId}', [WishlistController::class, 'add']);
        Route::delete('/remove/{productId}', [WishlistController::class, 'remove']);
        Route::get('/check/{productId}', [WishlistController::class, 'check']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{id}', [OrderController::class, 'show']);
        Route::put('/{id}/cancel', [OrderController::class, 'cancel']);
        Route::get('/{id}/track', [OrderController::class, 'track']);
    });

    // Reviews
    Route::prefix('reviews')->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
        Route::get('/my-reviews', [ReviewController::class, 'userReviews']);
    });

    // Admin routes (Admin + Super Admin access)
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        // Product management
        Route::apiResource('products', AdminProductController::class);
        Route::post('/products/{id}/images', [AdminProductController::class, 'uploadImages']);
        Route::delete('/products/{id}/images/{imageId}', [AdminProductController::class, 'deleteImage']);

        // Category management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Order management
        Route::apiResource('orders', AdminOrderController::class);
        Route::get('/dashboard', [AdminOrderController::class, 'dashboard']);

        // User management
        Route::apiResource('users', AdminUserController::class);
        Route::put('/users/{id}/role', [AdminUserController::class, 'updateRole']);
        Route::get('/users/analytics', [AdminUserController::class, 'analytics']);
    });

    // Super Admin only routes
    Route::middleware(['super.admin'])->prefix('super-admin')->group(function () {
        // Advanced Reports
        Route::prefix('reports')->group(function () {
            Route::get('/sales', [ReportController::class, 'salesReport']);
            Route::get('/users', [ReportController::class, 'userReport']);
            Route::get('/products', [ReportController::class, 'productReport']);
            Route::get('/analytics', [ReportController::class, 'analyticsReport']);
        });

        // System Management
        Route::prefix('system')->group(function () {
            Route::get('/settings', [SystemController::class, 'settings']);
            Route::put('/settings', [SystemController::class, 'updateSettings']);
            Route::post('/cache/clear', [SystemController::class, 'clearCache']);
            Route::get('/health', [SystemController::class, 'healthCheck']);
            Route::get('/logs', [SystemController::class, 'getLogs']);
            Route::post('/backup', [SystemController::class, 'backupDatabase']);
            Route::post('/maintenance', [SystemController::class, 'maintenance']);
        });

        // Advanced User Management (Super Admin can manage admin roles)
        Route::put('/users/{id}/role', [AdminUserController::class, 'updateRole']);
        Route::post('/users', [AdminUserController::class, 'store']);
    });
});