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
        <div className="expense-splitter-container">
            <div className="expense-header">
                <div className="expense-title">
                    <Wallet size={24} />
                    <h2>Expense Splitter</h2>
                </div>
                <button className="expense-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Balance Summary */}
            <div className="balance-summary">
                <div className="balance-card">
                    <div className="balance-users">
                        <div className="balance-user you">
                            <span className="user-avatar">{currentUser.displayName?.charAt(0) || 'Y'}</span>
                            <span className="user-name">You</span>
                            <span className="user-paid">{formatCurrency(balance.userPaid)}</span>
                        </div>
                        <div className="balance-arrow">
                            <ArrowRight size={20} />
                        </div>
                        <div className="balance-user companion">
                            <span className="user-avatar">{companionName?.charAt(0) || 'C'}</span>
                            <span className="user-name">{companionName || 'Companion'}</span>
                            <span className="user-paid">{formatCurrency(balance.companionPaid)}</span>
                        </div>
                    </div>

                    <div className="balance-result">
                        {balance.userBalance > 0 ? (
                            <div className="balance-owed positive">
                                <span className="owed-label">{companionName || 'Companion'} owes you</span>
                                <span className="owed-amount">{formatCurrency(balance.userBalance)}</span>
                            </div>
                        ) : balance.userBalance < 0 ? (
                            <div className="balance-owed negative">
                                <span className="owed-label">You owe {companionName || 'Companion'}</span>
                                <span className="owed-amount">{formatCurrency(Math.abs(balance.userBalance))}</span>
                            </div>
                        ) : (
                            <div className="balance-owed settled">
                                <span className="owed-label">All settled up! 🎉</span>
                            </div>
                        )}
                    </div>

                    <div className="total-expenses">
                        <span>Total Trip Expenses</span>
                        <span className="total-amount">{formatCurrency(balance.totalExpenses)}</span>
                    </div>
                </div>
            </div>

            {/* Add Expense Button / Form */}
            {!showAddForm ? (
                <button className="add-expense-btn" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} />
                    Add Expense
                </button>
            ) : (
                <form className="add-expense-form" onSubmit={handleAddExpense}>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="What did you pay for?"
                            value={newExpense.description}
                            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            className="expense-input"
                            autoFocus
                        />
                        <div className="amount-input-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                                type="number"
                                placeholder="0"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                className="amount-input"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="category-row">
                        {EXPENSE_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`expense-category-chip ${newExpense.category === cat.id ? 'active' : ''}`}
                                onClick={() => setNewExpense({ ...newExpense, category: cat.id })}
                            >
                                <span>{cat.icon}</span>
                            </button>
                        ))}
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-expense-btn" disabled={!newExpense.description || !newExpense.amount}>
                            Add Expense
                        </button>
                    </div>
                </form>
            )}

            {/* Expenses List */}
            <div className="expenses-list">
                <h3 className="expenses-list-title">
                    <Receipt size={16} />
                    Recent Expenses
                </h3>

                {loading ? (
                    <div className="expenses-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading expenses...</p>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="expenses-empty">
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
