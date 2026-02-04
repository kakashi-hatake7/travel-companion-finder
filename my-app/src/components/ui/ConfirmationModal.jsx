import React, { useEffect } from 'react';
import { CheckCircle, Sparkles, Users, Loader } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, title, message, matchCount = 0 }) => {
    useEffect(() => {
        if (isOpen) {
            // Auto close after 4 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                <div className="confirmation-modal-content">
                    {/* Animated Success Icon */}
                    <div className="success-icon-wrapper">
                        <div className="success-icon-circle">
                            <CheckCircle className="success-icon" size={64} />
                        </div>
                        <div className="sparkles-wrapper">
                            <Sparkles className="sparkle sparkle-1" size={20} />
                            <Sparkles className="sparkle sparkle-2" size={16} />
                            <Sparkles className="sparkle sparkle-3" size={18} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="confirmation-title">{title}</h2>

                    {/* Message */}
                    <p className="confirmation-message">{message}</p>

                    {/* Searching Animation */}
                    <div className="searching-section">
                        <div className="searching-icon-wrapper">
                            <Users className="searching-icon" size={24} />
                            <Loader className="searching-spinner" size={20} />
                        </div>
                        <p className="searching-text">
                            {matchCount > 0
                                ? `Found ${matchCount} potential companion${matchCount > 1 ? 's' : ''}!`
                                : 'Searching for your travel companion...'
                            }
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container">
                        <div className="progress-bar"></div>
                    </div>

                    {/* Close Button */}
                    <button className="confirmation-close-btn" onClick={onClose}>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
