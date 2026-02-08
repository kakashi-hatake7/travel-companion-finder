import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './SuccessNotification.css';

const SuccessNotification = ({ isOpen, onClose, destination, matchCount = 0 }) => {
    useEffect(() => {
        if (isOpen) {
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="success-notification-overlay" onClick={onClose}>
            <div className="success-notification" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="notification-close" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>

                {/* Success Icon */}
                <div className="notification-icon">
                    <CheckCircle size={24} />
                </div>

                {/* Content */}
                <div className="notification-content">
                    <h3 className="notification-title">Trip Registered</h3>
                    <p className="notification-message">
                        Your journey to <strong>{destination}</strong> has been registered successfully.
                    </p>
                    {matchCount > 0 && (
                        <p className="notification-matches">
                            {matchCount} potential companion{matchCount > 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="notification-progress">
                    <div className="notification-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default SuccessNotification;
