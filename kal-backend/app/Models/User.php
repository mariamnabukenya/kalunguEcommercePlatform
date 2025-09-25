<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Review;
use App\Models\Wishlist;
use App\Models\Product;
use App\Models\ProductVariant;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'last_login_at',
        'is_active',
    ];

    // Role constants
    const ROLE_CUSTOMER = 'customer';
    const ROLE_ADMIN = 'admin';
    const ROLE_SUPER_ADMIN = 'super_admin';

    /**
     * Role Check Methods
     */
    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function hasAdminAccess(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN]);
    }

    public function hasSuperAdminAccess(): bool
    {
        return $this->role === self::ROLE_SUPER_ADMIN;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function getPermissions(): array
    {
        return match ($this->role) {
            self::ROLE_CUSTOMER => [
                'view_products',
                'order_items',
                'manage_cart',
                'write_reviews',
                'manage_profile'
            ],
            self::ROLE_ADMIN => [
                'view_products',
                'view_orders',
                'manage_users',
                'manage_products',
                'moderate_reviews'
            ],
            self::ROLE_SUPER_ADMIN => [
                'view_products',
                'view_orders',
                'manage_users',
                'manage_products',
                'moderate_reviews',
                'generate_reports',
                'manage_admins',
                'system_settings'
            ],
            default => []
        };
    }

    /**
     * Scopes
     */
    public function scopeCustomers($query)
    {
        return $query->where('role', self::ROLE_CUSTOMER);
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    public function scopeSuperAdmins($query)
    {
        return $query->where('role', self::ROLE_SUPER_ADMIN);
    }

    public function scopeStaff($query)
    {
        return $query->whereIn('role', [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN]);
    }

    /**
     * Relationships
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlistItems(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'wishlists');
    }

    /**
     * Cart Helper Methods
     */
    public function getCartTotal(): float
    {
        return $this->cartItems->sum(fn($item) => $item->price * $item->quantity);
    }

    public function getCartItemsCount(): int
    {
        return $this->cartItems->sum('quantity');
    }

    public function addToCart($productId, $quantity = 1, $variantId = null): void
    {
        $cartItem = $this->cartItems()
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);
        } else {
            $product = Product::findOrFail($productId);
            $variant = $variantId ? ProductVariant::find($variantId) : null;

            $price = $variant?->current_price ?? $product->current_price;

            $this->cartItems()->create([
                'product_id' => $productId,
                'product_variant_id' => $variantId,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }
    }

    public function removeFromCart($productId, $variantId = null): void
    {
        $this->cartItems()
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->delete();
    }

    public function clearCart(): void
    {
        $this->cartItems()->delete();
    }

    /**
     * Wishlist Helper Methods
     */
    public function hasInWishlist($productId): bool
    {
        return $this->wishlistItems()->where('product_id', $productId)->exists();
    }

    public function addToWishlist($productId): void
    {
        if (!$this->hasInWishlist($productId)) {
            $this->wishlistItems()->create(['product_id' => $productId]);
        }
    }

    public function removeFromWishlist($productId): void
    {
        $this->wishlistItems()->where('product_id', $productId)->delete();
    }

    /**
     * Review Helper
     */
    public function canReviewProduct($productId): bool
    {
        return !$this->reviews()->where('product_id', $productId)->exists() &&
            $this->orders()
                ->whereHas('items', fn($query) => $query->where('product_id', $productId))
                ->where('status', 'delivered')
                ->exists();
    }
}
