import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { DESTINATION_COORDINATES } from '../../data/destinationCoordinates';
import { X, MapPin, Clock, Phone, Navigation, Search, Plus, RotateCcw, Users } from 'lucide-react';
import './globe-styles.css';

export default function InteractiveGlobe({ trips, onRegisterTrip, destinations }) {
    const globeRef = useRef();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [globeReady, setGlobeReady] = useState(false);

    // Calculate traveler counts per destination
    const locationData = useMemo(() => {
        const tripCounts = {};
        trips.forEach(trip => {
            const dest = trip.destination;
            tripCounts[dest] = (tripCounts[dest] || 0) + 1;
        });

        return DESTINATION_COORDINATES.map(coord => ({
            ...coord,
            travelerCount: tripCounts[coord.name] || 0,
            hasTraverlers: tripCounts[coord.name] > 0
        }));
    }, [trips]);

    // Get trips for selected location
    const selectedLocationTrips = useMemo(() => {
        if (!selectedLocation) return [];
        return trips.filter(trip =>
            trip.destination.toLowerCase() === selectedLocation.name.toLowerCase()
        );
    }, [selectedLocation, trips]);

    // Search filtered locations
    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return DESTINATION_COORDINATES
            .filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8);
    }, [searchTerm]);

    // Initialize globe settings
    useEffect(() => {
        if (globeRef.current && globeReady) {
            // Center on India
            globeRef.current.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 2.5 }, 1000);

            // Set auto-rotation
            globeRef.current.controls().autoRotate = autoRotate;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }
    }, [globeReady, autoRotate]);

    // Handle location click
    const handleLocationClick = useCallback((point) => {
        setSelectedLocation(point);
        setAutoRotate(false);

        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
            globeRef.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.5 }, 1000);
        }
    }, []);

    // Fly to location from search
    const flyToLocation = useCallback((location) => {
        setSearchTerm('');
        setIsSearchOpen(false);
        setSelectedLocation(location);
        setAutoRotate(false);

        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
            globeRef.current.pointOfView({ lat: location.lat, lng: location.lng, altitude: 1.5 }, 1000);
        }
    }, []);

    // Reset view
    const resetView = useCallback(() => {
        setSelectedLocation(null);
        setAutoRotate(true);

        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.pointOfView({ lat: 20.5937, lng: 78.9629, altitude: 2.5 }, 1000);
        }
    }, []);

    // Custom HTML for pin markers (📍 style)
    const getPinMarker = useCallback((point) => {
        const isActive = point.travelerCount > 0;
        const pinColor = isActive ? '#22c55e' : '#ef4444'; // Green if active, Red if not
        const glowColor = isActive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.3)';

        return `
            <div class="map-pin-container" style="cursor: pointer;">
                <div class="map-pin" style="
                    color: ${pinColor};
                    filter: drop-shadow(0 2px 4px ${glowColor});
                ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${pinColor}" stroke="#fff" stroke-width="1">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
                    </svg>
                </div>
                ${point.travelerCount > 0 ? `
                    <div class="pin-badge" style="
                        position: absolute;
                        top: -8px;
                        right: -8px;
                        background: ${pinColor};
                        color: white;
                        font-size: 10px;
                        font-weight: 700;
                        min-width: 16px;
                        height: 16px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">${point.travelerCount}</div>
                ` : ''}
            </div>
        `;
    }, []);

    // Tooltip on hover
    const getPinLabel = useCallback((point) => {
        const isActive = point.travelerCount > 0;
        return `
            <div class="globe-tooltip ${isActive ? 'active' : 'inactive'}">
                <div class="tooltip-header">
                    <span class="tooltip-name">${point.name}</span>
                    <span class="tooltip-country">${point.country}</span>
                </div>
                ${point.travelerCount > 0
                ? `<div class="tooltip-count green">${point.travelerCount} traveler${point.travelerCount > 1 ? 's' : ''} 🟢</div>`
                : '<div class="tooltip-empty red">No travelers yet 🔴</div>'
            }
            </div>
        `;
    }, []);

    return (
        <div className="globe-container">
            {/* Globe */}
            <div className="globe-wrapper">
                <Globe
                    ref={globeRef}
                    // Low quality Earth textures (original night mode)
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    // Use HTML markers for pin-style icons
                    htmlElementsData={locationData}
                    htmlElement={(d) => {
                        const el = document.createElement('div');
                        el.innerHTML = getPinMarker(d);
                        el.style.pointerEvents = 'auto';
                        el.style.cursor = 'pointer';
                        el.onclick = () => handleLocationClick(d);
                        el.onmouseenter = () => {
                            el.querySelector('.map-pin')?.classList.add('hovered');
                        };
                        el.onmouseleave = () => {
                            el.querySelector('.map-pin')?.classList.remove('hovered');
                        };
                        return el;
                    }}
                    htmlLat={(d) => d.lat}
                    htmlLng={(d) => d.lng}
                    htmlAltitude={0.01}
                    // Keep points for tooltip labels
                    pointsData={locationData}
                    pointLat="lat"
                    pointLng="lng"
                    pointAltitude={0}
                    pointRadius={0.001}
                    pointColor={() => 'transparent'}
                    pointLabel={getPinLabel}
                    onGlobeReady={() => setGlobeReady(true)}
                    atmosphereColor="rgba(100, 180, 255, 0.3)"
                    atmosphereAltitude={0.2}
                    enablePointerInteraction={true}
                />
            </div>

            {/* Controls Panel */}
            <div className="globe-controls">
                {/* Search */}
                <div className="globe-search-container">
                    <button
                        className={`globe-control-btn search-btn ${isSearchOpen ? 'active' : ''}`}
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search size={20} />
                    </button>

                    {isSearchOpen && (
                        <div className="globe-search-dropdown">
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map(loc => (
                                        <button
                                            key={loc.name}
                                            className="search-result-item"
                                            onClick={() => flyToLocation(loc)}
                                        >
                                            <MapPin size={14} />
                                            <span>{loc.name}</span>
                                            <span className="result-country">{loc.country}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Auto Rotate Toggle */}
                <button
                    className={`globe-control-btn ${autoRotate ? 'active' : ''}`}
                    onClick={() => {
                        setAutoRotate(!autoRotate);
                        if (globeRef.current) {
                            globeRef.current.controls().autoRotate = !autoRotate;
                        }
                    }}
                    title="Toggle Auto-Rotate"
                >
                    <RotateCcw size={20} />
                </button>

                {/* Reset View */}
                <button
                    className="globe-control-btn"
                    onClick={resetView}
                    title="Reset View"
                >
                    <Navigation size={20} />
                </button>
            </div>

            {/* Stats Bar */}
            <div className="globe-stats">
                <div className="stat-pill">
                    <MapPin size={14} />
                    <span>{DESTINATION_COORDINATES.length} Destinations</span>
                </div>
                <div className="stat-pill">
                    <Users size={14} />
                    <span>{trips.length} Active Trips</span>
                </div>
            </div>

            {/* Location Popup */}
            {selectedLocation && (
                <div className="location-popup">
                    <button className="popup-close" onClick={() => setSelectedLocation(null)}>
                        <X size={20} />
                    </button>

                    <div className="popup-header">
                        <div className="popup-icon">
                            <MapPin size={24} />
                        </div>
                        <div className="popup-title">
                            <h2>{selectedLocation.name}</h2>
                            <span className="popup-country">{selectedLocation.country}</span>
                        </div>
                    </div>

                    <div className="popup-stats">
                        <div className="popup-stat">
                            <span className="stat-value">{selectedLocation.travelerCount}</span>
                            <span className="stat-label">Travelers</span>
                        </div>
                    </div>

                    {selectedLocationTrips.length > 0 ? (
                        <div className="popup-trips">
                            <h3>Upcoming Trips</h3>
                            <div className="trips-scroll">
                                {selectedLocationTrips.map((trip, idx) => (
                                    <div key={trip.id || idx} className="trip-mini-card">
                                        <div className="trip-info">
                                            <div className="trip-route">
                                                <Navigation size={14} />
                                                <span>{trip.startPoint}</span>
                                            </div>
                                            <div className="trip-datetime">
                                                <Clock size={14} />
                                                <span>{trip.date} at {trip.time}</span>
                                            </div>
                                        </div>
                                        <a href={`tel:${trip.contact}`} className="trip-contact-btn">
                                            <Phone size={14} />
                                            <span>Contact</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="popup-empty">
                            <p>No travelers heading here yet.</p>
                            <p className="popup-empty-sub">Be the first to register!</p>
                        </div>
                    )}

                    <button
                        className="popup-register-btn"
                        onClick={() => onRegisterTrip(selectedLocation.name)}
                    >
                        <Plus size={18} />
                        Register Trip to {selectedLocation.name}
                    </button>
                </div>
            )}

            {/* Instructions */}
            {!selectedLocation && globeReady && (
                <div className="globe-instructions">
                    <span>🌍 Drag to rotate • Scroll to zoom • Click pins to explore</span>
                </div>
            )}
        </div>
    );
}
