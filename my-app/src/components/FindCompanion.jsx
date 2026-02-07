import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapPin, Calendar, Navigation, Search, Plus, Phone, Clock, Train, Plane, Bus, User } from 'lucide-react';
import EmptyState from './ui/EmptyState';

export default function FindCompanion({ trips, destinations, startPoints, onRegisterTrip, setView }) {
    const [filters, setFilters] = useState({
        destination: '',
        startPoint: '',
        date: ''
    });

    const [destinationSearch, setDestinationSearch] = useState('');
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

    // Ref for dropdown click-outside detection
    const dropdownRef = useRef(null);

    // Handle click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDestinationDropdown(false);
            }
        };

        if (showDestinationDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showDestinationDropdown]);

    // Filter trips based on selected filters
    const filteredTrips = useMemo(() => {
        return trips.filter(trip => {
            if (filters.destination && trip.destination !== filters.destination) return false;
            if (filters.startPoint && trip.startPoint !== filters.startPoint) return false;
            if (filters.date && trip.date !== filters.date) return false;
            return true;
        });
    }, [trips, filters]);

    const handleSearch = () => {
        // Search is reactive, so this is mainly for visual feedback
        console.log('Searching with filters:', filters);
    };

    const handleRegisterClick = () => {
        onRegisterTrip(filters.destination || '');
    };

    // Get transport icon based on start point
    const getTransportIcon = (startPoint) => {
        if (startPoint?.toLowerCase().includes('railway') || startPoint?.toLowerCase().includes('station')) {
            return <Train size={18} />;
        } else if (startPoint?.toLowerCase().includes('airport')) {
            return <Plane size={18} />;
        } else {
            return <Bus size={18} />;
        }
    };

    // Filter destinations based on search
    const filteredDestinations = destinations.filter(dest =>
        dest.toLowerCase().includes(destinationSearch.toLowerCase())
    ).slice(0, 8);

    return (
        <div className="find-companion-container">
            {/* Left Sidebar - Filters */}
            <div className="companion-filters glass-card">
                <div className="filters-header">
                    <h2>🗺️ Filters</h2>
                    <div className="filters-divider"></div>
                </div>

                <div className="filters-body">
                    {/* Destination Filter */}
                    <div className="filter-group">
                        <label>
                            <MapPin size={16} />
                            Destination
                        </label>
                        <div className="filter-dropdown-container" ref={dropdownRef}>
                            <input
                                type="text"
                                placeholder="Select destination..."
                                value={destinationSearch || filters.destination}
                                onFocus={() => setShowDestinationDropdown(true)}
                                onChange={(e) => {
                                    setDestinationSearch(e.target.value);
                                    setFilters({ ...filters, destination: e.target.value });
                                    setShowDestinationDropdown(true);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setShowDestinationDropdown(false);
                                    }
                                }}
                                className="filter-input"
                            />
                            {showDestinationDropdown && (() => {
                                const filteredDests = destinations.filter(dest =>
                                    dest.toLowerCase().includes((destinationSearch || '').toLowerCase())
                                ).slice(0, 6);

                                return (
                                    <div className="filter-dropdown-menu">
                                        {filteredDests.length > 0 ? (
                                            filteredDests.map(dest => (
                                                <div
                                                    key={dest}
                                                    className="filter-dropdown-item"
                                                    onClick={() => {
                                                        setFilters({ ...filters, destination: dest });
                                                        setDestinationSearch(dest);
                                                        setShowDestinationDropdown(false);
                                                    }}
                                                >
                                                    <MapPin size={14} />
                                                    {dest}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="filter-dropdown-item dropdown-empty">
                                                <MapPin size={14} />
                                                No destinations found
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Start Point Filter */}
                    <div className="filter-group">
                        <label>
                            <Navigation size={16} />
                            Start Point
                        </label>
                        <select
                            value={filters.startPoint}
                            onChange={(e) => setFilters({ ...filters, startPoint: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">All start points</option>
                            {startPoints.map(point => (
                                <option key={point} value={point}>{point}</option>
                            ))}
                        </select>
                    </div>

                    {/* Travel Date Filter */}
                    <div className="filter-group">
                        <label>
                            <Calendar size={16} />
                            Travel Date
                        </label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="filter-input"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="filter-actions">
                        <button className="filter-search-btn" onClick={handleSearch}>
                            <Search size={16} />
                            Search
                        </button>
                        <button className="filter-register-btn" onClick={handleRegisterClick}>
                            <Plus size={16} />
                            Register Trip
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Companion List */}
            <div className="companion-list-panel">
                <div className="companion-list-header">
                    <h2>📋 Available Companions</h2>
                    <span className="companion-count">{filteredTrips.length} found</span>
                </div>

                <div className="companion-list">
                    {filteredTrips.length === 0 ? (
                        <EmptyState
                            icon={<User size={64} />}
                            title="No trips found for this route"
                            description="Be the first to register a trip on this route and connect with fellow travelers!"
                            actionText="Register Trip"
                            onAction={() => setView ? setView('register') : onRegisterTrip('')}
                        />
                    ) : (
                        filteredTrips.map((trip) => (
                            <div key={trip.id} className="companion-card glass-card">
                                <div className="companion-card-header">
                                    <div className="companion-route">
                                        {getTransportIcon(trip.startPoint)}
                                        <span className="route-text">
                                            {trip.startPoint?.split(' ')[0]} → {trip.destination}
                                        </span>
                                    </div>
                                </div>

                                <div className="companion-card-body">
                                    <div className="companion-info">
                                        <div className="info-item">
                                            <Calendar size={14} />
                                            <span>{new Date(trip.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        <div className="info-item">
                                            <Clock size={14} />
                                            <span>{trip.time}</span>
                                        </div>
                                        <div className="info-item">
                                            <Navigation size={14} />
                                            <span>{trip.startPoint}</span>
                                        </div>
                                    </div>

                                    <div className="companion-footer">
                                        <div className="companion-user">
                                            <User size={14} />
                                            <span>Traveler</span>
                                        </div>
                                        <a href={`tel:${trip.contact}`} className="companion-contact-btn">
                                            <Phone size={14} />
                                            Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
