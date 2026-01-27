import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Calendar, Navigation, Edit, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { deleteTrip } from '../services/tripService';

export default function MyTrip({ currentUser, trips, onEdit, onBack }) {
    const [userTrip, setUserTrip] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Get the user's most recent active trip
    useEffect(() => {
        if (currentUser && trips.length > 0) {
            const myTrips = trips.filter(trip => trip.userId === currentUser.uid);
            if (myTrips.length > 0) {
                // Get the most recent trip
                setUserTrip(myTrips[0]);
            } else {
                setUserTrip(null);
            }
        } else {
            setUserTrip(null);
        }
    }, [currentUser, trips]);

    const handleDeleteTrip = async () => {
        if (!userTrip) return;

        setIsDeleting(true);
        try {
            const result = await deleteTrip(userTrip.id);
            if (result.success) {
                setShowDeleteConfirm(false);
                setUserTrip(null);
                alert('Trip cancelled successfully!');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to cancel trip. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditTrip = () => {
        if (userTrip && onEdit) {
            onEdit(userTrip);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Check if trip is in the past
    const isTripPast = (dateString, timeString) => {
        const tripDateTime = new Date(`${dateString}T${timeString}`);
        return tripDateTime < new Date();
    };

    return (
        <div className="my-trip-view animate-fade-in">
            <div className="section-header">
                <h2>My Trip</h2>
                <p>Your current travel plan</p>
            </div>

            {userTrip ? (
                <div className="trip-details-container">
                    <div className="trip-details-card glass-card">
                        {/* Trip Status Badge */}
                        <div className="trip-status-badge-container">
                            {isTripPast(userTrip.date, userTrip.time) ? (
                                <span className="trip-status-badge past">
                                    <AlertCircle size={14} />
                                    Past Trip
                                </span>
                            ) : (
                                <span className="trip-status-badge active">
                                    <Sparkles size={14} />
                                    Active Trip
                                </span>
                            )}
                        </div>

                        {/* Trip Details */}
                        <div className="trip-details-content">
                            <div className="trip-info-row destination-row">
                                <div className="trip-info-icon destination-icon-bg">
                                    <Navigation size={24} />
                                </div>
                                <div className="trip-info-text">
                                    <span className="trip-info-label">Destination</span>
                                    <span className="trip-info-value destination-value">{userTrip.destination}</span>
                                </div>
                            </div>

                            <div className="trip-info-row">
                                <div className="trip-info-icon start-icon-bg">
                                    <MapPin size={20} />
                                </div>
                                <div className="trip-info-text">
                                    <span className="trip-info-label">Starting Point</span>
                                    <span className="trip-info-value">{userTrip.startPoint}</span>
                                </div>
                            </div>

                            <div className="trip-info-row">
                                <div className="trip-info-icon date-icon-bg">
                                    <Calendar size={20} />
                                </div>
                                <div className="trip-info-text">
                                    <span className="trip-info-label">Travel Date</span>
                                    <span className="trip-info-value">{formatDate(userTrip.date)}</span>
                                </div>
                            </div>

                            <div className="trip-info-row">
                                <div className="trip-info-icon time-icon-bg">
                                    <Clock size={20} />
                                </div>
                                <div className="trip-info-text">
                                    <span className="trip-info-label">Departure Time</span>
                                    <span className="trip-info-value">{formatTime(userTrip.time)}</span>
                                </div>
                            </div>

                            <div className="trip-info-row">
                                <div className="trip-info-icon contact-icon-bg">
                                    <Phone size={20} />
                                </div>
                                <div className="trip-info-text">
                                    <span className="trip-info-label">Contact Number</span>
                                    <span className="trip-info-value">{userTrip.contact}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="trip-actions">
                            <button
                                className="trip-action-btn edit-btn"
                                onClick={handleEditTrip}
                            >
                                <Edit size={18} />
                                Edit Trip
                            </button>
                            <button
                                className="trip-action-btn delete-btn"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 size={18} />
                                Cancel Trip
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="empty-trip-state glass-card">
                    <div className="empty-state-icon">
                        <Navigation size={64} />
                    </div>
                    <h3>No Active Trip</h3>
                    <p>You haven't registered any trips yet.</p>
                    <p className="empty-state-subtext">Start by registering your travel plans to find companions!</p>
                    <button
                        className="btn-primary"
                        onClick={onBack}
                    >
                        <Sparkles size={18} />
                        Register Trip
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <AlertCircle size={48} className="warning-icon" />
                            <h3>Cancel Trip?</h3>
                            <p>Are you sure you want to cancel this trip? This action cannot be undone.</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-modal-btn"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Keep Trip
                            </button>
                            <button
                                className="modal-btn confirm-delete-btn"
                                onClick={handleDeleteTrip}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Cancelling...' : 'Yes, Cancel Trip'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
