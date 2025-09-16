<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\CartItem;
use App\Models\OrderItem;
use App\Models\Wishlist;

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
        'category',
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
     * Categories relation
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }

    /**
     * Variants relation
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function activeVariants(): HasMany
    {
        return $this->variants()->where('in_stock', true);
    }

    /**
     * Images relation
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->images()->where('is_primary', true)->first()
            ?? $this->images()->orderBy('sort_order')->first();
    }

    /**
     * Reviews relation
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->reviews()->where('is_approved', true);
    }

    /**
     * Cart relation
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Orders relation
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Wishlist relation
     */
    public function wishlistItems(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('in_stock', true);
    }

    public function scopeSearch($query, $term)
    {
        return $query->whereRaw(
            'MATCH(name, description) AGAINST(? IN NATURAL LANGUAGE MODE)',
            [$term]
        )
        ->orWhere('name', 'LIKE', "%{$term}%")
        ->orWhere('brand', 'LIKE', "%{$term}%")
        ->orWhere('sku', 'LIKE', "%{$term}%");
    }

    /**
     * Accessors
     */
    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getOnSaleAttribute()
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if (!$this->on_sale) {
            return 0;
        }

        return round((($this->price - $this->sale_price) / $this->price) * 100);
    }

    /**
     * Helpers
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
