
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import L from 'leaflet';

interface LocationPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLocation: { lat: number; lng: number };
    onLocationSave: (location: { lat: number; lng: number }) => void;
}

// Set up default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isOpen, onClose, initialLocation, onLocationSave }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    useEffect(() => {
        // Reset location when modal is opened with a new initial location
        if (isOpen) {
            setSelectedLocation(initialLocation);
        }
    }, [isOpen, initialLocation]);

    useEffect(() => {
        if (isOpen && mapRef.current) {
            if (!mapInstanceRef.current) {
                // Create map instance
                const map = L.map(mapRef.current).setView(selectedLocation, 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                // Create marker
                markerRef.current = L.marker(selectedLocation).addTo(map);

                // Set click event
                map.on('click', (e: L.LeafletMouseEvent) => {
                    const newLoc = { lat: e.latlng.lat, lng: e.latlng.lng };
                    setSelectedLocation(newLoc);
                    markerRef.current?.setLatLng(e.latlng);
                });

                mapInstanceRef.current = map;
            } else {
                // If map already exists, just update its view and marker
                mapInstanceRef.current.setView(selectedLocation, 16);
                markerRef.current?.setLatLng(selectedLocation);
            }

            // Invalidate size to fix rendering issues inside modal
            const timer = setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSave = () => {
        onLocationSave(selectedLocation);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar Nueva Ubicación">
            <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Haz clic en el mapa para mover el marcador a la nueva ubicación de la colonia.</p>
                <div ref={mapRef} className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-lg z-0" />
                <div className="text-center text-sm text-gray-700 dark:text-gray-300">
                    Latitud: {selectedLocation.lat.toFixed(5)}, Longitud: {selectedLocation.lng.toFixed(5)}
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Guardar Ubicación</button>
                </div>
            </div>
        </Modal>
    );
};

export default LocationPickerModal;
