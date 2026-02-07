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
            <div className="mobile-menu-backdrop dark:bg-slate-950/80" onClick={onClose} />

            {/* Menu Drawer */}
            <div className="mobile-menu-drawer dark:bg-slate-900 dark:border-r dark:border-slate-800">
                {/* Header */}
                <div className="mobile-menu-header dark:border-b dark:border-slate-800">
                    <h3 className="dark:text-slate-100">Menu</h3>
                    <button className="close-btn dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800" onClick={onClose} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                {/* User Section */}
                {currentUser && (
                    <div className="mobile-menu-user dark:border-b dark:border-slate-800">
                        <div className="user-avatar-large">
                            {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <h4 className="dark:text-slate-100">{currentUser.displayName || 'User'}</h4>
                            <p className="dark:text-slate-400">{currentUser.email}</p>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <div className="mobile-menu-items">
                    <button
                        className="menu-item dark:text-slate-300 dark:hover:bg-slate-800"
                        onClick={() => handleItemClick(() => onNavigate('notifications'))}
                    >
                        <Bell size={20} />
                        <span>Notifications</span>
                        {notificationCount > 0 && (
                            <span className="menu-badge dark:bg-blue-600 dark:text-white">{notificationCount}</span>
                        )}
                    </button>

                    {currentUser ? (
                        <>
                            <button
                                className="menu-item dark:text-slate-300 dark:hover:bg-slate-800"
                                onClick={() => handleItemClick(onShowProfile)}
                            >
                                <User size={20} />
                                <span>View Profile</span>
                            </button>

                            <button
                                className="menu-item danger dark:text-red-400 dark:hover:bg-red-900/20"
                                onClick={() => handleItemClick(onLogout)}
                            >
                                <LogOut size={20} />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <button
                            className="menu-item dark:text-slate-300 dark:hover:bg-slate-800"
                            onClick={() => handleItemClick(onShowAuth)}
                        >
                            <LogIn size={20} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="mobile-menu-footer dark:border-t dark:border-slate-800">
                    <p className="dark:text-slate-500">UniGo - Find your travel companion</p>
                </div>
            </div>
        </>
    );
}
