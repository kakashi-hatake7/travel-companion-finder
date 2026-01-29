// Video Call Service - WebRTC signaling via Firestore
import { db } from '../firebase';
import {
    doc,
    setDoc,
    updateDoc,
    onSnapshot,
    deleteDoc,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';

// Free STUN servers for NAT traversal
const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};

/**
 * Initialize a call (create offer)
 */
export const initiateCall = async (tripId, userId, userName) => {
    try {
        const callRef = doc(db, 'videoCalls', tripId);
        await setDoc(callRef, {
            status: 'calling',
            callerId: userId,
            callerName: userName,
            offer: null,
            answer: null,
            callerCandidates: [],
            calleeCandidates: [],
            startedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error initiating call:', error);
        throw error;
    }
};

/**
 * Save offer to Firestore
 */
export const saveOffer = async (tripId, offer) => {
    try {
        const callRef = doc(db, 'videoCalls', tripId);
        await updateDoc(callRef, {
            offer: {
                type: offer.type,
                sdp: offer.sdp
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving offer:', error);
        throw error;
    }
};

/**
 * Save answer to Firestore
 */
export const saveAnswer = async (tripId, answer) => {
    try {
        const callRef = doc(db, 'videoCalls', tripId);
        await updateDoc(callRef, {
            status: 'connected',
            answer: {
                type: answer.type,
                sdp: answer.sdp
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving answer:', error);
        throw error;
    }
};

/**
 * Add ICE candidate
 */
export const addIceCandidate = async (tripId, candidate, isCaller) => {
    try {
        const callRef = doc(db, 'videoCalls', tripId);
        const field = isCaller ? 'callerCandidates' : 'calleeCandidates';
        await updateDoc(callRef, {
            [field]: arrayUnion({
                candidate: candidate.candidate,
                sdpMid: candidate.sdpMid,
                sdpMLineIndex: candidate.sdpMLineIndex
            })
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
        throw error;
    }
};

/**
 * End call
 */
export const endCall = async (tripId) => {
    try {
        const callRef = doc(db, 'videoCalls', tripId);
        await deleteDoc(callRef);
        return { success: true };
    } catch (error) {
        console.error('Error ending call:', error);
        throw error;
    }
};

/**
 * Listen to call state changes
 */
export const listenToCall = (tripId, callback) => {
    const callRef = doc(db, 'videoCalls', tripId);

    return onSnapshot(callRef, (doc) => {
        if (doc.exists()) {
            callback({ exists: true, ...doc.data() });
        } else {
            callback({ exists: false });
        }
    }, (error) => {
        console.error('Error listening to call:', error);
        callback({ exists: false, error });
    });
};

export { ICE_SERVERS };
