import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DESTINATION_COORDINATES } from '../../data/destinationCoordinates';
import { MapPin, Navigation, Clock, Plus, Home, ZoomIn, ZoomOut } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './leaflet-globe-styles.css';

// Fix for default marker icon in Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker icon
const createRedMarkerIcon = (count) => {
    return L.divIcon({
        className: 'custom-red-marker',
        html: `
      <div class="marker-pin">
        <div class="marker-count">${count}</div>
      </div>
    `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
    });
};

function MapController({ center }) {
    const map = useMap();

    React.useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);

    return null;
}

export default function LeafletGlobe({ trips, onRegisterTrip }) {
    const [selectedCity, setSelectedCity] = useState(null);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center

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
                        position: [destCoord.lat, destCoord.lng],
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

    const handleMarkerClick = (cityData) => {
        setSelectedCity(cityData);
        setMapCenter(cityData.position);
    };

    const handleRegisterClick = (cityName) => {
        onRegisterTrip(cityName);
        setSelectedCity(null);
    };

    return (
        <div className="globe-container leaflet-globe-container h-full w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <MapContainer
                center={mapCenter}
                zoom={5}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="dark:opacity-75 dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-90"
                />

                <MapController center={mapCenter} />

                {/* Red pin markers for registered cities */}
                {markerData.map((cityData) => (
                    <Marker
                        key={cityData.name}
                        position={cityData.position}
                        icon={createRedMarkerIcon(cityData.count)}
                        eventHandlers={{
                            click: () => handleMarkerClick(cityData),
                        }}
                    >
                        <Popup>
                            <div className="map-popup">
                                <h3>{cityData.name}</h3>
                                <p className="popup-country">{cityData.country}</p>
                                <div className="popup-stats">
                                    <span className="popup-count">{cityData.count} travelers</span>
                                </div>

                                <div className="popup-trips">
                                    <h4>Upcoming Trips:</h4>
                                    {cityData.trips.slice(0, 3).map((trip, idx) => (
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
                                    {cityData.trips.length > 3 && (
                                        <p className="popup-more">+{cityData.trips.length - 3} more trips</p>
                                    )}
                                </div>

                                <button
                                    className="popup-register-btn"
                                    onClick={() => handleRegisterClick(cityData.name)}
                                >
                                    <Plus size={16} />
                                    Register Trip
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

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
