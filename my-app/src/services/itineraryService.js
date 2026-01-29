// Itinerary Builder Service - Firestore operations for collaborative trip planning
import { db } from '../firebase';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

/**
 * Add a new activity to the itinerary
 */
export const addActivity = async (tripId, activityData, userId, userName) => {
    try {
        const activitiesRef = collection(db, 'itineraries', tripId, 'activities');
        const docRef = await addDoc(activitiesRef, {
            day: activityData.day || 1,
            time: activityData.time || '09:00',
            title: activityData.title,
            type: activityData.type || 'activity',
            location: activityData.location || '',
            notes: activityData.notes || '',
            suggestedBy: userId,
            suggestedByName: userName,
            approvedBy: [userId], // Creator auto-approves
            status: 'suggested', // suggested | approved
            createdAt: serverTimestamp()
        });
        return { success: true, activityId: docRef.id };
    } catch (error) {
        console.error('Error adding activity:', error);
        throw error;
    }
};

/**
 * Approve an activity
 */
export const approveActivity = async (tripId, activityId, userId, currentApprovedBy) => {
    try {
        const activityRef = doc(db, 'itineraries', tripId, 'activities', activityId);
        const newApprovedBy = [...new Set([...currentApprovedBy, userId])];
        await updateDoc(activityRef, {
            approvedBy: newApprovedBy,
            status: 'approved' // Everyone approves = approved
        });
        return { success: true };
    } catch (error) {
        console.error('Error approving activity:', error);
        throw error;
    }
};

/**
 * Update an activity
 */
export const updateActivity = async (tripId, activityId, updates) => {
    try {
        const activityRef = doc(db, 'itineraries', tripId, 'activities', activityId);
        await updateDoc(activityRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating activity:', error);
        throw error;
    }
};

/**
 * Delete an activity
 */
export const deleteActivity = async (tripId, activityId) => {
    try {
        const activityRef = doc(db, 'itineraries', tripId, 'activities', activityId);
        await deleteDoc(activityRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting activity:', error);
        throw error;
    }
};

/**
 * Listen to real-time updates for itinerary
 */
export const listenToItinerary = (tripId, callback) => {
    const activitiesRef = collection(db, 'itineraries', tripId, 'activities');
    const q = query(activitiesRef, orderBy('day', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const activities = [];
        snapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        // Sort by day then time
        activities.sort((a, b) => {
            if (a.day !== b.day) return a.day - b.day;
            return a.time.localeCompare(b.time);
        });
        callback(activities);
    }, (error) => {
        console.error('Error listening to itinerary:', error);
        callback([]);
    });
};

// Activity types
export const ACTIVITY_TYPES = [
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6' },
    { id: 'sightseeing', name: 'Sightseeing', icon: '📸', color: '#8b5cf6' },
    { id: 'food', name: 'Food', icon: '🍽️', color: '#f59e0b' },
    { id: 'hotel', name: 'Hotel', icon: '🏨', color: '#22c55e' },
    { id: 'activity', name: 'Activity', icon: '🎯', color: '#ec4899' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#14b8a6' }
];
