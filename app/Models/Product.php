<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'sale_price',
        'stock_quantity',
        'manage_stock',
        'in_stock',
        'status',
        'product_type',
        'attributes',
        'weight',
        'dimensions',
        'featured',
        'brand',
        'meta_data',
        'average_rating',
        'review_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'stock_quantity' => 'integer',
        'manage_stock' => 'boolean',
        'in_stock' => 'boolean',
        'featured' => 'boolean',
        'attributes' => 'array',
        'meta_data' => 'array',
        'average_rating' => 'decimal:2',
        'review_count' => 'integer',
    ];

    /**
     * Get product categories
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Get product variants
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get active variants
     */
    public function activeVariants(): HasMany
    {
        return $this->variants()->where('in_stock', true);
    }

    /**
     * Get product images
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get primary image
     */
    public function primaryImage()
    {
        return $this->images()->where('is_primary', true)->first() 
            ?? $this->images()->orderBy('sort_order')->first();
    }

    /**
     * Get product reviews
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get approved reviews
     */
    public function approvedReviews(): HasMany
    {
        return $this->reviews()->where('is_approved', true);
    }

    /**
     * Get cart items
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get order items
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get wishlist items
     */
    public function wishlistItems(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Scope: Active products
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: Featured products
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope: In stock products
     */
    public function scopeInStock($query)
    {
        return $query->where('in_stock', true);
    }

    /**
     * Scope: Search products
     */
    public function scopeSearch($query, $term)
    {
        return $query->whereRaw('MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)', [$term])
            ->orWhere('name', 'LIKE', "%{$term}%")
            ->orWhere('brand', 'LIKE', "%{$term}%")
            ->orWhere('sku', 'LIKE', "%{$term}%");
    }

    /**
     * Get current price (sale price if available, otherwise regular price)
     */
    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    /**
     * Check if product is on sale
     */
    public function getOnSaleAttribute()
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    /**
     * Get discount percentage
     */
    public function getDiscountPercentageAttribute()
    {
        if (!$this->on_sale) {
            return 0;
        }
        return round((($this->price - $this->sale_price) / $this->price) * 100);
    }

    /**
     * Update average rating and review count
     */
    public function updateRatingStats()
    {
        $stats = $this->approvedReviews()
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->first();

        $this->update([
            'average_rating' => round($stats->avg_rating, 2) ?? 0,
            'review_count' => $stats->review_count ?? 0,
        ]);
    }
}