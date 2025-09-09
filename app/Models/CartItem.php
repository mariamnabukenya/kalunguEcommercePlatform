<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Get the user this cart item belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product this cart item belongs to
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the product variant this cart item belongs to
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Get total price for this cart item
     */
    public function getTotalPriceAttribute()
    {
        return $this->price * $this->quantity;
    }

    /**
     * Get current product price
     */
    public function getCurrentProductPrice()
    {
        if ($this->variant) {
            return $this->variant->current_price;
        }
        return $this->product->current_price;
    }

    /**
     * Update price to current product price
     */
    public function updatePrice()
    {
        $this->update(['price' => $this->getCurrentProductPrice()]);
    }

    /**
     * Check if product/variant is still available
     */
    public function isAvailable()
    {
        if ($this->variant) {
            return $this->variant->in_stock && $this->variant->stock_quantity >= $this->quantity;
        }
        return $this->product->in_stock && $this->product->stock_quantity >= $this->quantity;
    }

    /**
     * Get available stock quantity
     */
    public function getAvailableStock()
    {
        if ($this->variant) {
            return $this->variant->stock_quantity;
        }
        return $this->product->stock_quantity;
    }
}