import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Check, User, X } from 'lucide-react';
import {
    addPackingItem,
    claimPackingItem,
    unclaimPackingItem,
    deletePackingItem,
    listenToPackingList,
    PACKING_CATEGORIES
} from '../../services/packingService';
import './PackingList.css';

const PackingList = ({ tripId, currentUser, companionName, addToast, onClose }) => {
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, mine, unclaimed

    // Listen to real-time updates
    useEffect(() => {
        if (!tripId) return;

        const unsubscribe = listenToPackingList(tripId, (updatedItems) => {
            setItems(updatedItems);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tripId]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        try {
            await addPackingItem(
                tripId,
                { name: newItemName.trim(), category: selectedCategory },
                currentUser.uid,
                currentUser.displayName || 'You'
            );
            setNewItemName('');
            addToast('📦 Item added to packing list!', 'success');
        } catch (error) {
            addToast('Failed to add item', 'error');
        }
    };

    const handleClaimItem = async (item) => {
        try {
            if (item.claimedBy === currentUser.uid) {
                // Unclaim
                await unclaimPackingItem(tripId, item.id);
                addToast('Item unclaimed', 'info');
            } else if (!item.claimedBy) {
                // Claim
                await claimPackingItem(tripId, item.id, currentUser.uid, currentUser.displayName || 'You');
                addToast('✅ You\'re bringing this!', 'success');
            }
        } catch (error) {
            addToast('Failed to update item', 'error');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deletePackingItem(tripId, itemId);
            addToast('Item removed', 'info');
        } catch (error) {
            addToast('Failed to delete item', 'error');
        }
    };

    const getCategoryInfo = (categoryId) => {
        return PACKING_CATEGORIES.find(c => c.id === categoryId) || PACKING_CATEGORIES[PACKING_CATEGORIES.length - 1];
    };

    const filteredItems = items.filter(item => {
        if (filter === 'mine') return item.claimedBy === currentUser.uid;
        if (filter === 'unclaimed') return !item.claimedBy;
        return true;
    });

    // Group items by category
    const groupedItems = filteredItems.reduce((acc, item) => {
        const category = item.category || 'general';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    const stats = {
        total: items.length,
        claimed: items.filter(i => i.claimedBy).length,
        mine: items.filter(i => i.claimedBy === currentUser.uid).length
    };

    return (
        <div className="packing-list-container">
            <div className="packing-list-header">
                <div className="packing-title">
                    <Package size={24} />
                    <h2>Shared Packing List</h2>
                </div>
                <button className="packing-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Stats Bar */}
            <div className="packing-stats">
                <div className="stat-pill">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total</span>
                </div>
                <div className="stat-pill claimed">
                    <span className="stat-number">{stats.claimed}</span>
                    <span className="stat-label">Claimed</span>
                </div>
                <div className="stat-pill mine">
                    <span className="stat-number">{stats.mine}</span>
                    <span className="stat-label">Yours</span>
                </div>
            </div>

            {/* Add Item Form */}
            <form className="add-item-form" onSubmit={handleAddItem}>
                <div className="add-item-row">
                    <input
                        type="text"
                        placeholder="Add item to pack..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="add-item-input"
                    />
                    <button type="submit" className="add-item-btn" disabled={!newItemName.trim()}>
                        <Plus size={18} />
                    </button>
                </div>
                <div className="category-selector">
                    {PACKING_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </form>

            {/* Filter Tabs */}
            <div className="packing-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Items
                </button>
                <button
                    className={`filter-btn ${filter === 'mine' ? 'active' : ''}`}
                    onClick={() => setFilter('mine')}
                >
                    My Items
                </button>
                <button
                    className={`filter-btn ${filter === 'unclaimed' ? 'active' : ''}`}
                    onClick={() => setFilter('unclaimed')}
                >
                    Unclaimed
                </button>
            </div>

            {/* Items List */}
            <div className="packing-items-list">
                {loading ? (
                    <div className="packing-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading packing list...</p>
                    </div>
                ) : Object.keys(groupedItems).length === 0 ? (
                    <div className="packing-empty">
                        <Package size={48} />
                        <h3>No items yet</h3>
                        <p>Start adding items to your shared packing list!</p>
                    </div>
                ) : (
                    Object.entries(groupedItems).map(([categoryId, categoryItems]) => {
                        const catInfo = getCategoryInfo(categoryId);
                        return (
                            <div key={categoryId} className="category-group">
                                <div className="category-header">
                                    <span className="category-icon">{catInfo.icon}</span>
                                    <span className="category-name">{catInfo.name}</span>
                                    <span className="category-count">{categoryItems.length}</span>
                                </div>
                                <div className="category-items">
                                    {categoryItems.map(item => (
                                        <div
                                            key={item.id}
                                            className={`packing-item ${item.claimedBy ? 'claimed' : ''} ${item.claimedBy === currentUser.uid ? 'mine' : ''}`}
                                        >
                                            <button
                                                className="claim-btn"
                                                onClick={() => handleClaimItem(item)}
                                                disabled={item.claimedBy && item.claimedBy !== currentUser.uid}
                                            >
                                                {item.claimedBy === currentUser.uid ? (
                                                    <Check size={16} />
                                                ) : item.claimedBy ? (
                                                    <User size={16} />
                                                ) : (
                                                    <div className="unclaimed-circle" />
                                                )}
                                            </button>
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                {item.claimedBy && (
                                                    <span className="claimed-by">
                                                        {item.claimedBy === currentUser.uid
                                                            ? "You're bringing this"
                                                            : `${item.claimedByName || companionName} is bringing this`}
                                                    </span>
                                                )}
                                            </div>
                                            {item.createdBy === currentUser.uid && (
                                                <button
                                                    className="delete-item-btn"
                                                    onClick={() => handleDeleteItem(item.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PackingList;
