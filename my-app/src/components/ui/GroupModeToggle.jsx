import React from 'react';
import { Users, Info } from 'lucide-react';
import './GroupModeToggle.css';

/**
 * GroupModeToggle - Toggle for enabling group trip mode with seat selection
 * 
 * @param {boolean} isGroupTrip - Whether group mode is enabled
 * @param {number} totalSeats - Number of total seats (2-4)
 * @param {function} onToggle - Callback when toggle changes
 * @param {function} onSeatsChange - Callback when seats number changes
 */
export default function GroupModeToggle({
    isGroupTrip = false,
    totalSeats = 4,
    onToggle,
    onSeatsChange
}) {
    return (
        <div className="group-mode-wrapper">
            <div className="group-mode-header">
                <label className="group-mode-label">
                    <Users size={18} />
                    Allow others to join? (Group Mode)
                </label>

                <button
                    type="button"
                    className={`toggle-switch ${isGroupTrip ? 'active' : ''}`}
                    onClick={() => onToggle(!isGroupTrip)}
                >
                    <span className="toggle-slider"></span>
                </button>
            </div>

            {isGroupTrip && (
                <div className="seats-selector">
                    <label htmlFor="totalSeats">Total Seats</label>
                    <div className="seats-input-group">
                        <button
                            type="button"
                            className="seats-btn"
                            onClick={() => onSeatsChange(Math.max(2, totalSeats - 1))}
                            disabled={totalSeats <= 2}
                        >
                            −
                        </button>
                        <input
                            id="totalSeats"
                            type="number"
                            min="2"
                            max="4"
                            value={totalSeats}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value >= 2 && value <= 4) {
                                    onSeatsChange(value);
                                }
                            }}
                            className="seats-input"
                        />
                        <button
                            type="button"
                            className="seats-btn"
                            onClick={() => onSeatsChange(Math.min(4, totalSeats + 1))}
                            disabled={totalSeats >= 4}
                        >
                            +
                        </button>
                    </div>
                </div>
            )}

            <div className="group-mode-helper">
                <Info size={14} />
                <span>
                    {isGroupTrip
                        ? `Your trip will have ${totalSeats} seats. Others can join on a first-come, first-served basis.`
                        : 'Enable group mode to allow multiple travelers to join your trip.'
                    }
                </span>
            </div>
        </div>
    );
}
