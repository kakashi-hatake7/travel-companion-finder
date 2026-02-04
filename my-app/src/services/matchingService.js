import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { createNotification } from './notificationService';
import { queueEmail } from './emailService';

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

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const hour = Number.isNaN(hours) ? 0 : hours;
    const minute = Number.isNaN(minutes) ? 0 : minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const getUserEmail = async (userId) => {
    if (!userId) return null;
    try {
        const userSnap = await getDoc(doc(db, 'users', userId));
        if (!userSnap.exists()) return null;
        return userSnap.data().email || null;
    } catch (error) {
        console.error('Error fetching user email:', error);
        return null;
    }
};

const notifyMatchFound = async ({ matchId, newTrip, matchingTrip }) => {
    const dateLabel = formatDate(newTrip.date);
    const newTripTime = formatTime(newTrip.time);
    const matchingTripTime = formatTime(matchingTrip.time);

    const notifications = [
        createNotification({
            userId: newTrip.userId,
            type: 'match_found',
            title: 'New travel match found',
            message: `${matchingTrip.userDisplayName || 'Traveler'} is heading to ${newTrip.destination} from ${newTrip.startPoint} on ${dateLabel} around ${matchingTripTime}.`,
            tripId: newTrip.id,
            matchId,
            actorId: matchingTrip.userId,
            actorName: matchingTrip.userDisplayName || 'Traveler',
            meta: {
                destination: newTrip.destination,
                startPoint: newTrip.startPoint,
                date: newTrip.date,
                time: newTrip.time
            }
        }),
        createNotification({
            userId: matchingTrip.userId,
            type: 'match_found',
            title: 'New travel match found',
            message: `${newTrip.userDisplayName || 'Traveler'} is heading to ${matchingTrip.destination} from ${matchingTrip.startPoint} on ${dateLabel} around ${newTripTime}.`,
            tripId: matchingTrip.id,
            matchId,
            actorId: newTrip.userId,
            actorName: newTrip.userDisplayName || 'Traveler',
            meta: {
                destination: matchingTrip.destination,
                startPoint: matchingTrip.startPoint,
                date: matchingTrip.date,
                time: matchingTrip.time
            }
        })
    ];

    const [newTripEmail, matchingTripEmail] = await Promise.all([
        newTrip.userEmail || getUserEmail(newTrip.userId),
        matchingTrip.userEmail || getUserEmail(matchingTrip.userId)
    ]);

    const emails = [];

    if (newTripEmail) {
        emails.push(queueEmail({
            to: newTripEmail,
            subject: `New match for ${newTrip.destination}`,
            text: `Good news! ${matchingTrip.userDisplayName || 'A traveler'} is going to ${newTrip.destination} from ${newTrip.startPoint} on ${dateLabel} around ${matchingTripTime}. Open UniGo to choose your companion.`,
            userId: newTrip.userId,
            type: 'match_found',
            meta: { matchId, tripId: newTrip.id }
        }));
    }

    if (matchingTripEmail) {
        emails.push(queueEmail({
            to: matchingTripEmail,
            subject: `New match for ${matchingTrip.destination}`,
            text: `Good news! ${newTrip.userDisplayName || 'A traveler'} is going to ${matchingTrip.destination} from ${matchingTrip.startPoint} on ${dateLabel} around ${newTripTime}. Open UniGo to choose your companion.`,
            userId: matchingTrip.userId,
            type: 'match_found',
            meta: { matchId, tripId: matchingTrip.id }
        }));
    }

    await Promise.all([...notifications, ...emails]);
};

