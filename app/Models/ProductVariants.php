<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'sale_price',
        'stock_quantity',
        'in_stock',
        'attributes',
        'image',
        'weight',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'stock_quantity' => 'integer',
        'in_stock' => 'boolean',
        'attributes' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeInStock($query)
    {
        return $query->where('in_stock', true);
    }

    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getOnSaleAttribute()
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }

    public function getAttributeValueByKey(string $key)
    {
        return $this->attributes['attributes'][$key] ?? null;
    }

    public function getFormattedAttributesAttribute()
    {
        if (!$this->attributes['attributes']) {
            return '';
        }

        return collect($this->attributes['attributes'])
            ->map(fn($value, $key) => ucfirst($key) . ': ' . ucfirst($value))
            ->join(', ');
    }
}
