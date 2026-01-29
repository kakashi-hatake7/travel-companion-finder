// Packing List Service - Firestore operations for shared packing lists
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
 * Add a new item to the packing list
 */
export const addPackingItem = async (tripId, itemData, userId, userName) => {
    try {
        const itemsRef = collection(db, 'packingLists', tripId, 'items');
        const docRef = await addDoc(itemsRef, {
            name: itemData.name,
            category: itemData.category || 'General',
            claimedBy: null,
            claimedByName: null,
            createdBy: userId,
            createdByName: userName,
            createdAt: serverTimestamp()
        });
        return { success: true, itemId: docRef.id };
    } catch (error) {
        console.error('Error adding packing item:', error);
        throw error;
    }
};

/**
 * Claim an item (mark as "I'm bringing this")
 */
export const claimPackingItem = async (tripId, itemId, userId, userName) => {
    try {
        const itemRef = doc(db, 'packingLists', tripId, 'items', itemId);
        await updateDoc(itemRef, {
            claimedBy: userId,
            claimedByName: userName
        });
        return { success: true };
    } catch (error) {
        console.error('Error claiming item:', error);
        throw error;
    }
};

/**
 * Unclaim an item
 */
export const unclaimPackingItem = async (tripId, itemId) => {
    try {
        const itemRef = doc(db, 'packingLists', tripId, 'items', itemId);
        await updateDoc(itemRef, {
            claimedBy: null,
            claimedByName: null
        });
        return { success: true };
    } catch (error) {
        console.error('Error unclaiming item:', error);
        throw error;
    }
};

/**
 * Delete a packing item
 */
export const deletePackingItem = async (tripId, itemId) => {
    try {
        const itemRef = doc(db, 'packingLists', tripId, 'items', itemId);
        await deleteDoc(itemRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
};

/**
 * Listen to real-time updates for packing list
 */
export const listenToPackingList = (tripId, callback) => {
    const itemsRef = collection(db, 'packingLists', tripId, 'items');
    const q = query(itemsRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        callback(items);
    }, (error) => {
        console.error('Error listening to packing list:', error);
        callback([]);
    });
};

// Predefined categories for packing items
export const PACKING_CATEGORIES = [
    { id: 'clothes', name: 'Clothes', icon: '👕' },
    { id: 'toiletries', name: 'Toiletries', icon: '🧴' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'medicine', name: 'Medicine', icon: '💊' },
    { id: 'food', name: 'Food & Snacks', icon: '🍪' },
    { id: 'accessories', name: 'Accessories', icon: '🎒' },
    { id: 'general', name: 'General', icon: '📦' }
];
