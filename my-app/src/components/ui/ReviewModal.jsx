import React, { useState } from 'react';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { REVIEW_TAGS, createReview } from '../../services/reviewService';
import './ReviewModal.css';

export default function ReviewModal({
    isOpen,
    onClose,
    tripId,
    matchId,
    currentUser,
    companion,
    addToast
}) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleTagToggle = (tagId) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            addToast?.('Please select a rating', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createReview({
                tripId,
                matchId,
                reviewerId: currentUser.uid,
                reviewerName: currentUser.displayName || 'Anonymous',
                revieweeId: companion.id,
                revieweeName: companion.name,
                rating,
                comment,
                tags: selectedTags
            });

            if (result.success) {
                addToast?.('✨ Review submitted successfully!', 'success');
                onClose(true); // Pass true to indicate successful submission
            } else {
                addToast?.(result.error || 'Failed to submit review', 'error');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            addToast?.('Failed to submit review', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayRating = hoveredRating || rating;

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal glass-card" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="review-modal-header">
                    <div className="review-modal-title">
                        <Sparkles size={24} className="sparkle-icon" />
                        <h3>Rate Your Companion</h3>
                    </div>
                    <button className="review-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Companion Info */}
                <div className="review-companion-info">
                    <div className="companion-avatar-large">
                        {companion.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="companion-name-large">{companion.name}</span>
                </div>

                {/* Star Rating */}
                <div className="star-rating-container">
                    <p className="rating-prompt">How was your travel experience?</p>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`star-btn ${star <= displayRating ? 'active' : ''}`}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={36}
                                    fill={star <= displayRating ? '#FFB800' : 'none'}
                                    stroke={star <= displayRating ? '#FFB800' : '#CBD5E1'}
                                    strokeWidth={2}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="rating-label">
                        {rating === 0 && 'Tap to rate'}
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Great'}
                        {rating === 5 && 'Excellent!'}
                    </span>
                </div>

                {/* Tags */}
                <div className="review-tags-section">
                    <p className="tags-prompt">What made them a great companion?</p>
                    <div className="review-tags">
                        {REVIEW_TAGS.map((tag) => (
                            <button
                                key={tag.id}
                                className={`review-tag ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                onClick={() => handleTagToggle(tag.id)}
                            >
                                <span className="tag-emoji">{tag.emoji}</span>
                                {tag.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="review-comment-section">
                    <textarea
                        className="review-textarea"
                        placeholder="Share more about your experience (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
                        rows={3}
                    />
                    <span className="char-count">{comment.length}/500</span>
                </div>

                {/* Submit Button */}
                <button
                    className={`review-submit-btn ${isSubmitting ? 'loading' : ''}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? (
                        <>
                            <Sparkles className="spin" size={18} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Review
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
