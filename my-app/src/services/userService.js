import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a new user profile in Firestore after sign-up
 */
export const createUserProfile = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userProfile = {
            displayName: userData.displayName || '',
            email: userData.email,
            phone: userData.phone || '',
            bio: userData.bio || '',
            photoURL: userData.photoURL || '',
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
        };

        await setDoc(userRef, userProfile);
        return { success: true, userId };
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile: ' + error.message);
    }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
        } else {
            return { success: false, error: 'User profile not found' };
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error('Failed to get user profile: ' + error.message);
    }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        const updateData = {
            ...updates,
            lastActive: serverTimestamp(),
        };

        await updateDoc(userRef, updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile: ' + error.message);
    }
};

/**
 * Update user's last active timestamp
 */
export const updateLastActive = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            lastActive: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating last active:', error);
        // Don't throw - this is a non-critical operation
    }
};

/**
 * Check if user profile exists, create if not
 */
export const ensureUserProfile = async (user) => {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create profile if it doesn't exist
            await createUserProfile(user.uid, {
                displayName: user.displayName || 'Anonymous',
                email: user.email,
                photoURL: user.photoURL || '',
            });
        } else {
            // Update last active
            await updateLastActive(user.uid);
        }

        return { success: true };
    } catch (error) {
        console.error('Error ensuring user profile:', error);
        return { success: false, error: error.message };
    }
};
