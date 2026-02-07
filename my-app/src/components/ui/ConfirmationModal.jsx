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
        <div className="confirmation-modal-overlay dark:bg-slate-950/80" onClick={onClose}>
            <div className="confirmation-modal dark:bg-slate-900 dark:border dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                <div className="confirmation-modal-content">
                    {/* Animated Success Icon */}
                    <div className="success-icon-wrapper">
                        <div className="success-icon-circle dark:bg-green-500/20">
                            <CheckCircle className="success-icon dark:text-green-400" size={64} />
                        </div>
                        <div className="sparkles-wrapper">
                            <Sparkles className="sparkle sparkle-1 dark:text-yellow-400" size={20} />
                            <Sparkles className="sparkle sparkle-2 dark:text-yellow-400" size={16} />
                            <Sparkles className="sparkle sparkle-3 dark:text-yellow-400" size={18} />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="confirmation-title dark:text-slate-100">{title}</h2>

                    {/* Message */}
                    <p className="confirmation-message dark:text-slate-300">{message}</p>

                    {/* Searching Animation */}
                    <div className="searching-section dark:bg-slate-800/50 dark:border dark:border-slate-700">
                        <div className="searching-icon-wrapper">
                            <Users className="searching-icon dark:text-slate-400" size={24} />
                            <Loader className="searching-spinner dark:text-slate-400" size={20} />
                        </div>
                        <p className="searching-text dark:text-slate-300">
                            {matchCount > 0
                                ? `Found ${matchCount} potential companion${matchCount > 1 ? 's' : ''}!`
                                : 'Searching for your travel companion...'
                            }
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-container dark:bg-slate-700">
                        <div className="progress-bar dark:bg-blue-500"></div>
                    </div>

                    {/* Close Button */}
                    <button className="confirmation-close-btn dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:border dark:border-slate-700" onClick={onClose}>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
