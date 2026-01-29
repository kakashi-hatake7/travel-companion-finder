import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X, Check, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    addActivity,
    approveActivity,
    deleteActivity,
    listenToItinerary,
    ACTIVITY_TYPES
} from '../../services/itineraryService';
import './ItineraryBuilder.css';

const ItineraryBuilder = ({ tripId, tripDate, currentUser, companionName, addToast, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(1);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: '',
        time: '09:00',
        type: 'activity',
        location: '',
        notes: ''
    });

    // Calculate trip days (default 3 days if no end date)
    const numDays = 3;

    // Listen to real-time updates
    useEffect(() => {
        if (!tripId) return;

        const unsubscribe = listenToItinerary(tripId, (updatedActivities) => {
            setActivities(updatedActivities);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tripId]);

    const handleAddActivity = async (e) => {
        e.preventDefault();
        if (!newActivity.title.trim()) return;

        try {
            await addActivity(
                tripId,
                { ...newActivity, day: selectedDay },
                currentUser.uid,
                currentUser.displayName || 'You'
            );
            setNewActivity({ title: '', time: '09:00', type: 'activity', location: '', notes: '' });
            setShowAddForm(false);
            addToast('📅 Activity added!', 'success');
        } catch (error) {
            addToast('Failed to add activity', 'error');
        }
    };

    const handleApprove = async (activity) => {
        try {
            await approveActivity(tripId, activity.id, currentUser.uid, activity.approvedBy || []);
            addToast('✅ Activity approved!', 'success');
        } catch (error) {
            addToast('Failed to approve activity', 'error');
        }
    };

    const handleDelete = async (activityId) => {
        try {
            await deleteActivity(tripId, activityId);
            addToast('Activity removed', 'info');
        } catch (error) {
            addToast('Failed to delete activity', 'error');
        }
    };

    const getTypeInfo = (typeId) => {
        return ACTIVITY_TYPES.find(t => t.id === typeId) || ACTIVITY_TYPES[4];
    };

    const dayActivities = activities.filter(a => a.day === selectedDay);
    const isApprovedByUser = (activity) => activity.approvedBy?.includes(currentUser.uid);

    return (
        <div className="itinerary-container">
            <div className="itinerary-header">
                <div className="itinerary-title">
                    <Calendar size={24} />
                    <h2>Trip Itinerary</h2>
                </div>
                <button className="itinerary-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Day Selector */}
            <div className="day-selector">
                <button
                    className="day-nav-btn"
                    onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                    disabled={selectedDay === 1}
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="day-tabs">
                    {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
                        <button
                            key={day}
                            className={`day-tab ${selectedDay === day ? 'active' : ''}`}
                            onClick={() => setSelectedDay(day)}
                        >
                            <span className="day-number">Day {day}</span>
                            <span className="day-count">
                                {activities.filter(a => a.day === day).length} activities
                            </span>
                        </button>
                    ))}
                </div>
                <button
                    className="day-nav-btn"
                    onClick={() => setSelectedDay(Math.min(numDays, selectedDay + 1))}
                    disabled={selectedDay === numDays}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Add Activity Button / Form */}
            {!showAddForm ? (
                <button className="add-activity-btn" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} />
                    Add Activity for Day {selectedDay}
                </button>
            ) : (
                <form className="add-activity-form" onSubmit={handleAddActivity}>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="What's the plan?"
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            className="activity-input"
                            autoFocus
                        />
                        <input
                            type="time"
                            value={newActivity.time}
                            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                            className="time-input"
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Location (optional)"
                            value={newActivity.location}
                            onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                            className="location-input"
                        />
                    </div>
                    <div className="type-selector">
                        {ACTIVITY_TYPES.map(type => (
                            <button
                                key={type.id}
                                type="button"
                                className={`type-chip ${newActivity.type === type.id ? 'active' : ''}`}
                                onClick={() => setNewActivity({ ...newActivity, type: type.id })}
                                style={{ '--type-color': type.color }}
                            >
                                <span>{type.icon}</span>
                                <span>{type.name}</span>
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="Add notes (optional)"
                        value={newActivity.notes}
                        onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                        className="notes-input"
                        rows={2}
                    />
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-activity-btn" disabled={!newActivity.title}>
                            Add Activity
                        </button>
                    </div>
                </form>
            )}

            {/* Timeline */}
            <div className="timeline-container">
                {loading ? (
                    <div className="timeline-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading itinerary...</p>
                    </div>
                ) : dayActivities.length === 0 ? (
                    <div className="timeline-empty">
                        <Calendar size={48} />
                        <h3>No activities for Day {selectedDay}</h3>
                        <p>Start planning your day by adding activities!</p>
                    </div>
                ) : (
                    <div className="timeline">
                        {dayActivities.map((activity, index) => {
                            const typeInfo = getTypeInfo(activity.type);
                            const isMine = activity.suggestedBy === currentUser.uid;
                            const isApproved = activity.status === 'approved';
                            const needsMyApproval = !isApprovedByUser(activity) && !isMine;

                            return (
                                <div
                                    key={activity.id}
                                    className={`timeline-item ${isApproved ? 'approved' : 'pending'}`}
                                    style={{ '--activity-color': typeInfo.color }}
                                >
                                    <div className="timeline-marker">
                                        <span className="marker-icon">{typeInfo.icon}</span>
                                    </div>
                                    <div className="timeline-content">
                                        <div className="activity-header">
                                            <div className="activity-time">
                                                <Clock size={14} />
                                                {activity.time}
                                            </div>
                                            {activity.location && (
                                                <div className="activity-location">
                                                    <MapPin size={14} />
                                                    {activity.location}
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="activity-title">{activity.title}</h4>
                                        {activity.notes && (
                                            <p className="activity-notes">{activity.notes}</p>
                                        )}
                                        <div className="activity-footer">
                                            <span className="suggested-by">
                                                {isMine ? 'Your suggestion' : `Suggested by ${activity.suggestedByName || companionName}`}
                                            </span>
                                            <div className="activity-actions">
                                                {needsMyApproval && (
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => handleApprove(activity)}
                                                    >
                                                        <Check size={14} />
                                                        Approve
                                                    </button>
                                                )}
                                                {isApproved && (
                                                    <span className="approved-badge">
                                                        <Check size={12} />
                                                        Approved
                                                    </span>
                                                )}
                                                {isMine && (
                                                    <button
                                                        className="delete-activity-btn"
                                                        onClick={() => handleDelete(activity.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItineraryBuilder;
