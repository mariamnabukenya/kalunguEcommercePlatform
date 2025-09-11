<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'date_of_birth',
        'gender',
        'last_login_at',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get user's addresses
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get user's shipping addresses
     */
    public function shippingAddresses(): HasMany
    {
        return $this->addresses()->where('type', 'shipping');
    }

    /**
     * Get user's billing addresses
     */
    public function billingAddresses(): HasMany
    {
        return $this->addresses()->where('type', 'billing');
    }

    /**
     * Get user's default shipping address
     */
    public function defaultShippingAddress()
    {
        return $this->shippingAddresses()->where('is_default', true)->first()
            ?? $this->shippingAddresses()->first();
    }

    /**
     * Get user's default billing address
     */
    public function defaultBillingAddress()
    {
        return $this->billingAddresses()->where('is_default', true)->first()
            ?? $this->billingAddresses()->first();
    }

    /**
     * Get user's cart items
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get user's orders
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get user's reviews
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get user's wishlist items
     */
    public function wishlistItems(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Get products in user's wishlist
     */
    public function wishlistProducts()
    {
        return $this->belongsToMany(Product::class, 'wishlists');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is customer
     */
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Get cart total amount
     */
    public function getCartTotal()
    {
        return $this->cartItems->sum('total_price');
    }

    /**
     * Get cart items count
     */
    public function getCartItemsCount()
    {
        return $this->cartItems->sum('quantity');
    }

    /**
     * Add product to cart
     */
    public function addToCart($productId, $quantity = 1, $variantId = null)
    {
        $cartItem = $this->cartItems()
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $quantity);
        } else {
            $product = Product::find($productId);
            $variant = $variantId ? ProductVariant::find($variantId) : null;
            
            $price = $variant ? $variant->current_price : $product->current_price;

            $this->cartItems()->create([
                'product_id' => $productId,
                'product_variant_id' => $variantId,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }
    }

    /**
     * Remove product from cart
     */
    public function removeFromCart($productId, $variantId = null)
    {
        $this->cartItems()
            ->where('product_id', $productId)
            ->where('product_variant_id', $variantId)
            ->delete();
    }

    /**
     * Clear cart
     */
    public function clearCart()
    {
        $this->cartItems()->delete();
    }

    /**
     * Check if product is in wishlist
     */
    public function hasInWishlist($productId): bool
    {
        return $this->wishlistItems()->where('product_id', $productId)->exists();
    }

    /**
     * Add product to wishlist
     */
    public function addToWishlist($productId)
    {
        if (!$this->hasInWishlist($productId)) {
            $this->wishlistItems()->create(['product_id' => $productId]);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function removeFromWishlist($productId)
    {
        $this->wishlistItems()->where('product_id', $productId)->delete();
    }

    /**
     * Check if user can review product
     */
    public function canReviewProduct($productId): bool
    {
        // User can review if they haven't reviewed before and have purchased the product
        return !$this->reviews()->where('product_id', $productId)->exists() &&
            $this->orders()
                ->whereHas('items', fn($query) => $query->where('product_id', $productId))
                ->where('status', 'delivered')
                ->exists();
    }

    /**
     * Scope: Active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Admin users
     */
    public function scopeAdmin($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope: Customer users
     */
    public function scopeCustomer($query)
    {
        return $query->where('role', 'customer');
    }
}
