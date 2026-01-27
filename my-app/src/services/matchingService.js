import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Find matching trips based on destination, start point, date, and time
 */
export const findMatches = async (newTrip) => {
    try {
        const tripsRef = collection(db, 'trips');

        // Query for trips with same destination and start point
        const q = query(
            tripsRef,
            where('destination', '==', newTrip.destination),
            where('startPoint', '==', newTrip.startPoint),
            where('date', '==', newTrip.date),
            where('status', '==', 'active')
        );

        const querySnapshot = await getDocs(q);
        const matches = [];

        querySnapshot.forEach((doc) => {
            const trip = { id: doc.id, ...doc.data() };

            // Skip the new trip itself
            if (trip.id === newTrip.id || trip.userId === newTrip.userId) {
                return;
            }

            // Check if time is within 1 hour window
            const newTripTime = parseTime(newTrip.time);
            const tripTime = parseTime(trip.time);
            const timeDiff = Math.abs(newTripTime - tripTime);

            if (timeDiff <= 60) { // Within 1 hour (in minutes)
                matches.push(trip);
            }
        });

        return { success: true, matches };
    } catch (error) {
        console.error('Error finding matches:', error);
        throw new Error('Failed to find matches: ' + error.message);
    }
};

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Create a match record in the database
 */
export const createMatch = async (trip1, trip2) => {
    try {
        const match = {
            trip1Id: trip1.id,
            trip2Id: trip2.id,
            user1Id: trip1.userId,
            user2Id: trip2.userId,
            user1Name: trip1.userDisplayName,
            user2Name: trip2.userDisplayName,
            destination: trip1.destination,
            startPoint: trip1.startPoint,
            date: trip1.date,
            matchedAt: serverTimestamp(),
            notified: false,
        };

        const matchRef = await addDoc(collection(db, 'matches'), match);
        return { success: true, matchId: matchRef.id };
    } catch (error) {
        console.error('Error creating match:', error);
        throw new Error('Failed to create match: ' + error.message);
    }
};

/**
 * Get all matches for a user
 */
export const getMatchesForUser = async (userId) => {
    try {
        const matchesRef = collection(db, 'matches');

        // Query for matches where user is either user1 or user2
        const q1 = query(matchesRef, where('user1Id', '==', userId));
        const q2 = query(matchesRef, where('user2Id', '==', userId));

        const [snapshot1, snapshot2] = await Promise.all([
            getDocs(q1),
            getDocs(q2)
        ]);

        const matches = [];
        snapshot1.forEach((doc) => {
            matches.push({ id: doc.id, ...doc.data() });
        });
        snapshot2.forEach((doc) => {
            matches.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, matches };
    } catch (error) {
        console.error('Error getting matches:', error);
        throw new Error('Failed to get matches: ' + error.message);
    }
};

/**
 * Listen to real-time match updates for a user
 */
export const listenToMatches = (userId, callback) => {
    try {
        const matchesRef = collection(db, 'matches');

        // Listen to matches where user is user1
        const q1 = query(matchesRef, where('user1Id', '==', userId));
        const unsubscribe1 = onSnapshot(q1, (snapshot) => {
            const matches = [];
            snapshot.forEach((doc) => {
                matches.push({ id: doc.id, ...doc.data() });
            });
            callback(matches, 'user1');
        });

        // Listen to matches where user is user2
        const q2 = query(matchesRef, where('user2Id', '==', userId));
        const unsubscribe2 = onSnapshot(q2, (snapshot) => {
            const matches = [];
            snapshot.forEach((doc) => {
                matches.push({ id: doc.id, ...doc.data() });
            });
            callback(matches, 'user2');
        });

        // Return combined unsubscribe function
        return () => {
            unsubscribe1();
            unsubscribe2();
        };
    } catch (error) {
        console.error('Error setting up match listener:', error);
        throw new Error('Failed to set up match listener: ' + error.message);
    }
};

/**
 * Process a new trip and create matches
 */
export const processNewTripMatches = async (newTrip) => {
    try {
        // Find all matching trips
        const { matches } = await findMatches(newTrip);

        // Create match records for each match found
        const matchPromises = matches.map(matchingTrip =>
            createMatch(newTrip, matchingTrip)
        );

        const results = await Promise.all(matchPromises);

        return {
            success: true,
            matchCount: matches.length,
            matches: results
        };
    } catch (error) {
        console.error('Error processing trip matches:', error);
        return { success: false, error: error.message };
    }
};
