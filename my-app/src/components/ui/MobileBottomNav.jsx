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
        <nav className="mobile-bottom-nav">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                    <button
                        key={item.id}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => item.isMenu ? onMenuToggle() : onNavigate(item.id)}
                        aria-label={item.label}
                    >
                        <div className="nav-icon-wrapper">
                            <Icon size={24} className="nav-icon" />
                            {isActive && <div className="active-indicator" />}
                        </div>
                        <span className="nav-label">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
