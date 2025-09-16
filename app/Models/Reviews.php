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

    /**
     * Booted method to automatically update product ratings.
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($review) {
            if ($review->product) {
                $review->product->updateRatingStats();
            }
        });

        static::deleted(function ($review) {
            if ($review->product) {
                $review->product->updateRatingStats();
            }
        });
    }

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Scopes
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified_purchase', true);
    }

    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Accessors & Helpers
     */
    public function getHelpfulVotesCountAttribute(): int
    {
        return is_array($this->helpful_votes) ? count($this->helpful_votes) : 0;
    }

    public function isHelpfulFor(int $userId): bool
    {
        return is_array($this->helpful_votes) && in_array($userId, $this->helpful_votes);
    }

    public function toggleHelpful(int $userId): void
    {
        $votes = $this->helpful_votes ?? [];

        if (in_array($userId, $votes)) {
            $votes = array_values(array_diff($votes, [$userId]));
        } else {
            $votes[] = $userId;
        }

        $this->update(['helpful_votes' => $votes]);
    }

    public function getStarsHtmlAttribute(): string
    {
        $html = '';
        for ($i = 1; $i <= 5; $i++) {
            $html .= $i <= $this->rating ? '★' : '☆';
        }
        return $html;
    }
}
