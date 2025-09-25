<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'full_name',
        'phone',
        'street',
        'city',
        'state',
        'postal_code',
        'country',
    ];

    // 🔹 Relationship: Each address belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 Relationship: Used in orders (shipping / billing)
    public function shippingOrders()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }

    public function billingOrders()
    {
        return $this->hasMany(Order::class, 'billing_address_id');
    }
}
