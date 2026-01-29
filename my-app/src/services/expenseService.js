// Expense Splitter Service - Firestore operations for shared expenses
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
 * Add a new expense
 */
export const addExpense = async (tripId, expenseData, userId, userName) => {
    try {
        const expensesRef = collection(db, 'expenses', tripId, 'items');
        const docRef = await addDoc(expensesRef, {
            description: expenseData.description,
            amount: parseFloat(expenseData.amount),
            paidBy: userId,
            paidByName: userName,
            splitType: expenseData.splitType || 'equal',
            category: expenseData.category || 'general',
            createdAt: serverTimestamp()
        });
        return { success: true, expenseId: docRef.id };
    } catch (error) {
        console.error('Error adding expense:', error);
        throw error;
    }
};

/**
 * Update an expense
 */
export const updateExpense = async (tripId, expenseId, updates) => {
    try {
        const expenseRef = doc(db, 'expenses', tripId, 'items', expenseId);
        await updateDoc(expenseRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating expense:', error);
        throw error;
    }
};

/**
 * Delete an expense
 */
export const deleteExpense = async (tripId, expenseId) => {
    try {
        const expenseRef = doc(db, 'expenses', tripId, 'items', expenseId);
        await deleteDoc(expenseRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting expense:', error);
        throw error;
    }
};

/**
 * Listen to real-time updates for expenses
 */
export const listenToExpenses = (tripId, callback) => {
    const expensesRef = collection(db, 'expenses', tripId, 'items');
    const q = query(expensesRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const expenses = [];
        snapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        callback(expenses);
    }, (error) => {
        console.error('Error listening to expenses:', error);
        callback([]);
    });
};

/**
 * Calculate balance between two users
 * Returns positive if user2 owes user1, negative if user1 owes user2
 */
export const calculateBalance = (expenses, userId, companionId) => {
    let userPaid = 0;
    let companionPaid = 0;

    expenses.forEach(expense => {
        const amount = expense.amount / 2; // Equal split
        if (expense.paidBy === userId) {
            userPaid += expense.amount;
        } else if (expense.paidBy === companionId) {
            companionPaid += expense.amount;
        }
    });

    const totalExpenses = userPaid + companionPaid;
    const fairShare = totalExpenses / 2;

    return {
        userPaid,
        companionPaid,
        totalExpenses,
        userBalance: userPaid - fairShare, // Positive means companion owes user
        companionBalance: companionPaid - fairShare
    };
};

// Expense categories
export const EXPENSE_CATEGORIES = [
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'food', name: 'Food & Drinks', icon: '🍽️' },
    { id: 'stay', name: 'Accommodation', icon: '🏨' },
    { id: 'tickets', name: 'Tickets', icon: '🎫' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'general', name: 'General', icon: '💰' }
];
