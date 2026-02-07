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
        <div className={`empty-state-container glass-card dark:bg-slate-800 dark:border dark:border-slate-700 ${className}`}>
            <div className="empty-state-icon-wrapper dark:bg-slate-700/50">
                {icon}
            </div>

            <div className="empty-state-content">
                <h3 className="empty-state-title dark:text-slate-100">{title}</h3>
                <p className="empty-state-description dark:text-slate-300">{description}</p>
            </div>

            {actionText && onAction && (
                <button className="empty-state-action-btn dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white" onClick={onAction}>
                    {actionText}
                </button>
            )}
        </div>
    );
}
