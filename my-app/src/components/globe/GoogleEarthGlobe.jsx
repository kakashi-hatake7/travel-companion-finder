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
        <div className="globe-container google-earth-container bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
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
                        <div className="map-info-window bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg border-b border-slate-200 dark:border-slate-700 pb-1 mb-2">{selectedCity.name}</h3>
                            <p className="info-country text-sm text-slate-600 dark:text-slate-400 mb-2">{selectedCity.country}</p>
                            <div className="info-stats bg-slate-100 dark:bg-slate-800 p-2 rounded mb-2">
                                <span className="info-count font-semibold text-indigo-600 dark:text-indigo-400">{selectedCity.count} travelers</span>
                            </div>

                            <div className="info-trips space-y-2">
                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase">Upcoming Trips:</h4>
                                {selectedCity.trips.slice(0, 3).map((trip, idx) => (
                                    <div key={idx} className="trip-mini-item bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                                        <div className="trip-mini-info flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 mb-1">
                                            <Clock size={12} />
                                            <span>{trip.date} at {trip.time}</span>
                                        </div>
                                        <div className="trip-mini-info flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                            <Navigation size={12} />
                                            <span>From {trip.startPoint}</span>
                                        </div>
                                    </div>
                                ))}
                                {selectedCity.trips.length > 3 && (
                                    <p className="info-more text-xs text-center text-slate-400 italic">+{selectedCity.trips.length - 3} more trips</p>
                                )}
                            </div>

                            <button
                                className="info-register-btn w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded flex items-center justify-center gap-1 text-sm transition-colors"
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
            <div className="map-search-container absolute top-4 left-4 z-10">
                <button
                    className="map-control-btn search-toggle bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    <Search size={20} />
                </button>

                {isSearchOpen && (
                    <div className="map-search-dropdown absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-64 overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            className="w-full p-3 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
                        />
                        {searchResults.length > 0 && (
                            <div className="search-results max-h-60 overflow-y-auto">
                                {searchResults.map(loc => (
                                    <button
                                        key={loc.name}
                                        className="search-result-item w-full text-left p-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                                        onClick={() => handleSearchSelect(loc)}
                                    >
                                        <MapPin size={14} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{loc.name}</span>
                                        <span className="result-country text-xs text-slate-500 ml-auto">{loc.country}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Controls */}
            <div className="map-controls absolute right-4 bottom-24 flex flex-col gap-2">
                <button
                    className="map-control-btn bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    <Plus size={20} />
                </button>

                <button
                    className="map-control-btn bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    <Minus size={20} />
                </button>

                <button
                    className="map-control-btn bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={handleRotate}
                    title="Rotate Globe"
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    className="map-control-btn bg-white dark:bg-slate-900 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={resetView}
                    title="Reset View"
                >
                    <Home size={20} />
                </button>
            </div>

            {/* Stats Bar */}
            <div className="globe-stats absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                <div className="stat-pill bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{markerData.length} Active Destinations</span>
                </div>
                <div className="stat-pill bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <Navigation size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{trips.length} Total Trips</span>
                </div>
            </div>
        </div>
    );
}
