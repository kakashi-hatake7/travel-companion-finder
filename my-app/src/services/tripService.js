import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    deleteDoc,
    updateDoc,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new trip in Firestore
 */
export const createTrip = async (tripData, userId, userDisplayName, userEmail) => {
    try {
        // Validate required fields
        if (!tripData.destination || !tripData.startPoint || !tripData.date || !tripData.time) {
            throw new Error('Missing required trip fields');
        }

        // Calculate expiration date (trip date + 1 day)
        const tripDate = new Date(tripData.date);
        const expiresAt = new Date(tripDate);
        expiresAt.setDate(expiresAt.getDate() + 1);

        const trip = {
            userId,
            userDisplayName: userDisplayName || 'Anonymous',
            userEmail: userEmail || '',
            destination: tripData.destination,
            startPoint: tripData.startPoint,
            date: tripData.date,
            time: tripData.time,
            contact: tripData.contact || '',
            genderPreference: tripData.genderPreference || 'any',
            isGroupTrip: tripData.isGroupTrip || false,
            totalSeats: tripData.isGroupTrip ? (tripData.totalSeats || 4) : 1,
            members: [userId],
            availableSeats: tripData.isGroupTrip ? ((tripData.totalSeats || 4) - 1) : 0,
            status: 'active',
            createdAt: serverTimestamp(),
            expiresAt: Timestamp.fromDate(expiresAt),
        };

        const tripRef = await addDoc(collection(db, 'trips'), trip);
        return { success: true, tripId: tripRef.id, trip };
    } catch (error) {
        console.error('Error creating trip:', error);
        throw new Error('Failed to create trip: ' + error.message);
    }
};

/**
 * Get all active trips
 */
export const getAllActiveTrips = async () => {
    try {
        const tripsRef = collection(db, 'trips');
        const q = query(
            tripsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, trips };
    } catch (error) {
        console.error('Error getting trips:', error);
        throw new Error('Failed to get trips: ' + error.message);
    }
};

/**
 * Get trips for a specific user
 */
export const getUserTrips = async (userId) => {
    try {
        const tripsRef = collection(db, 'trips');
        const q = query(
            tripsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, trips };
    } catch (error) {
        console.error('Error getting user trips:', error);
        throw new Error('Failed to get user trips: ' + error.message);
    }
};

/**
 * Search trips by filters
 */
export const searchTrips = async (filters) => {
    try {
        const tripsRef = collection(db, 'trips');
        let q = query(tripsRef, where('status', '==', 'active'));

        // Add filters
        if (filters.destination) {
            q = query(q, where('destination', '==', filters.destination));
        }
        if (filters.startPoint) {
            q = query(q, where('startPoint', '==', filters.startPoint));
        }
        if (filters.date) {
            q = query(q, where('date', '==', filters.date));
        }

        const querySnapshot = await getDocs(q);
        const trips = [];
        querySnapshot.forEach((doc) => {
            trips.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, trips };
    } catch (error) {
        console.error('Error searching trips:', error);
        throw new Error('Failed to search trips: ' + error.message);
    }
};

/**
 * Update trip status
 */
export const updateTripStatus = async (tripId, status) => {
    try {
        const tripRef = doc(db, 'trips', tripId);
        await updateDoc(tripRef, { status });
        return { success: true };
    } catch (error) {
        console.error('Error updating trip status:', error);
        throw new Error('Failed to update trip status: ' + error.message);
    }
};

/**
 * Update trip details
 */
export const updateTrip = async (tripId, updatedData) => {
    try {
        // Validate required fields
        if (!updatedData.destination || !updatedData.startPoint || !updatedData.date || !updatedData.time) {
            throw new Error('Missing required trip fields');
        }

        // Calculate new expiration date if date changed
        const tripDate = new Date(updatedData.date);
        const expiresAt = new Date(tripDate);
        expiresAt.setDate(expiresAt.getDate() + 1);

        const tripRef = doc(db, 'trips', tripId);
        await updateDoc(tripRef, {
            destination: updatedData.destination,
            startPoint: updatedData.startPoint,
            date: updatedData.date,
            time: updatedData.time,
            contact: updatedData.contact || '',
            genderPreference: updatedData.genderPreference || 'any',
            isGroupTrip: updatedData.isGroupTrip || false,
            totalSeats: updatedData.isGroupTrip ? (updatedData.totalSeats || 4) : 1,
            expiresAt: Timestamp.fromDate(expiresAt),
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating trip:', error);
        throw new Error('Failed to update trip: ' + error.message);
    }
};

/**
 * Delete a trip
 */
export const deleteTrip = async (tripId) => {
    try {
        const tripRef = doc(db, 'trips', tripId);
        await deleteDoc(tripRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw new Error('Failed to delete trip: ' + error.message);
    }
};

/**
 * Listen to real-time trip updates
 * Returns an unsubscribe function
 */
export const listenToTrips = (callback) => {
    try {
        const tripsRef = collection(db, 'trips');
        const q = query(
            tripsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const trips = [];
            querySnapshot.forEach((doc) => {
                trips.push({ id: doc.id, ...doc.data() });
            });
            callback(trips);
        }, (error) => {
            console.error('Error in trip listener:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up trip listener:', error);
        throw new Error('Failed to set up trip listener: ' + error.message);
    }
};

/**
 * Get trip by ID
 */
export const getTripById = async (tripId) => {
    try {
        const tripRef = doc(db, 'trips', tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
            return { success: true, trip: { id: tripSnap.id, ...tripSnap.data() } };
        } else {
            return { success: false, error: 'Trip not found' };
        }
    } catch (error) {
        console.error('Error getting trip:', error);
        throw new Error('Failed to get trip: ' + error.message);
    }
};

/**
 * Clean up expired trips (can be called periodically)
 */
export const cleanupExpiredTrips = async () => {
    try {
        const tripsRef = collection(db, 'trips');
        const now = Timestamp.now();
        const q = query(
            tripsRef,
            where('expiresAt', '<', now),
            where('status', '==', 'active')
        );

        const querySnapshot = await getDocs(q);
        const deletePromises = [];

        querySnapshot.forEach((doc) => {
            deletePromises.push(updateDoc(doc.ref, { status: 'expired' }));
        });

        await Promise.all(deletePromises);
        return { success: true, count: deletePromises.length };
    } catch (error) {
        console.error('Error cleaning up expired trips:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Join a group trip
 */
export const joinGroup = async (tripId, userId, userDisplayName) => {
    try {
        const tripRef = doc(db, 'trips', tripId);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
            return { success: false, error: 'Trip not found' };
        }

        const trip = tripSnap.data();

        // Check if it's a group trip
        if (!trip.isGroupTrip) {
            return { success: false, error: 'This is not a group trip' };
        }

        // Check if user already joined
        if (trip.members && trip.members.includes(userId)) {
            return { success: false, error: 'You have already joined this group' };
        }

        // Check if seats available
        if (trip.availableSeats <= 0) {
            return { success: false, error: 'Group is full' };
        }

        // Add user to members
        const updatedMembers = [...(trip.members || []), userId];
        await updateDoc(tripRef, {
            members: updatedMembers,
            availableSeats: trip.availableSeats - 1
        });

        return { success: true };
    } catch (error) {
        console.error('Error joining group:', error);
        return { success: false, error: error.message };
    }
};
