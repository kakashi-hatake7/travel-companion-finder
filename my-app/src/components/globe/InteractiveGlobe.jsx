import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { DESTINATION_COORDINATES } from '../../data/destinationCoordinates';
import { X, MapPin, Clock, Phone, Navigation, Search, Plus, Minus, RotateCcw, Users } from 'lucide-react';
import './globe-styles.css';

export default function InteractiveGlobe({ trips, onRegisterTrip, destinations }) {
    const globeRef = useRef();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [globeReady, setGlobeReady] = useState(false);
    const [altitude, setAltitude] = useState(2.5);

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

            // Track altitude changes for label visibility
            const controls = globeRef.current.controls();
            const updateAltitude = () => {
                const pov = globeRef.current.pointOfView();
                if (pov && pov.altitude !== undefined) {
                    setAltitude(pov.altitude);
                }
            };
            controls.addEventListener('change', updateAltitude);

            return () => {
                controls.removeEventListener('change', updateAltitude);
            };
        }
    }, [globeReady, autoRotate]);

    // Update active state of pins
    useEffect(() => {
        if (!selectedLocation) {
            document.querySelectorAll('.map-pin-container').forEach(el => el.classList.remove('selected'));
            return;
        }

        const safeId = `pin-${selectedLocation.name.replace(/\s+/g, '-')}`;
        const pin = document.getElementById(safeId);

        if (pin) {
            document.querySelectorAll('.map-pin-container').forEach(el => el.classList.remove('selected'));
            pin.classList.add('selected');
        }
    }, [selectedLocation]);

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

    // Zoom handlers
    const handleZoomIn = useCallback(() => {
        if (globeRef.current) {
            const pov = globeRef.current.pointOfView();
            const newAltitude = Math.max(0.5, pov.altitude - 0.5);
            globeRef.current.pointOfView({ altitude: newAltitude }, 300);
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        if (globeRef.current) {
            const pov = globeRef.current.pointOfView();
            const newAltitude = Math.min(5, pov.altitude + 0.5);
            globeRef.current.pointOfView({ altitude: newAltitude }, 300);
        }
    }, []);

    // Precise Dot Markers
    const getPinMarker = useCallback((point) => {
        const isActive = point.travelerCount > 0;
        const color = isActive ? '#22c55e' : '#ef4444'; // Green or Red

        return `
            <div id="pin-${point.name.replace(/\s+/g, '-')}" class="map-pin-container" style="cursor: pointer;">
                <div class="precise-dot" style="background-color: ${color};"></div>
                ${point.travelerCount > 0 ? `
                    <div class="precise-badge" style="background-color: ${color};">${point.travelerCount}</div>
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
                    // Satellite Earth texture
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    // Removed background to allow CSS background or keeping it simple
                    backgroundColor="rgba(0,0,0,0)"
                    // Text Labels (only visible when zoomed in)
                    labelsData={altitude < 1.5 ? locationData : []}
                    labelLat="lat"
                    labelLng="lng"
                    labelText="name"
                    labelSize={0.2}
                    labelDotRadius={0}
                    labelColor={() => 'white'}
                    labelResolution={2}
                    labelAltitude={0.01}
                    // Custom HTML for precise dot markers
                    htmlElementsData={locationData}
                    htmlElement={(d) => {
                        const el = document.createElement('div');
                        el.innerHTML = getPinMarker(d);
                        el.style.pointerEvents = 'auto';
                        el.style.cursor = 'pointer';
                        el.onclick = (e) => {
                            e.stopPropagation();
                            handleLocationClick(d);
                        };
                        return el;
                    }}
                    htmlLat="lat"
                    htmlLng="lng"
                    htmlAltitude={0}
                    // Atmosphere
                    onGlobeReady={() => setGlobeReady(true)}
                    atmosphereColor="rgba(200, 230, 255, 0.2)"
                    atmosphereAltitude={0.15}
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

                {/* Zoom In */}
                <button
                    className="globe-control-btn"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <Plus size={20} />
                </button>

                {/* Zoom Out */}
                <button
                    className="globe-control-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <Minus size={20} />
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
