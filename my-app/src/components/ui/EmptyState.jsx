import React from 'react';
import './EmptyState.css';

/**
 * EmptyState - A beautiful, reusable empty state component
 * 
 * @param {ReactNode} icon - Icon component to display
 * @param {string} title - Main title text
 * @param {string} description - Description text
 * @param {string} actionText - Text for the action button
 * @param {function} onAction - Click handler for the action button
 * @param {string} className - Additional CSS classes
 */
export default function EmptyState({
    icon,
    title,
    description,
    actionText,
    onAction,
    className = ''
}) {
    return (
        <div className={`empty-state-container glass-card ${className}`}>
            <div className="empty-state-icon-wrapper">
                {icon}
            </div>

            <div className="empty-state-content">
                <h3 className="empty-state-title">{title}</h3>
                <p className="empty-state-description">{description}</p>
            </div>

            {actionText && onAction && (
                <button className="empty-state-action-btn" onClick={onAction}>
                    {actionText}
                </button>
            )}
        </div>
    );
}
