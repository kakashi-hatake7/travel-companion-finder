import React from 'react';
import { Users, User } from 'lucide-react';
import './GenderPreference.css';

/**
 * GenderPreference - A segmented control for selecting travel companion preference
 * 
 * @param {string} value - Current selection ('any', 'female_only', 'male_only')
 * @param {function} onChange - Callback when selection changes
 * @param {string} error - Optional error message
 * @param {boolean} required - Whether field is required
 */
export default function GenderPreference({
    value = 'any',
    onChange,
    error,
    required = true
}) {
    const options = [
        {
            id: 'any',
            label: 'Anyone',
            icon: <Users size={20} />,
            color: 'green'
        },
        {
            id: 'female_only',
            label: 'Women Only',
            icon: <User size={20} />,
            color: 'rose'
        },
        {
            id: 'male_only',
            label: 'Men Only',
            icon: <User size={20} />,
            color: 'blue'
        }
    ];

    return (
        <div className="gender-preference-wrapper">
            <label className="gender-preference-label">
                Who are you comfortable traveling with?
                {required && <span className="required-asterisk">*</span>}
            </label>

            <div className="gender-preference-options">
                {options.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`gender-option ${value === option.id ? 'selected' : ''} ${option.color}`}
                        onClick={() => onChange(option.id)}
                    >
                        <div className="option-icon">{option.icon}</div>
                        <span className="option-label">{option.label}</span>
                    </button>
                ))}
            </div>

            {error && (
                <div className="gender-preference-error">
                    {error}
                </div>
            )}

            <p className="gender-preference-helper">
                Note: We will try to match you based on this preference, but availability depends on other travelers.
            </p>
        </div>
    );
}
