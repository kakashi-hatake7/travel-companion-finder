import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, X, ArrowRight, Receipt } from 'lucide-react';
import {
    addExpense,
    deleteExpense,
    listenToExpenses,
    calculateBalance,
    EXPENSE_CATEGORIES
} from '../../services/expenseService';
import './ExpenseSplitter.css';

const ExpenseSplitter = ({ tripId, currentUser, companionId, companionName, addToast, onClose }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newExpense, setNewExpense] = useState({
        description: '',
        amount: '',
        category: 'general'
    });

    // Listen to real-time updates
    useEffect(() => {
        if (!tripId) return;

        const unsubscribe = listenToExpenses(tripId, (updatedExpenses) => {
            setExpenses(updatedExpenses);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tripId]);

    const balance = calculateBalance(expenses, currentUser.uid, companionId);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!newExpense.description.trim() || !newExpense.amount) return;

        try {
            await addExpense(
                tripId,
                newExpense,
                currentUser.uid,
                currentUser.displayName || 'You'
            );
            setNewExpense({ description: '', amount: '', category: 'general' });
            setShowAddForm(false);
            addToast('💰 Expense added!', 'success');
        } catch (error) {
            addToast('Failed to add expense', 'error');
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(tripId, expenseId);
            addToast('Expense removed', 'info');
        } catch (error) {
            addToast('Failed to delete expense', 'error');
        }
    };

    const getCategoryInfo = (categoryId) => {
        return EXPENSE_CATEGORIES.find(c => c.id === categoryId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="expense-splitter-container dark:bg-slate-900">
            <div className="expense-header">
                <div className="expense-title dark:text-slate-100">
                    <Wallet size={24} />
                    <h2>Expense Splitter</h2>
                </div>
                <button className="expense-close-btn dark:text-slate-400 dark:hover:text-slate-200" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Balance Summary */}
            <div className="balance-summary">
                <div className="balance-card dark:bg-slate-800 dark:border-slate-700">
                    <div className="balance-users">
                        <div className="balance-user you">
                            <span className="user-avatar">{currentUser.displayName?.charAt(0) || 'Y'}</span>
                            <span className="user-name dark:text-slate-100">You</span>
                            <span className="user-paid dark:text-slate-400">{formatCurrency(balance.userPaid)}</span>
                        </div>
                        <div className="balance-arrow dark:text-slate-500">
                            <ArrowRight size={20} />
                        </div>
                        <div className="balance-user companion">
                            <span className="user-avatar">{companionName?.charAt(0) || 'C'}</span>
                            <span className="user-name dark:text-slate-100">{companionName || 'Companion'}</span>
                            <span className="user-paid dark:text-slate-400">{formatCurrency(balance.companionPaid)}</span>
                        </div>
                    </div>

                    <div className="balance-result">
                        {balance.userBalance > 0 ? (
                            <div className="balance-owed positive dark:bg-green-900/20">
                                <span className="owed-label dark:text-green-300">{companionName || 'Companion'} owes you</span>
                                <span className="owed-amount dark:text-green-400">{formatCurrency(balance.userBalance)}</span>
                            </div>
                        ) : balance.userBalance < 0 ? (
                            <div className="balance-owed negative dark:bg-red-900/20">
                                <span className="owed-label dark:text-red-300">You owe {companionName || 'Companion'}</span>
                                <span className="owed-amount dark:text-red-400">{formatCurrency(Math.abs(balance.userBalance))}</span>
                            </div>
                        ) : (
                            <div className="balance-owed settled dark:bg-slate-700">
                                <span className="owed-label dark:text-slate-300">All settled up! 🎉</span>
                            </div>
                        )}
                    </div>

                    <div className="total-expenses">
                        <span className="dark:text-slate-300">Total Trip Expenses</span>
                        <span className="total-amount dark:text-slate-100">{formatCurrency(balance.totalExpenses)}</span>
                    </div>
                </div>
            </div>

            {/* Add Expense Button / Form */}
            {!showAddForm ? (
                <button className="add-expense-btn dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} />
                    Add Expense
                </button>
            ) : (
                <form className="add-expense-form dark:bg-slate-800" onSubmit={handleAddExpense}>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="What did you pay for?"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            className="expense-input dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                            autoFocus
                        />
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol dark:text-slate-300">₹</span>
                            <input
                                type="number"
                                placeholder="0"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="amount-input dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="category-row">
                        {EXPENSE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`expense-category-chip dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 ${newExpense.category === cat.id ? 'active dark:bg-blue-600 dark:text-white' : ''}`}
                                onClick={() => setNewExpense({ ...newExpense, category: cat.id })}
                            >
                                <span>{cat.icon}</span>
                            </button>
                        ))}
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-expense-btn dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" disabled={!newExpense.description || !newExpense.amount}>
                            Add Expense
                        </button>
                    </div>
                </form>
            )}

            {/* Expenses List */}
            <div className="expenses-list">
                <h3 className="expenses-list-title dark:text-slate-200">
                    <Receipt size={16} />
                    Recent Expenses
                </h3>

                {loading ? (
                    <div className="expenses-loading dark:text-slate-400">
                        <div className="loading-spinner"></div>
                        <p>Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="expenses-empty dark:text-slate-400">
                        <Wallet size={48} />
                        <h3>No expenses yet</h3>
                        <p>Start logging shared expenses for your trip!</p>
                    </div>
                ) : (
                    expenses.map(expense => {
                        const catInfo = getCategoryInfo(expense.category);
                        const isYours = expense.paidBy === currentUser.uid;
                        return (
                            <div key={expense.id} className={`expense-item ${isYours ? 'yours' : 'theirs'}`}>
                                <div className="expense-icon">
                                    <span>{catInfo.icon}</span>
                                </div>
                                <div className="expense-info">
                                    <span className="expense-description">{expense.description}</span>
                                    <span className="expense-payer">
                                        Paid by {isYours ? 'You' : expense.paidByName || companionName}
                                    </span>
                                </div>
                                <div className="expense-amount">
                                    {formatCurrency(expense.amount)}
                                </div>
                                {isYours && (
                                    <button
                                        className="delete-expense-btn"
                                        onClick={() => handleDeleteExpense(expense.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ExpenseSplitter;
