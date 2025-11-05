import React, { useState, useEffect, useRef } from 'react';
import type { Colony } from '../types';
import L from 'leaflet';

interface AddColonyFormProps {
    onSubmit: (colony: Omit<Colony, 'id'>) => void;
    onCancel: () => void;
}

// Eliminar el icono del marcador por defecto que a veces da problemas
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const AddColonyForm: React.FC<AddColonyFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    
    useEffect(() => {
        if (mapRef.current && !map) {
            const bazaCoords: L.LatLngExpression = [37.4916, -2.7725];
            const newMap = L.map(mapRef.current).setView(bazaCoords, 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(newMap);
            
            setMap(newMap);

            newMap.on('click', (e: L.LeafletMouseEvent) => {
                const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
                setLocation(newLocation);
                
                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng).addTo(newMap);
                }
            });
        }
    }, [mapRef, map]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) {
            alert('Por favor, selecciona una ubicación en el mapa.');
            return;
        }
        onSubmit({
            name,
            description,
            location,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Colonia</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación en el Mapa</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Haz clic en el mapa para establecer la ubicación.</p>
                <div ref={mapRef} className="w-full h-64 mt-2 rounded-lg bg-gray-200 dark:bg-gray-700 z-0" />
                {location && <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</p>}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Añadir Colonia</button>
            </div>
        </form>
    );
};

export default AddColonyForm;