const notifyCompanionSelected = async (match, actorId) => {
    const dateLabel = formatDate(match.date);
    const actorName = actorId === match.user1Id ? match.user1Name : match.user2Name;

    const notifications = [
        createNotification({
            userId: match.user1Id,
            type: 'companion_selected',
            title: 'Companion selected',
            message: `You and ${match.user2Name} are now companions for ${match.destination} on ${dateLabel}. Open My Trips to view contact details.`,
            tripId: match.trip1Id,
            matchId: match.id,
            actorId,
            actorName
        }),
        createNotification({
            userId: match.user2Id,
            type: 'companion_selected',
            title: 'Companion selected',
            message: `You and ${match.user1Name} are now companions for ${match.destination} on ${dateLabel}. Open My Trips to view contact details.`,
            tripId: match.trip2Id,
            matchId: match.id,
            actorId,
            actorName
        })
    ];

    const [user1Email, user2Email] = await Promise.all([
        match.user1Email || getUserEmail(match.user1Id),
        match.user2Email || getUserEmail(match.user2Id)
    ]);

    const emails = [];
    if (user1Email) {
        emails.push(queueEmail({
            to: user1Email,
            subject: `Companion selected for ${match.destination}`,
            text: `You're now traveling with ${match.user2Name} to ${match.destination} on ${dateLabel}. Open UniGo to view contact details.`,
            userId: match.user1Id,
            type: 'companion_selected',
            meta: { matchId: match.id, tripId: match.trip1Id }
        }));
    }
    if (user2Email) {
        emails.push(queueEmail({
            to: user2Email,
            subject: `Companion selected for ${match.destination}`,
            text: `You're now traveling with ${match.user1Name} to ${match.destination} on ${dateLabel}. Open UniGo to view contact details.`,
            userId: match.user2Id,
            type: 'companion_selected',
            meta: { matchId: match.id, tripId: match.trip2Id }
        }));
    }

    await Promise.all([...notifications, ...emails]);
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
            user1Email: trip1.userEmail || null,
            user2Email: trip2.userEmail || null,
            destination: trip1.destination,
            startPoint: trip1.startPoint,
            date: trip1.date,
            matchedAt: serverTimestamp(),
            notified: false,
            status: 'pending',
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
        const results = [];
        for (const matchingTrip of matches) {
            const matchResult = await createMatch(newTrip, matchingTrip);
            results.push(matchResult);

            if (matchResult?.matchId) {
                try {
                    await notifyMatchFound({
                        matchId: matchResult.matchId,
                        newTrip,
                        matchingTrip
                    });
                } catch (error) {
                    console.error('Error sending match notifications:', error);
                }
            }
        }

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

/**
 * Get detailed match information for a specific trip
 * Returns companion details (name, contact, time)
 */
export const getMatchDetailsForTrip = async (tripId, userId) => {
    try {
        const matchesRef = collection(db, 'matches');

        // Find matches where this trip is involved
        const q1 = query(matchesRef, where('trip1Id', '==', tripId));
        const q2 = query(matchesRef, where('trip2Id', '==', tripId));

        const [snapshot1, snapshot2] = await Promise.all([
            getDocs(q1),
            getDocs(q2)
        ]);

        const matchDetails = [];

        // Process matches
        const processMatch = async (matchDoc) => {
            const match = { id: matchDoc.id, ...matchDoc.data() };

            // Skip rejected matches
            if (match.status === 'rejected') return null;

            // Determine which user is the companion (the other user)
            const isUser1 = match.user1Id === userId;
            const companionTripId = isUser1 ? match.trip2Id : match.trip1Id;

            // Fetch companion's trip details
            const tripDoc = await getDoc(doc(db, 'trips', companionTripId));
            if (!tripDoc.exists()) return null;

            const companionTrip = tripDoc.data();

            return {
                matchId: match.id,
                companionName: isUser1 ? match.user2Name : match.user1Name,
                companionUserId: isUser1 ? match.user2Id : match.user1Id,
                companionContact: companionTrip.contact,
                companionTime: companionTrip.time,
                destination: match.destination,
                startPoint: match.startPoint,
                date: match.date,
                status: match.status || 'pending',
                matchedAt: match.matchedAt
            };
        };

        // Process all matches
        for (const matchDoc of snapshot1.docs) {
            const detail = await processMatch(matchDoc);
            if (detail) matchDetails.push(detail);
        }
        for (const matchDoc of snapshot2.docs) {
            const detail = await processMatch(matchDoc);
            if (detail) matchDetails.push(detail);
        }

        return { success: true, companions: matchDetails };
    } catch (error) {
        console.error('Error getting match details:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Confirm/select a companion from matches
 */
export const confirmMatch = async (matchId, userId) => {
    try {
        const matchRef = doc(db, 'matches', matchId);
        const matchSnap = await getDoc(matchRef);

        if (!matchSnap.exists()) {
            return { success: false, error: 'Match not found' };
        }

        const match = { id: matchSnap.id, ...matchSnap.data() };

        if (match.status === 'confirmed') {
            return { success: true, alreadyConfirmed: true };
        }
        await updateDoc(matchRef, {
            status: 'confirmed',
            confirmedBy: userId,
            confirmedAt: serverTimestamp()
        });

        try {
            await notifyCompanionSelected(match, userId);
        } catch (error) {
            console.error('Error sending companion notifications:', error);
        }
        return { success: true };
    } catch (error) {
        console.error('Error confirming match:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reject a companion from matches
 */
export const rejectMatch = async (matchId, userId) => {
    try {
        const matchRef = doc(db, 'matches', matchId);
        await updateDoc(matchRef, {
            status: 'rejected',
            rejectedBy: userId,
            rejectedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error rejecting match:', error);
        return { success: false, error: error.message };
    }
};
