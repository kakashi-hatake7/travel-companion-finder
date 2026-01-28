import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Calendar, Navigation, Edit, Trash2, AlertCircle, Sparkles, Users, CheckCircle } from 'lucide-react';
import { deleteTrip } from '../services/tripService';
import { getMatchesForUser } from '../services/matchingService';

export default function MyTrip({ currentUser, trips, onEdit, onBack }) {
    const [activeTrip, setActiveTrip] = useState(null);
    const [pastTrips, setPastTrips] = useState([]);
    const [matchCount, setMatchCount] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Separate active and past trips
    useEffect(() => {
        if (currentUser && trips.length > 0) {
            const myTrips = trips.filter(trip => trip.userId === currentUser.uid);

            const now = new Date();
            const active = [];
            const past = [];

            myTrips.forEach(trip => {
                const tripDateTime = new Date(`${trip.date}T${trip.time}`);
                if (tripDateTime >= now) {
                    active.push(trip);
                } else {
                    past.push(trip);
                }
            });

            // Get most recent active trip
            if (active.length > 0) {
                setActiveTrip(active[0]);
                // Fetch match count for active trip
                fetchMatchCount(active[0].id);
            } else {
                setActiveTrip(null);
                setMatchCount(0);
            }

            // Set past trips (sorted by date descending)
            setPastTrips(past.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)));
        } else {
            setActiveTrip(null);
            setPastTrips([]);
            setMatchCount(0);
        }
    }, [currentUser, trips]);

    const fetchMatchCount = async (tripId) => {
        try {
            if (currentUser) {
                const result = await getMatchesForUser(currentUser.uid);
                if (result.success) {
                    // Count matches for this specific trip
                    const tripMatches = result.matches.filter(
                        match => match.trip1Id === tripId || match.trip2Id === tripId
                    );
                    setMatchCount(tripMatches.length);
                }
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
            setMatchCount(0);
        }
    };

    const handleDeleteTrip = async () => {
        if (!tripToDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteTrip(tripToDelete);
            if (result.success) {
                setShowDeleteConfirm(false);
                setTripToDelete(null);
                alert('Trip cancelled successfully!');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to cancel trip. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (trip) => {
        setTripToDelete(trip.id);
        setShowDeleteConfirm(true);
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

    // Render a trip card
    const renderTripCard = (trip, isPast = false) => (
        <div key={trip.id} className={`trip-details-card glass-card ${isPast ? 'past-trip-card' : ''}`}>
            {/* Trip Status Badge */}
            {!isPast && (
                <div className="trip-status-badge-container">
                    {matchCount > 0 ? (
                        <span className="trip-status-badge matched">
                            <CheckCircle size={14} />
                            {matchCount} {matchCount === 1 ? 'Match' : 'Matches'} Found
                        </span>
                    ) : (
                        <span className="trip-status-badge searching">
                            <Users size={14} />
                            Finding Companion...
                        </span>
                    )}
                </div>
            )}

            {isPast && (
                <div className="trip-status-badge-container">
                    <span className="trip-status-badge completed">
                        <CheckCircle size={14} />
                        Completed
                    </span>
                </div>
            )}

            {/* Trip Details */}
            <div className="trip-details-content">
                <div className="trip-info-row destination-row">
                    <div className="trip-info-icon destination-icon-bg">
                        <Navigation size={24} />
                    </div>
                    <div className="trip-info-text">
                        <span className="trip-info-label">Destination</span>
                        <span className="trip-info-value destination-value">{trip.destination}</span>
                    </div>
                </div>

                <div className="trip-info-row">
                    <div className="trip-info-icon start-icon-bg">
                        <MapPin size={20} />
                    </div>
                    <div className="trip-info-text">
                        <span className="trip-info-label">Starting Point</span>
                        <span className="trip-info-value">{trip.startPoint}</span>
                    </div>
                </div>

                <div className="trip-info-row">
                    <div className="trip-info-icon date-icon-bg">
                        <Calendar size={20} />
                    </div>
                    <div className="trip-info-text">
                        <span className="trip-info-label">Travel Date</span>
                        <span className="trip-info-value">{formatDate(trip.date)}</span>
                    </div>
                </div>

                <div className="trip-info-row">
                    <div className="trip-info-icon time-icon-bg">
                        <Clock size={20} />
                    </div>
                    <div className="trip-info-text">
                        <span className="trip-info-label">Departure Time</span>
                        <span className="trip-info-value">{formatTime(trip.time)}</span>
                    </div>
                </div>

                <div className="trip-info-row">
                    <div className="trip-info-icon contact-icon-bg">
                        <Phone size={20} />
                    </div>
                    <div className="trip-info-text">
                        <span className="trip-info-label">Contact Number</span>
                        <span className="trip-info-value">{trip.contact}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons - only for active trip */}
            {!isPast && (
                <div className="trip-actions">
                    <button
                        className="trip-action-btn edit-btn"
                        onClick={() => onEdit(trip)}
                    >
                        <Edit size={18} />
                        Edit Trip
                    </button>
                    <button
                        className="trip-action-btn delete-btn"
                        onClick={() => confirmDelete(trip)}
                    >
                        <Trash2 size={18} />
                        Cancel Trip
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="my-trip-view animate-fade-in">
            <div className="section-header">
                <h2>My Trip</h2>
                <p>Your current travel plan</p>
            </div>

            {activeTrip ? (
                <div className="trip-details-container">
                    {renderTripCard(activeTrip, false)}
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

            {/* Old Trips Section */}
            {pastTrips.length > 0 && (
                <div className="old-trips-section">
                    <div className="old-trips-header">
                        <h3>Past Trips</h3>
                        <p>Your travel history</p>
                    </div>
                    <div className="old-trips-list">
                        {pastTrips.map(trip => renderTripCard(trip, true))}
                    </div>
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
