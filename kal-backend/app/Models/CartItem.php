<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
    ];

    protected $appends = [
        'total_price',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */
    public function getTotalPriceAttribute()
    {
        return $this->price * $this->quantity;
    }

    /**
     * Get the current price of the product or variant
     */
    public function getCurrentProductPrice()
    {
        if ($this->variant) {
            return $this->variant->current_price;
        }

        return $this->product ? $this->product->current_price : 0;
    }

    /**
     * Get available stock from product or variant
     */
    public function getAvailableStock()
    {
        if ($this->variant) {
            return $this->variant->stock_quantity;
        }

        return $this->product ? $this->product->stock_quantity : 0;
    }

    /**
     * Check if item is still available
     */
    public function isAvailable()
    {
        if ($this->variant) {
            return $this->variant->in_stock && $this->variant->stock_quantity > 0;
        }

        return $this->product && $this->product->in_stock && $this->product->stock_quantity > 0;
    }
}
