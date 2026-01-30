import React, { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { DESTINATION_COORDINATES } from '../../data/destinationCoordinates';
import { MapPin, Clock, Navigation, Search, Plus, RotateCcw, Home } from 'lucide-react';
import './google-earth-styles.css';

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629, // India center
};

const defaultOptions = {
    mapTypeId: 'satellite',
    tilt: 45,
    heading: 0,
    zoom: 5,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    minZoom: 2,
    maxZoom: 18,
};

export default function GoogleEarthGlobe({ trips, onRegisterTrip, destinations }) {
    const [map, setMap] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Group trips by destination city
    const markerData = useMemo(() => {
        const grouped = {};

        trips.forEach(trip => {
            const destCoord = DESTINATION_COORDINATES.find(
                coord => coord.name.toLowerCase() === trip.destination.toLowerCase()
            );

            if (destCoord) {
                if (!grouped[trip.destination]) {
                    grouped[trip.destination] = {
                        position: { lat: destCoord.lat, lng: destCoord.lng },
                        name: trip.destination,
                        country: destCoord.country,
                        count: 0,
                        trips: [],
                    };
                }
                grouped[trip.destination].count++;
                grouped[trip.destination].trips.push(trip);
            }
        });

        return Object.values(grouped);
    }, [trips]);

    // Handle map load
    const onLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Fly to location
    const flyToLocation = useCallback((location) => {
        if (map && location) {
            map.panTo(location.position);
            map.setZoom(10);
            map.setTilt(45);
        }
    }, [map]);

    // Reset view to India
    const resetView = useCallback(() => {
        if (map) {
            map.panTo(defaultCenter);
            map.setZoom(5);
            map.setTilt(45);
            map.setHeading(0);
        }
        setSelectedCity(null);
    }, [map]);

    // Zoom controls
    const handleZoomIn = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom() + 1);
        }
    }, [map]);

    const handleZoomOut = useCallback(() => {
        if (map) {
            map.setZoom(map.getZoom() - 1);
        }
    }, [map]);

    // Rotate globe
    const handleRotate = useCallback(() => {
        if (map) {
            const currentHeading = map.getHeading() || 0;
            map.setHeading(currentHeading + 45);
        }
    }, [map]);

    // Search destinations
    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return DESTINATION_COORDINATES
            .filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8);
    }, [searchTerm]);

    const handleSearchSelect = useCallback((location) => {
        setSearchTerm('');
        setIsSearchOpen(false);
        if (map) {
            map.panTo({ lat: location.lat, lng: location.lng });
            map.setZoom(10);
        }
    }, [map]);

    // Show API key warning if not set
    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <div className="globe-container">
                <div className="api-key-warning">
                    <MapPin size={48} />
                    <h2>Google Maps API Key Required</h2>
                    <p>Please add your Google Maps API key to use this feature.</p>
                    <div className="warning-steps">
                        <h3>Setup Steps:</h3>
                        <ol>
                            <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                            <li>Enable Maps JavaScript API</li>
                            <li>Create an API key</li>
                            <li>Add to <code>.env.local</code>:</li>
                        </ol>
                        <pre>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</pre>
                    </div>
                </div>
            </div>
        );
    }

    // Handle load error
    if (loadError) {
        return (
            <div className="globe-container">
                <div className="api-key-warning">
                    <MapPin size={48} />
                    <h2>Error Loading Google Maps</h2>
                    <p>Failed to load Google Maps. Please check your API key and internet connection.</p>
                    <pre>{loadError.message}</pre>
                </div>
            </div>
        );
    }

    // Show loading state
    if (!isLoaded) {
        return (
            <div className="globe-container">
                <div className="map-loading">
                    <div className="map-loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="globe-container google-earth-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                options={defaultOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Red pin markers for registered cities */}
                {markerData.map((cityData) => (
                    <Marker
                        key={cityData.name}
                        position={cityData.position}
                        onClick={() => {
                            setSelectedCity(cityData);
                            flyToLocation(cityData);
                        }}
                        label={{
                            text: cityData.count.toString(),
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                        title={`${cityData.name} - ${cityData.count} travelers`}
                    />
                ))}

                {/* Info window for selected city */}
                {selectedCity && (
                    <InfoWindow
                        position={selectedCity.position}
                        onCloseClick={() => setSelectedCity(null)}
                    >
                        <div className="map-info-window">
                            <h3>{selectedCity.name}</h3>
                            <p className="info-country">{selectedCity.country}</p>
                            <div className="info-stats">
                                <span className="info-count">{selectedCity.count} travelers</span>
                            </div>

                            <div className="info-trips">
                                <h4>Upcoming Trips:</h4>
                                {selectedCity.trips.slice(0, 3).map((trip, idx) => (
                                    <div key={idx} className="trip-mini-item">
                                        <div className="trip-mini-info">
                                            <Clock size={12} />
                                            <span>{trip.date} at {trip.time}</span>
                                        </div>
                                        <div className="trip-mini-info">
                                            <Navigation size={12} />
                                            <span>From {trip.startPoint}</span>
                                        </div>
                                    </div>
                                ))}
                                {selectedCity.trips.length > 3 && (
                                    <p className="info-more">+{selectedCity.trips.length - 3} more trips</p>
                                )}
                            </div>

                            <button
                                className="info-register-btn"
                                onClick={() => {
                                    onRegisterTrip(selectedCity.name);
                                    setSelectedCity(null);
                                }}
                            >
                                <Plus size={16} />
                                Register Trip to {selectedCity.name}
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {/* Search Box */}
            <div className="map-search-container">
                <button
                    className="map-control-btn search-toggle"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    <Search size={20} />
                </button>

                {isSearchOpen && (
                    <div className="map-search-dropdown">
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
                                        onClick={() => handleSearchSelect(loc)}
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

            {/* Custom Controls */}
            <div className="map-controls">
                <button
                    className="map-control-btn"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <Plus size={20} />
                </button>

                <button
                    className="map-control-btn"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <line x1="5" y1="10" x2="15" y2="10" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <button
                    className="map-control-btn"
                    onClick={handleRotate}
                    title="Rotate Globe"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    className="map-control-btn"
                    onClick={resetView}
                    title="Reset View"
                >
                    <Home size={20} />
                </button>
            </div>

            {/* Stats Bar */}
            <div className="globe-stats">
                <div className="stat-pill">
                    <MapPin size={14} />
                    <span>{markerData.length} Active Destinations</span>
                </div>
                <div className="stat-pill">
                    <Navigation size={14} />
                    <span>{trips.length} Total Trips</span>
                </div>
            </div>
        </div>
    );
}
