import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Queue an email using the Firebase "Trigger Email" extension.
 * Requires the extension to be installed and configured in Firebase.
 */
export const queueEmail = async ({ to, subject, text, html, userId, type, meta }) => {
    if (!to || !subject || (!text && !html)) {
        return { success: false, error: 'Missing email fields' };
    }

    const payload = {
        to,
        message: {
            subject,
            text: text || '',
            html: html || ''
        },
        createdAt: serverTimestamp(),
        userId: userId || null,
        type: type || 'notification',
        meta: meta || {}
    };

    const mailRef = await addDoc(collection(db, 'mail'), payload);
    return { success: true, mailId: mailRef.id };
};
