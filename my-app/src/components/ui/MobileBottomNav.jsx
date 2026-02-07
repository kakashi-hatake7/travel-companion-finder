import React from 'react';
import { Home, Plus, Navigation, Globe, Menu } from 'lucide-react';
import './MobileBottomNav.css';

export default function MobileBottomNav({ activeView, onNavigate, onMenuToggle }) {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'register', icon: Plus, label: 'Register' },
        { id: 'myTrip', icon: Navigation, label: 'My Trips' },
        { id: 'search', icon: Globe, label: 'Globe' },
        { id: 'menu', icon: Menu, label: 'More', isMenu: true }
    ];

    return (
        <nav className="mobile-bottom-nav dark:bg-slate-900 dark:border-t dark:border-slate-800">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                    <button
                        key={item.id}
                        className={`nav-item dark:text-slate-400 ${isActive ? 'active dark:text-blue-400' : 'dark:hover:text-slate-200'}`}
                        onClick={() => item.isMenu ? onMenuToggle() : onNavigate(item.id)}
                        aria-label={item.label}
                    >
                        <div className="nav-icon-wrapper">
                            <Icon size={24} className="nav-icon" />
                            {isActive && <div className="active-indicator dark:bg-blue-400" />}
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
