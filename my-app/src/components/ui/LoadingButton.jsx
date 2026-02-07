import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingButton.css';

/**
 * LoadingButton - A reusable button component with loading state
 * 
 * @param {boolean} isLoading - Shows loading spinner when true
 * @param {boolean} disabled - Disables button interaction
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} type - Button type (button, submit, reset)
 */
export default function LoadingButton({
    isLoading = false,
    disabled = false,
    className = '',
    children,
    onClick,
    type = 'button',
    ...props
}) {
    return (
        <button
            type={type}
            className={`loading-btn ${className} ${isLoading ? 'is-loading' : ''} dark:disabled:bg-slate-700 dark:disabled:text-slate-400`}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && (
                <span className="loading-spinner">
                    <Loader2 className="spinner-icon" size={18} />
                </span>
            )}
            <span className={`btn-content ${isLoading ? 'loading' : ''}`}>
                {children}
            </span>
        </button>
    );
}
