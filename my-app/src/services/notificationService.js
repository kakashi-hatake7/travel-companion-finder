import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Create a notification for a user
 */
export const createNotification = async (notification) => {
    if (!notification?.userId) {
        throw new Error('Missing userId for notification');
    }

    const payload = {
        userId: notification.userId,
        type: notification.type || 'info',
        title: notification.title || 'Notification',
        message: notification.message || '',
        tripId: notification.tripId || null,
        matchId: notification.matchId || null,
        actorId: notification.actorId || null,
        actorName: notification.actorName || null,
        createdAt: serverTimestamp(),
        read: false,
        meta: notification.meta || {}
    };

    const notifRef = await addDoc(collection(db, 'notifications'), payload);
    return { success: true, notificationId: notifRef.id };
};

/**
 * Listen to real-time notifications for a user
 * callback receives: { notifications, changes }
 */
export const listenToNotifications = (userId, callback) => {
    if (!userId) return () => {};

    const notifRef = collection(db, 'notifications');
    const q = query(
        notifRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        const changes = snapshot.docChanges().map((change) => ({
            type: change.type,
            id: change.doc.id,
            ...change.doc.data()
        }));

        callback({ notifications, changes });
    });

    return unsubscribe;
};

/**
 * Mark a notification as read
 */
export const markNotificationRead = async (notificationId) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
    return { success: true };
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
    const notifRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notifRef);
    return { success: true };
};
