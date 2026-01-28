import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './ModernTimePicker.css';

export default function ModernTimePicker({ value, onChange, placeholder = "Select time" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const [period, setPeriod] = useState('AM');
    const pickerRef = useRef(null);

    // Parse existing value when component mounts or value changes
    useEffect(() => {
        if (value) {
            const [time, periodPart] = value.split(' ');
            const [h, m] = time.split(':');
            setHours(parseInt(h));
            setMinutes(parseInt(m));
            setPeriod(periodPart || 'AM');
        }
    }, [value]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const updateTime = (newHours, newMinutes, newPeriod) => {
        const formattedHours = String(newHours).padStart(2, '0');
        const formattedMinutes = String(newMinutes).padStart(2, '0');
        const timeString = `${formattedHours}:${formattedMinutes} ${newPeriod}`;
        onChange(timeString);
    };

    const handleHourChange = (newHour) => {
        setHours(newHour);
        updateTime(newHour, minutes, period);
    };

    const handleMinuteChange = (newMinute) => {
        setMinutes(newMinute);
        updateTime(hours, newMinute, period);
    };

    const handlePeriodToggle = () => {
        const newPeriod = period === 'AM' ? 'PM' : 'AM';
        setPeriod(newPeriod);
        updateTime(hours, minutes, newPeriod);
    };

    const formatDisplayTime = () => {
        if (!value) return placeholder;
        return value;
    };

    // Generate hour options (1-12)
    const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    // Generate minute options (0, 15, 30, 45)
    const minuteOptions = [0, 15, 30, 45];

    return (
        <div className="modern-time-picker" ref={pickerRef}>
            <div
                className={`time-input-display ${isOpen ? 'active' : ''} ${value ? 'filled' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Clock size={18} className="time-icon" />
                <span className="time-value">{formatDisplayTime()}</span>
            </div>

            {isOpen && (
                <div className="time-picker-dropdown">
                    <div className="time-picker-header">
                        <Clock size={20} />
                        <span>Select Time</span>
                    </div>

                    <div className="time-picker-body">
                        {/* Clock Visual Display */}
                        <div className="clock-display">
                            <div className="clock-face">
                                <div className="clock-center"></div>
                                <div
                                    className="clock-hand hour-hand"
                                    style={{
                                        transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`
                                    }}
                                ></div>
                                <div
                                    className="clock-hand minute-hand"
                                    style={{
                                        transform: `rotate(${minutes * 6}deg)`
                                    }}
                                ></div>

                                {/* Clock numbers */}
                                {[12, 3, 6, 9].map((num) => (
                                    <div
                                        key={num}
                                        className={`clock-number clock-number-${num}`}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>

                            <div className="selected-time-display">
                                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')} {period}
                            </div>
                        </div>

                        {/* Quick Time Presets */}
                        <div className="time-presets">
                            <button
                                className="preset-btn"
                                onClick={() => {
                                    handleHourChange(6);
                                    handleMinuteChange(0);
                                    setPeriod('AM');
                                    updateTime(6, 0, 'AM');
                                }}
                            >
                                🌅 Morning (6 AM)
                            </button>
                            <button
                                className="preset-btn"
                                onClick={() => {
                                    handleHourChange(2);
                                    handleMinuteChange(0);
                                    setPeriod('PM');
                                    updateTime(2, 0, 'PM');
                                }}
                            >
                                ☀️ Afternoon (2 PM)
                            </button>
                            <button
                                className="preset-btn"
                                onClick={() => {
                                    handleHourChange(6);
                                    handleMinuteChange(0);
                                    setPeriod('PM');
                                    updateTime(6, 0, 'PM');
                                }}
                            >
                                🌆 Evening (6 PM)
                            </button>
                            <button
                                className="preset-btn"
                                onClick={() => {
                                    handleHourChange(10);
                                    handleMinuteChange(0);
                                    setPeriod('PM');
                                    updateTime(10, 0, 'PM');
                                }}
                            >
                                🌙 Night (10 PM)
                            </button>
                        </div>

                        {/* Time Selectors */}
                        <div className="time-selectors">
                            <div className="time-selector-group">
                                <label>Hour</label>
                                <div className="time-options">
                                    {hourOptions.map((hour) => (
                                        <button
                                            key={hour}
                                            className={`time-option ${hours === hour ? 'selected' : ''}`}
                                            onClick={() => handleHourChange(hour)}
                                        >
                                            {hour}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="time-selector-group">
                                <label>Minute</label>
                                <div className="time-options">
                                    {minuteOptions.map((minute) => (
                                        <button
                                            key={minute}
                                            className={`time-option ${minutes === minute ? 'selected' : ''}`}
                                            onClick={() => handleMinuteChange(minute)}
                                        >
                                            {String(minute).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="time-selector-group">
                                <label>Period</label>
                                <div className="period-toggle-container">
                                    <div
                                        className="period-toggle-switch"
                                        onClick={handlePeriodToggle}
                                    >
                                        <div className={`toggle-slider ${period === 'PM' ? 'pm' : 'am'}`}></div>
                                        <span className={`toggle-option ${period === 'AM' ? 'active' : ''}`}>AM</span>
                                        <span className={`toggle-option ${period === 'PM' ? 'active' : ''}`}>PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="time-picker-footer">
                        <button
                            className="time-done-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
