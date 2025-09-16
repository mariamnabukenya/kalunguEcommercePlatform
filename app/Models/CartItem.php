<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;

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
     * The user who owns this cart item
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The product this cart item refers to
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * The product variant (if applicable)
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /**
     * Accessor: total price (quantity × unit price)
     */
    public function getTotalPriceAttribute(): float
    {
        return (float) $this->price * $this->quantity;
    }

    /**
     * Get current product/variant price
     */
    public function getCurrentProductPrice(): float
    {
        if ($this->variant) {
            return $this->variant->current_price;
        }
        return $this->product->current_price;
    }

    /**
     * Sync price with current product/variant price
     */
    public function updatePrice(): void
    {
        $this->update(['price' => $this->getCurrentProductPrice()]);
    }

    /**
     * Check if product or variant is in stock
     */
    public function isAvailable(): bool
    {
        if ($this->variant) {
            return $this->variant->in_stock && $this->variant->stock_quantity >= $this->quantity;
        }
        return $this->product->in_stock && $this->product->stock_quantity >= $this->quantity;
    }

    /**
     * Get available stock for product/variant
     */
    public function getAvailableStock(): int
    {
        if ($this->variant) {
            return $this->variant->stock_quantity;
        }
        return $this->product->stock_quantity;
    }
}
