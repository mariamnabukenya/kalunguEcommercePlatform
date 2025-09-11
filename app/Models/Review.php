<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'order_id',
        'rating',
        'title',
        'comment',
        'is_verified_purchase',
        'is_approved',
        'helpful_votes',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'helpful_votes' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($review) {
            $review->product->updateRatingStats();
        });

        static::updated(function ($review) {
            $review->product->updateRatingStats();
        });

        static::deleted(function ($review) {
            $review->product->updateRatingStats();
        });
    }

    /**
     * Get the user who wrote this review
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product this review belongs to
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the order this review belongs to
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scope: Approved reviews
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope: Verified purchase reviews
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    /**
     * Scope: Filter by rating
     */
    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Get helpful votes count
     */
    public function getHelpfulVotesCountAttribute()
    {
        return is_array($this->helpful_votes) ? count($this->helpful_votes) : 0;
    }

    /**
     * Check if user found this review helpful
     */
    public function isHelpfulFor($userId)
    {
        return is_array($this->helpful_votes) && in_array($userId, $this->helpful_votes);
    }

    /**
     * Toggle helpful vote for user
     */
    public function toggleHelpful($userId)
    {
        $votes = $this->helpful_votes ?? [];
        
        if (in_array($userId, $votes)) {
            $votes = array_diff($votes, [$userId]);
        } else {
            $votes[] = $userId;
        }

        $this->update(['helpful_votes' => array_values($votes)]);
    }

    /**
     * Get star rating display
     */
    public function getStarsHtmlAttribute()
    {
        $html = '';
        for ($i = 1; $i <= 5; $i++) {
            if ($i <= $this->rating) {
                $html .= '★';
            } else {
                $html .= '☆';
            }
        }
        return $html;
    }
}