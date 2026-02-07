import React from 'react';
import { MapPin, Calendar, DollarSign, Users, User } from 'lucide-react';
import './TripCard.css';

export default function TripCard({ trip, onJoinGroup, currentUser, isGroupTrip }) {
    const isUserMember = trip.members?.includes(currentUser?.uid);
    const isFull = trip.availableSeats <= 0;

    // Generate placeholder avatars for the traveling squad
    const getAvatarUrl = (index) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
        return `https://ui-avatars.com/api/?name=User${index}&background=${colors[index % colors.length].slice(1)}&color=fff&size=128`;
    };

    // Get destination image (using Unsplash for high-quality images)
    const getDestinationImage = (destination) => {
        const imageMap = {
            'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
            'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
            'Shimla': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
            'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
            'Udaipur': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
            'Rishikesh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
            'Leh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            'Darjeeling': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
        };

        return imageMap[destination] || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80`;
    };

    const memberCount = trip.members?.length || 1;
    const totalSeats = trip.totalSeats || 4;

    return (
        <div className="trip-card">
            {/* A. Image Header with Floating Badge */}
            <div className="trip-card-image-container">
                <img
                    src={getDestinationImage(trip.destination)}
                    alt={trip.destination}
                    className="trip-card-image"
                />

                {/* Glassmorphism Floating Badge */}
                {isGroupTrip && (
                    <div className="trip-card-badge">
                        <span className={`badge-dot ${isFull ? 'badge-dot-red' : 'badge-dot-green'}`}></span>
                        <span className="badge-text">
                            {isFull ? 'Full' : `${trip.availableSeats} Seat${trip.availableSeats !== 1 ? 's' : ''} Left`}
                        </span>
                    </div>
                )}
            </div>

            {/* B. Card Body - Details */}
            <div className="trip-card-body">
                {/* Title */}
                <h3 className="trip-card-title">
                    {trip.destination ? `Weekend getaway to ${trip.destination}` : 'Exciting Journey'}
                </h3>

                {/* Info Row */}
                <div className="trip-card-info-row">
                    <div className="trip-card-info-item">
                        <Calendar size={16} className="info-icon" />
                        <span>{new Date(trip.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}</span>
                    </div>
                    <div className="trip-card-info-item">
                        <DollarSign size={16} className="info-icon" />
                        <span>₹{trip.estimatedCost || '2,500'}</span>
                    </div>
                </div>

                {/* THE SQUAD - Avatar Stack */}
                {isGroupTrip && (
                    <div className="trip-card-squad">
                        <div className="squad-label">Traveling Squad</div>
                        <div className="squad-avatars">
                            {Array.from({ length: Math.min(memberCount, 4) }).map((_, i) => (
                                <div key={i} className="squad-avatar">
                                    <img
                                        src={getAvatarUrl(i)}
                                        alt={`Member ${i + 1}`}
                                    />
                                </div>
                            ))}
                            {memberCount > 4 && (
                                <div className="squad-avatar squad-avatar-more">
                                    <span>+{memberCount - 4}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Solo Trip User Info */}
                {!isGroupTrip && (
                    <div className="trip-card-solo-user">
                        <User size={16} className="info-icon" />
                        <span>Solo Traveler</span>
                    </div>
                )}
            </div>

            {/* C. Footer - Action Button */}
            <div className="trip-card-footer">
                <button
                    className={`trip-card-action-btn ${(isFull || isUserMember) ? 'disabled' : ''}`}
                    onClick={() => isGroupTrip && !isFull && !isUserMember && onJoinGroup(trip.id)}
                    disabled={isGroupTrip && (isFull || isUserMember)}
                >
                    {isGroupTrip ? (
                        <>
                            <Users size={18} />
                            {isUserMember ? 'Already Joined' : isFull ? 'Group Full' : 'Request to Join'}
                        </>
                    ) : (
                        <>
                            <User size={18} />
                            Connect
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
