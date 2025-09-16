<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\OrderItem;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_status',
        'payment_method',
        'payment_transaction_id',
        'shipping_address',
        'billing_address',
        'shipping_method',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (!$order->order_number) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }

    /**
     * User relation
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Items relation
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope: filter by status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: filter by payment status
     */
    public function scopePaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    /**
     * Scope: recent orders
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Business logic helpers
     */
    public function canBeCancelled()
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    public function isCompleted()
    {
        return $this->status === 'delivered';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }

    /**
     * UI helper: status badge CSS class
     */
    public function getStatusBadgeClass()
    {
        return match ($this->status) {
            'pending' => 'badge-warning',
            'processing' => 'badge-info',
            'shipped' => 'badge-primary',
            'delivered' => 'badge-success',
            'cancelled' => 'badge-danger',
            default => 'badge-secondary',
        };
    }

    /**
     * Accessors
     */
    public function getTotalItemsAttribute()
    {
        return $this->items->sum('quantity');
    }

    /**
     * Calculate totals dynamically
     */
    public function calculateTotals($taxRate = 0.1, $shippingAmount = 0, $discountAmount = 0)
    {
        $subtotal = $this->items->sum(fn($item) => $item->total_price);
        $taxAmount = $subtotal * $taxRate;
        $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;

        $this->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'shipping_amount' => $shippingAmount,
            'discount_amount' => $discountAmount,
            'total_amount' => $total,
        ]);
    }
}
