import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Phone, Users, User, Navigation, Calendar, Sparkles, ArrowRight, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import LoadingButton from './ui/LoadingButton';
import FormInput from './ui/FormInput';
import './BentoRegistrationForm.css';

export default function BentoRegistrationForm({
    formData,
    setFormData,
    handleSubmit,
    isSubmitting,
    editingTripId,
    formErrors,
    touchedFields,
    handleFieldChange,
    handleFieldBlur,
    savedContact,
    handleContactAutofill,
    recentSearches,
    popularDestinations,
    destinations,
    startPoints,
    handleQuickDestination,
    handleQuickDate,
    handleTimePreset,
    timePresets
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isDropdownOpen]);

    return (
        <div className="bento-registration-container">
            {/* Header */}
            <div className="bento-header">
                <div className="bento-header-content">
                    <div className="bento-badge">
                        <Sparkles size={14} />
                        <span>Smart Travel Matching</span>
                    </div>
                    <h1 className="bento-title">
                        {editingTripId ? 'Edit Your Journey' : 'Plan Your Journey'}
                    </h1>
                    <p className="bento-subtitle">
                        {editingTripId ? 'Update your travel details' : 'Share your travel plans and connect with companions'}
                    </p>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="bento-grid">
                {/* Card 1: Location (Large - Spans 2 columns) */}
                <div className="bento-card bento-card-location">
                    <div className="bento-card-header">
                        <div className="bento-card-icon location-icon">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="bento-card-title">Location</h3>
                            <p className="bento-card-desc">Where are you traveling?</p>
                        </div>
                    </div>

                    <div className="bento-card-body">
                        {/* Destination */}
                        <div className="bento-input-group">
                            <label className="bento-label">Destination</label>

                            {/* Quick Chips */}
                            {recentSearches.length > 0 && (
                                <div className="bento-chips">
                                    <span className="chip-label">Recent</span>
                                    <div className="chip-group">
                                        {recentSearches.slice(0, 3).map(dest => (
                                            <button
                                                key={dest}
                                                type="button"
                                                className={`bento-chip ${formData.destination === dest ? 'active' : ''}`}
                                                onClick={() => handleQuickDestination(dest)}
                                            >
                                                {dest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bento-chips">
                                <span className="chip-label">Popular</span>
                                <div className="chip-group">
                                    {popularDestinations.slice(0, 4).map(dest => (
                                        <button
                                            key={dest}
                                            type="button"
                                            className={`bento-chip ${formData.destination === dest ? 'active' : ''}`}
                                            onClick={() => handleQuickDestination(dest)}
                                        >
                                            {dest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bento-search-wrapper" ref={dropdownRef}>
                                <Navigation size={18} className="bento-input-icon" />
                                <input
                                    type="text"
                                    className="bento-input"
                                    placeholder="Search destination..."
                                    value={searchTerm || formData.destination}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setFormData({ ...formData, destination: e.target.value });
                                        setIsDropdownOpen(true);
                                    }}
                                />
                                {isDropdownOpen && (() => {
                                    const filteredDests = destinations
                                        .filter(d => d.toLowerCase().includes((searchTerm || '').toLowerCase()))
                                        .slice(0, 6);

                                    return (
                                        <div className="bento-dropdown">
                                            {filteredDests.length > 0 ? (
                                                filteredDests.map(dest => (
                                                    <div
                                                        key={dest}
                                                        className="bento-dropdown-item"
                                                        onClick={() => {
                                                            setFormData({ ...formData, destination: dest });
                                                            setSearchTerm(dest);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        <MapPin size={14} />
                                                        {dest}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bento-dropdown-item bento-dropdown-empty">
                                                    <MapPin size={14} />
                                                    No destinations found
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Starting Point */}
                        <div className="bento-input-group">
                            <label className="bento-label">Starting From</label>
                            <div className="bento-select-wrapper">
                                <select
                                    className="bento-select"
                                    value={formData.startPoint}
                                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                                >
                                    <option value="">Select starting point</option>
                                    {startPoints.map(point => (
                                        <option key={point} value={point}>{point}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Schedule */}
                <div className="bento-card bento-card-schedule">
                    <div className="bento-card-header">
                        <div className="bento-card-icon schedule-icon">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="bento-card-title">Schedule</h3>
                            <p className="bento-card-desc">When are you leaving?</p>
                        </div>
                    </div>

                    <div className="bento-card-body">
                        {/* Date */}
                        <div className="bento-input-group">
                            <label className="bento-label">Travel Date</label>
                            <div className="bento-quick-btns">
                                <button type="button" className="bento-quick-btn" onClick={() => handleQuickDate('today')}>
                                    Today
                                </button>
                                <button type="button" className="bento-quick-btn" onClick={() => handleQuickDate('tomorrow')}>
                                    Tomorrow
                                </button>
                                <button type="button" className="bento-quick-btn" onClick={() => handleQuickDate('weekend')}>
                                    Weekend
                                </button>
                            </div>
                            <div className="bento-date-wrapper">
                                <Calendar size={18} className="bento-input-icon" />
                                <input
                                    type="date"
                                    className="bento-input"
                                    value={formData.date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="bento-input-group">
                            <label className="bento-label">Departure Time</label>
                            <div className="bento-time-presets">
                                {timePresets.map(preset => (
                                    <button
                                        key={preset.time}
                                        type="button"
                                        className={`bento-time-btn ${formData.time === preset.time ? 'active' : ''}`}
                                        onClick={() => handleTimePreset(preset.time)}
                                    >
                                        <span className="time-emoji">{preset.icon}</span>
                                        <span className="time-text">{preset.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="bento-time-wrapper">
                                <Clock size={18} className="bento-input-icon" />
                                <input
                                    type="time"
                                    className="bento-input"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Contact */}
                <div className="bento-card bento-card-contact">
                    <div className="bento-card-header">
                        <div className="bento-card-icon contact-icon">
                            <Phone size={20} />
                        </div>
                        <div>
                            <h3 className="bento-card-title">Contact</h3>
                            <p className="bento-card-desc">How can we reach you?</p>
                        </div>
                    </div>

                    <div className="bento-card-body">
                        <div className="bento-input-group">
                            <label className="bento-label">Mobile Number</label>
                            <div className="bento-phone-wrapper">
                                <Phone size={18} className="bento-input-icon" />
                                <input
                                    type="tel"
                                    className="bento-input"
                                    placeholder="10-digit mobile number"
                                    value={formData.contact}
                                    onChange={(e) => handleFieldChange('contact', e.target.value)}
                                    onBlur={() => handleFieldBlur('contact')}
                                    maxLength={10}
                                />
                            </div>
                            {touchedFields.contact && formErrors.contact && (
                                <span className="bento-error">{formErrors.contact}</span>
                            )}
                            {savedContact && !formData.contact && (
                                <button type="button" className="bento-autofill-btn" onClick={handleContactAutofill}>
                                    <Phone size={14} />
                                    Use saved: {savedContact}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 4: Preferences */}
                <div className="bento-card bento-card-preferences">
                    <div className="bento-card-header">
                        <div className="bento-card-icon preferences-icon">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="bento-card-title">Preferences</h3>
                            <p className="bento-card-desc">Customize your experience</p>
                        </div>
                    </div>

                    <div className="bento-card-body">
                        {/* Group Mode Toggle */}
                        <div className="bento-preference-row">
                            <div className="bento-preference-info">
                                <Users size={18} />
                                <div>
                                    <div className="bento-preference-title">Group Mode</div>
                                    <div className="bento-preference-desc">Allow others to join</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`bento-toggle ${formData.isGroupTrip ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, isGroupTrip: !formData.isGroupTrip })}
                            >
                                <span className="bento-toggle-slider"></span>
                            </button>
                        </div>

                        {/* Seats Selector */}
                        {formData.isGroupTrip && (
                            <div className="bento-seats-row">
                                <label className="bento-label">Total Seats</label>
                                <div className="bento-seats-selector">
                                    <button
                                        type="button"
                                        className="bento-seats-btn"
                                        onClick={() => setFormData({ ...formData, totalSeats: Math.max(2, formData.totalSeats - 1) })}
                                        disabled={formData.totalSeats <= 2}
                                    >
                                        −
                                    </button>
                                    <span className="bento-seats-value">{formData.totalSeats}</span>
                                    <button
                                        type="button"
                                        className="bento-seats-btn"
                                        onClick={() => setFormData({ ...formData, totalSeats: Math.min(4, formData.totalSeats + 1) })}
                                        disabled={formData.totalSeats >= 4}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Gender Preference */}
                        <div className="bento-gender-group">
                            <label className="bento-label">Comfortable traveling with</label>
                            <div className="bento-gender-pills">
                                <button
                                    type="button"
                                    className={`bento-gender-pill ${formData.genderPreference === 'any' ? 'active' : ''}`}
                                    onClick={() => handleFieldChange('genderPreference', 'any')}
                                >
                                    <Users size={16} />
                                    Anyone
                                </button>
                                <button
                                    type="button"
                                    className={`bento-gender-pill ${formData.genderPreference === 'female_only' ? 'active' : ''}`}
                                    onClick={() => handleFieldChange('genderPreference', 'female_only')}
                                >
                                    <User size={16} />
                                    Women Only
                                </button>
                                <button
                                    type="button"
                                    className={`bento-gender-pill ${formData.genderPreference === 'male_only' ? 'active' : ''}`}
                                    onClick={() => handleFieldChange('genderPreference', 'male_only')}
                                >
                                    <User size={16} />
                                    Men Only
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button - Floating */}
            <div className="bento-submit-wrapper">
                <LoadingButton
                    className="bento-submit-btn"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                >
                    <Sparkles size={18} />
                    {editingTripId ? 'Update Journey' : 'Register Journey'}
                    <ArrowRight size={18} />
                </LoadingButton>
            </div>
        </div>
    );
}
