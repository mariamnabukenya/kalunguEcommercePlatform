<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Product;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';
    public $incrementing = true;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'category_name',
        'slug',
        'parent_id',
        'sort_order',
        'is_active',
        'meta_data',
        'category_id',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'is_active' => 'boolean',
        'meta_data' => 'array',
        'sort_order' => 'integer',
    ];

    /**
     * Get the parent category.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id' , 'category_id');
    }

    /**
     * Get active child categories.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id' , 'category_id')
                    ->where('is_active', true);
    }

    /**
     * Get all child categories recursively (category tree).
     */
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    /**
     *  Get products in this category.
     */
    public function products(): BelongsToMany
{
    return $this->belongsToMany(Product::class, 'product_categories', 'product_id', 'category_id');
}

    /**
     * Get only active products in this category.
     */
    public function activeProducts(): BelongsToMany
    {
        return $this->products()->where('products.status', 'active');
    }

    /**
     * Scope: Filter only active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Filter only root categories (no parent).
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope: Filter only child categories (have a parent).
     */
    public function scopeChildrenOnly($query)
    {
        return $query->whereNotNull('parent_id');
    }
}
