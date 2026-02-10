import React, { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { getUserRating, REVIEW_TAGS } from '../../services/reviewService';
import './UserRating.css';

export default function UserRating({ userId, size = 'default', showCount = true }) {
    const [rating, setRating] = useState({ averageRating: 0, reviewCount: 0, tags: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchRating();
        }
    }, [userId]);

    const fetchRating = async () => {
        setLoading(true);
        try {
            const result = await getUserRating(userId);
            if (result.success) {
                setRating(result);
            }
        } catch (error) {
            console.error('Error fetching rating:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`user-rating user-rating-${size} loading`}>
                <div className="rating-skeleton"></div>
            </div>
        );
    }

    if (rating.reviewCount === 0) {
        return (
            <div className={`user-rating user-rating-${size} no-reviews`}>
                <Star size={size === 'small' ? 14 : 16} />
                <span className="no-reviews-text">New</span>
            </div>
        );
    }

    // Get top tags (max 2)
    const topTags = Object.entries(rating.tags || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([tagId]) => REVIEW_TAGS.find(t => t.id === tagId))
        .filter(Boolean);

    const renderStars = () => {
        const fullStars = Math.floor(rating.averageRating);
        const hasHalfStar = rating.averageRating % 1 >= 0.5;
        const starSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;

        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={starSize}
                        fill={star <= fullStars ? '#FFB800' : (star === fullStars + 1 && hasHalfStar) ? 'url(#half-star)' : 'none'}
                        stroke={star <= fullStars || (star === fullStars + 1 && hasHalfStar) ? '#FFB800' : '#CBD5E1'}
                        strokeWidth={2}
                    />
                ))}
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="half-star">
                            <stop offset="50%" stopColor="#FFB800" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        );
    };

    return (
        <div className={`user-rating user-rating-${size}`}>
            {renderStars()}
            <span className="rating-value">{rating.averageRating}</span>
            {showCount && (
                <span className="review-count">
                    ({rating.reviewCount})
                </span>
            )}
            {size === 'large' && topTags.length > 0 && (
                <div className="top-tags">
                    {topTags.map((tag) => (
                        <span key={tag.id} className="top-tag">
                            {tag.emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Compact inline rating badge for small spaces
 */
export function RatingBadge({ averageRating, reviewCount }) {
    if (!reviewCount || reviewCount === 0) {
        return (
            <span className="rating-badge new">
                <Star size={12} />
                New
            </span>
        );
    }

    return (
        <span className="rating-badge">
            <Star size={12} fill="#FFB800" stroke="#FFB800" />
            {averageRating}
            <span className="badge-count">({reviewCount})</span>
        </span>
    );
}
