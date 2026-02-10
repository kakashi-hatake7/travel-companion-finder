import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    serverTimestamp,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Review tags that users can select when leaving a review
 */
export const REVIEW_TAGS = [
    { id: 'punctual', label: 'Punctual', emoji: '⏰' },
    { id: 'friendly', label: 'Friendly', emoji: '😊' },
    { id: 'communicator', label: 'Great Communicator', emoji: '💬' },
    { id: 'helpful', label: 'Helpful', emoji: '🤝' },
    { id: 'respectful', label: 'Respectful', emoji: '🙏' },
    { id: 'fun', label: 'Fun to Travel With', emoji: '🎉' }
];

/**
 * Create a new review for a travel companion
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.tripId - ID of the completed trip
 * @param {string} reviewData.matchId - ID of the match
 * @param {string} reviewData.reviewerId - ID of the user leaving the review
 * @param {string} reviewData.reviewerName - Name of the reviewer
 * @param {string} reviewData.revieweeId - ID of the user being reviewed
 * @param {string} reviewData.revieweeName - Name of the user being reviewed
 * @param {number} reviewData.rating - Rating from 1-5
 * @param {string} reviewData.comment - Optional text review
 * @param {string[]} reviewData.tags - Array of selected tag IDs
 */
export const createReview = async (reviewData) => {
    try {
        // Validate rating
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' };
        }

        // Check if review already exists for this trip/reviewer combo
        const existingReview = await hasReviewedTrip(reviewData.tripId, reviewData.reviewerId, reviewData.revieweeId);
        if (existingReview) {
            return { success: false, error: 'You have already reviewed this companion for this trip' };
        }

        const review = {
            tripId: reviewData.tripId,
            matchId: reviewData.matchId,
            reviewerId: reviewData.reviewerId,
            reviewerName: reviewData.reviewerName || 'Anonymous',
            revieweeId: reviewData.revieweeId,
            revieweeName: reviewData.revieweeName || 'Anonymous',
            rating: reviewData.rating,
            comment: reviewData.comment?.trim() || '',
            tags: reviewData.tags || [],
            createdAt: serverTimestamp()
        };

        const reviewRef = await addDoc(collection(db, 'reviews'), review);

        // Update reviewee's average rating
        await updateUserRatingStats(reviewData.revieweeId);

        return { success: true, reviewId: reviewRef.id };
    } catch (error) {
        console.error('Error creating review:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Check if a user has already reviewed a specific companion for a trip
 */
export const hasReviewedTrip = async (tripId, reviewerId, revieweeId) => {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(
            reviewsRef,
            where('tripId', '==', tripId),
            where('reviewerId', '==', reviewerId),
            where('revieweeId', '==', revieweeId)
        );

        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error('Error checking existing review:', error);
        return false;
    }
};

/**
 * Get all reviews for a specific user
 * @param {string} userId - ID of the user to get reviews for
 * @param {number} maxReviews - Maximum number of reviews to return (default 10)
 */
export const getReviewsForUser = async (userId, maxReviews = 10) => {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(
            reviewsRef,
            where('revieweeId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(maxReviews)
        );

        const snapshot = await getDocs(q);
        const reviews = [];

        snapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, reviews };
    } catch (error) {
        console.error('Error getting reviews:', error);
        return { success: false, error: error.message, reviews: [] };
    }
};

/**
 * Get aggregate rating stats for a user
 * @param {string} userId - ID of the user
 */
export const getUserRating = async (userId) => {
    try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('revieweeId', '==', userId));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { success: true, averageRating: 0, reviewCount: 0, tags: {} };
        }

        let totalRating = 0;
        const tagCounts = {};

        snapshot.forEach((doc) => {
            const review = doc.data();
            totalRating += review.rating;

            // Count tag occurrences
            (review.tags || []).forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        const reviewCount = snapshot.size;
        const averageRating = totalRating / reviewCount;

        return {
            success: true,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount,
            tags: tagCounts
        };
    } catch (error) {
        console.error('Error getting user rating:', error);
        return { success: false, error: error.message, averageRating: 0, reviewCount: 0 };
    }
};

/**
 * Update a user's aggregate rating stats in their profile
 * Called after a new review is submitted
 */
const updateUserRatingStats = async (userId) => {
    try {
        const ratingStats = await getUserRating(userId);

        if (ratingStats.success) {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                averageRating: ratingStats.averageRating,
                reviewCount: ratingStats.reviewCount
            });
        }
    } catch (error) {
        console.error('Error updating user rating stats:', error);
        // Non-critical failure, don't throw
    }
};

/**
 * Get reviews that the current user needs to write (for completed trips)
 * Returns trips where user hasn't reviewed their companion yet
 */
export const getPendingReviews = async (userId, completedMatches) => {
    try {
        const pendingReviews = [];

        for (const match of completedMatches) {
            // Determine who the companion is
            const isUser1 = match.user1Id === userId;
            const companionId = isUser1 ? match.user2Id : match.user1Id;
            const companionName = isUser1 ? match.user2Name : match.user1Name;
            const tripId = isUser1 ? match.trip1Id : match.trip2Id;

            // Check if user has already reviewed this companion for this trip
            const hasReviewed = await hasReviewedTrip(tripId, userId, companionId);

            if (!hasReviewed) {
                pendingReviews.push({
                    matchId: match.id,
                    tripId,
                    companionId,
                    companionName,
                    destination: match.destination,
                    date: match.date
                });
            }
        }

        return { success: true, pendingReviews };
    } catch (error) {
        console.error('Error getting pending reviews:', error);
        return { success: false, error: error.message, pendingReviews: [] };
    }
};
