import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './FormInput.css';

/**
 * FormInput - A reusable form input component with validation states
 * 
 * @param {string} label - Label text for the input
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message to display
 * @param {boolean} isValid - Whether the input is valid
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type (text, tel, email, etc.)
 * @param {boolean} required - Whether the field is required
 * @param {number} maxLength - Maximum length for input
 * @param {function} onBlur - Blur handler for validation
 */
export default function FormInput({
    label,
    value,
    onChange,
    error,
    isValid,
    placeholder,
    type = 'text',
    required = false,
    maxLength,
    onBlur,
    className = '',
    ...props
}) {
    const getInputClassName = () => {
        let classes = 'form-input-field dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500';
        if (error) classes += ' input-error dark:border-red-500';
        else if (isValid && value) classes += ' input-valid dark:border-green-500';
        if (className) classes += ` ${className}`;
        return classes;
    };

    return (
        <div className="form-input-wrapper">
            {label && (
                <label className="form-input-label dark:text-slate-300">
                    {label}
                    {required && <span className="required-asterisk">*</span>}
                </label>
            )}
            
            <div className="form-input-container">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={getInputClassName()}
                    {...props}
                />
                
                {/* Validation Icons */}
                {error && (
                    <div className="input-icon error-icon">
                        <AlertCircle size={18} />
                    </div>
                )}
                {isValid && value && !error && (
                    <div className="input-icon valid-icon">
                        <CheckCircle size={18} />
                    </div>
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="form-input-error">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
