import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Calendar, Navigation, Edit, Trash2, AlertCircle, Sparkles, Users, CheckCircle, ChevronDown, ChevronUp, UserCheck, X } from 'lucide-react';
import { deleteTrip } from '../services/tripService';
import { getMatchesForUser, getMatchDetailsForTrip, confirmMatch, rejectMatch } from '../services/matchingService';

export default function MyTrip({ currentUser, trips, onEdit, onBack, addToast }) {
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'
    const [activeTrips, setActiveTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [expandedTrip, setExpandedTrip] = useState(null);
    const [companions, setCompanions] = useState({});
    const [loadingCompanions, setLoadingCompanions] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [matchCounts, setMatchCounts] = useState({});

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

            // Sort active by date ascending (soonest first)
            setActiveTrips(active.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)));
            // Sort past by date descending (most recent first)
            setPastTrips(past.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)));

            // Fetch match counts for active trips
            active.forEach(trip => fetchMatchCount(trip.id));
        } else {
            setActiveTrips([]);
            setPastTrips([]);
            setMatchCounts({});
        }
    }, [currentUser, trips]);

    const fetchMatchCount = async (tripId) => {
        try {
            if (currentUser) {
                const result = await getMatchesForUser(currentUser.uid);
                if (result.success) {
                    const tripMatches = result.matches.filter(
                        match => (match.trip1Id === tripId || match.trip2Id === tripId) && match.status !== 'rejected'
                    );
                    setMatchCounts(prev => ({ ...prev, [tripId]: tripMatches.length }));
                }
            }
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const fetchCompanions = async (tripId) => {
        if (loadingCompanions[tripId]) return;

        setLoadingCompanions(prev => ({ ...prev, [tripId]: true }));
        try {
            const result = await getMatchDetailsForTrip(tripId, currentUser.uid);
            if (result.success) {
                setCompanions(prev => ({ ...prev, [tripId]: result.companions }));
            }
        } catch (error) {
            console.error('Error fetching companions:', error);
            addToast?.('Failed to load companions', 'error');
        } finally {
            setLoadingCompanions(prev => ({ ...prev, [tripId]: false }));
        }
    };

    const toggleExpand = (tripId) => {
        if (expandedTrip === tripId) {
            setExpandedTrip(null);
        } else {
            setExpandedTrip(tripId);
            if (!companions[tripId]) {
                fetchCompanions(tripId);
            }
        }
    };

    const handleSelectCompanion = async (matchId, tripId, companionName) => {
        try {
            const result = await confirmMatch(matchId, currentUser.uid);
            if (result.success) {
                addToast?.(`🎉 ${companionName} selected as your companion!`, 'success');
                // Refresh companions
                fetchCompanions(tripId);
                fetchMatchCount(tripId);
            }
        } catch (error) {
            addToast?.('Failed to select companion', 'error');
        }
    };

    const handleRejectCompanion = async (matchId, tripId, companionName) => {
        try {
            const result = await rejectMatch(matchId, currentUser.uid);
            if (result.success) {
                addToast?.(`${companionName} removed from matches`, 'info');
                // Refresh companions
                fetchCompanions(tripId);
                fetchMatchCount(tripId);
            }
        } catch (error) {
            addToast?.('Failed to reject companion', 'error');
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
                addToast?.('Trip cancelled successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            addToast?.('Failed to cancel trip. Please try again.', 'error');
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
            weekday: 'short',
            month: 'short',
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

    // Render companion card
    const renderCompanionCard = (companion, tripId) => {
        const isConfirmed = companion.status === 'confirmed';

        return (
            <div key={companion.matchId} className={`companion-card ${isConfirmed ? 'confirmed' : ''}`}>
                <div className="companion-info">
                    <div className="companion-avatar">
                        <Users size={24} />
                    </div>
                    <div className="companion-details">
                        <span className="companion-name">{companion.companionName}</span>
                        <div className="companion-meta">
                            <span><Clock size={14} /> {formatTime(companion.companionTime)}</span>
                            {isConfirmed && <span><Phone size={14} /> {companion.companionContact}</span>}
                        </div>
                    </div>
                </div>

                {isConfirmed ? (
                    <div className="companion-confirmed-badge">
                        <CheckCircle size={16} />
                        Selected
                    </div>
                ) : (
                    <div className="companion-actions">
                        <button
                            className="select-companion-btn"
                            onClick={() => handleSelectCompanion(companion.matchId, tripId, companion.companionName)}
                        >
                            <UserCheck size={16} />
                            Select
                        </button>
                        <button
                            className="reject-companion-btn"
                            onClick={() => handleRejectCompanion(companion.matchId, tripId, companion.companionName)}
                        >
                            <X size={16} />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render a trip card
    const renderTripCard = (trip, isPast = false) => {
        const matchCount = matchCounts[trip.id] || 0;
        const isExpanded = expandedTrip === trip.id;
        const tripCompanions = companions[trip.id] || [];
        const confirmedCompanion = tripCompanions.find(c => c.status === 'confirmed');

        return (
            <div key={trip.id} className={`trip-details-card glass-card ${isPast ? 'past-trip-card' : ''}`}>
                {/* Trip Status Badge */}
                {!isPast && (
                    <div className="trip-status-badge-container">
                        {confirmedCompanion ? (
                            <span className="trip-status-badge matched">
                                <CheckCircle size={14} />
                                Traveling with {confirmedCompanion.companionName}
                            </span>
                        ) : matchCount > 0 ? (
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

                {/* View Companions Button - only show if matches exist */}
                {!isPast && matchCount > 0 && !confirmedCompanion && (
                    <button
                        className="view-companions-btn"
                        onClick={() => toggleExpand(trip.id)}
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp size={18} />
                                Hide Companions
                            </>
                        ) : (
                            <>
                                <ChevronDown size={18} />
                                View {matchCount} Companion{matchCount > 1 ? 's' : ''}
                            </>
                        )}
                    </button>
                )}

                {/* Companions List */}
                {isExpanded && (
                    <div className="companions-list">
                        {loadingCompanions[trip.id] ? (
                            <div className="loading-companions">
                                <Sparkles className="spin" size={20} />
                                Loading companions...
                            </div>
                        ) : tripCompanions.length > 0 ? (
                            tripCompanions.map(companion => renderCompanionCard(companion, trip.id))
                        ) : (
                            <p className="no-companions">No eligible companions found.</p>
                        )}
                    </div>
                )}

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
    };

    return (
        <div className="my-trip-view animate-fade-in">
            <div className="section-header">
                <h2>My Trips</h2>
                <p>Manage your travel plans</p>
            </div>

            {/* Tab Navigation */}
            <div className="my-trip-tabs">
                <button
                    className={`trip-tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    <Navigation size={18} />
                    Active Trips
                    {activeTrips.length > 0 && (
                        <span className="tab-badge">{activeTrips.length}</span>
                    )}
                </button>
                <button
                    className={`trip-tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    <CheckCircle size={18} />
                    Past Trips
                    {pastTrips.length > 0 && (
                        <span className="tab-badge secondary">{pastTrips.length}</span>
                    )}
                </button>
            </div>

            {/* Active Trips Tab */}
            {activeTab === 'active' && (
                <div className="trips-container">
                    {activeTrips.length > 0 ? (
                        <div className="trips-list">
                            {activeTrips.map(trip => renderTripCard(trip, false))}
                        </div>
                    ) : (
                        <div className="empty-trip-state glass-card">
                            <div className="empty-state-icon">
                                <Navigation size={64} />
                            </div>
                            <h3>No Active Trips</h3>
                            <p>You haven't registered any upcoming trips.</p>
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
                </div>
            )}

            {/* Past Trips Tab */}
            {activeTab === 'past' && (
                <div className="trips-container">
                    {pastTrips.length > 0 ? (
                        <div className="trips-list">
                            {pastTrips.map(trip => renderTripCard(trip, true))}
                        </div>
                    ) : (
                        <div className="empty-trip-state glass-card">
                            <div className="empty-state-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h3>No Past Trips</h3>
                            <p>Your completed trips will appear here.</p>
                        </div>
                    )}
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
