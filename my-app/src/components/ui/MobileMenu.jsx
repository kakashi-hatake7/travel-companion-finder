import React from 'react';
import { X, Bell, User, LogOut, LogIn } from 'lucide-react';
import './MobileMenu.css';

export default function MobileMenu({
    isOpen,
    onClose,
    currentUser,
    notificationCount,
    onNavigate,
    onShowProfile,
    onShowAuth,
    onLogout
}) {
    if (!isOpen) return null;

    const handleItemClick = (action) => {
        action();
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div className="mobile-menu-backdrop" onClick={onClose} />

            {/* Menu Drawer */}
            <div className="mobile-menu-drawer">
                {/* Header */}
                <div className="mobile-menu-header">
                    <h3>Menu</h3>
                    <button className="close-btn" onClick={onClose} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                {/* User Section */}
                {currentUser && (
                    <div className="mobile-menu-user">
                        <div className="user-avatar-large">
                            {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <h4>{currentUser.displayName || 'User'}</h4>
                            <p>{currentUser.email}</p>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <div className="mobile-menu-items">
                    <button
                        className="menu-item"
                        onClick={() => handleItemClick(() => onNavigate('notifications'))}
                    >
                        <Bell size={20} />
                        <span>Notifications</span>
                        {notificationCount > 0 && (
                            <span className="menu-badge">{notificationCount}</span>
                        )}
                    </button>

                    {currentUser ? (
                        <>
                            <button
                                className="menu-item"
                                onClick={() => handleItemClick(onShowProfile)}
                            >
                                <User size={20} />
                                <span>View Profile</span>
                            </button>

                            <button
                                className="menu-item danger"
                                onClick={() => handleItemClick(onLogout)}
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <button
                            className="menu-item"
                            onClick={() => handleItemClick(onShowAuth)}
                        >
                            <LogIn size={20} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="mobile-menu-footer">
                    <p>UniGo - Find your travel companion</p>
                </div>
            </div>
        </>
    );
}
