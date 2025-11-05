
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Colony, Cat } from '../types';
import Modal from './Modal';
import AddColonyForm from './AddColonyForm';
import L from 'leaflet';

interface DashboardProps {
    colonies: Colony[];
    cats: Cat[];
    onSelectColony: (colonyId: string) => void;
    onAddColony: (colony: Omit<Colony, 'id'>) => void;
    onUpdateColonyLocations: (locations: { [key: string]: { lat: number, lng: number }}) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center space-x-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ colonies, cats, onSelectColony, onAddColony, onUpdateColonyLocations }) => {
    const [isAddColonyModalOpen, setAddColonyModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [updatedLocations, setUpdatedLocations] = useState<{ [key: string]: { lat: number, lng: number } }>({});
    
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const markersRef = useRef<{ [id: string]: L.Marker }>({});

    const {
        totalColonies,
        totalCats,
        sterilizedPercentage,
        chippedPercentage
    } = useMemo(() => {
        const totalColonies = colonies.length;
        const totalCats = cats.length;
        if (totalCats === 0) {
            return { totalColonies, totalCats, sterilizedPercentage: 0, chippedPercentage: 0 };
        }
        const sterilizedCount = cats.filter(cat => cat.isSterilized).length;
        const chippedCount = cats.filter(cat => cat.isChipped).length;
        const sterilizedPercentage = Math.round((sterilizedCount / totalCats) * 100);
        const chippedPercentage = Math.round((chippedCount / totalCats) * 100);
        return { totalColonies, totalCats, sterilizedPercentage, chippedPercentage };
    }, [colonies, cats]);

    const getCatCountForColony = useCallback((colonyId: string) => {
        return cats.filter(cat => cat.colonyId === colonyId).length;
    }, [cats]);

    const handleAddColony = (colonyData: Omit<Colony, 'id'>) => {
        onAddColony(colonyData);
        setAddColonyModalOpen(false);
    }
    
    const handleSaveLocations = () => {
        onUpdateColonyLocations(updatedLocations);
        setIsEditMode(false);
        setUpdatedLocations({});
    };
    
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setUpdatedLocations({});
        // Re-render markers to their original positions
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};
        // The useEffect will handle re-creating them
    };

    // Initialize map
    useEffect(() => {
        if (mapRef.current && !map) {
            const bazaCoords: L.LatLngExpression = [37.4916, -2.7725];
            const newMap = L.map(mapRef.current!).setView(bazaCoords, 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(newMap);
            setMap(newMap);
        }
    }, [mapRef, map]);

    // Update markers
    useEffect(() => {
        if (map) {
            Object.values(markersRef.current).forEach(marker => marker.remove());
            markersRef.current = {};
            
            colonies.forEach(colony => {
                const catCount = getCatCountForColony(colony.id);
                const size = 30 + Math.min(catCount * 2, 30);
                
                const location = updatedLocations[colony.id] || colony.location;

                const icon = L.divIcon({
                    html: `<div class="flex items-center justify-center w-full h-full bg-indigo-600 text-white rounded-full border-2 border-white shadow-lg text-sm font-bold">${catCount}</div>`,
                    className: '',
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2],
                });

                const marker = L.marker(location, {
                    icon,
                    draggable: isEditMode,
                }).addTo(map);

                marker.bindTooltip(`${colony.name}<br><b>${catCount}</b> ${catCount === 1 ? 'gato' : 'gatos'}`);
                
                if (!isEditMode) {
                    marker.on('click', () => onSelectColony(colony.id));
                }

                if (isEditMode) {
                    marker.on('dragend', (e) => {
                        const newLatLng = e.target.getLatLng();
                        setUpdatedLocations(prev => ({
                            ...prev,
                            [colony.id]: { lat: newLatLng.lat, lng: newLatLng.lng }
                        }));
                    });
                }
                
                markersRef.current[colony.id] = marker;
            });
        }
    }, [map, colonies, getCatCountForColony, onSelectColony, isEditMode, updatedLocations]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h2>
                <div className="flex items-center space-x-2">
                    {isEditMode ? (
                        <>
                            <button onClick={handleSaveLocations} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Guardar Cambios</button>
                            <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400">Cancelar</button>
                        </>
                    ) : (
                         <>
                            <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Editar Ubicaciones</button>
                            <button onClick={() => setAddColonyModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Añadir Colonia
                            </button>
                         </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Colonias" value={totalColonies} icon={<MapPinIcon className="h-6 w-6 text-cyan-500" />} />
                <StatCard title="Total Gatos" value={totalCats} icon={<UsersIcon className="h-6 w-6 text-orange-500" />} />
                <StatCard title="Esterilizados" value={`${sterilizedPercentage}%`} icon={<SterilizedIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title="Con Chip" value={`${chippedPercentage}%`} icon={<ChipIcon className="h-6 w-6 text-purple-500" />} />
            </div>
           
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                 <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Mapa de Colonias de Baza</h3>
                 <div ref={mapRef} className={`w-full h-[60vh] bg-gray-200 dark:bg-gray-700 rounded-lg z-0 ${isEditMode ? 'cursor-move' : ''}`} />
            </div>
             <Modal isOpen={isAddColonyModalOpen} onClose={() => setAddColonyModalOpen(false)} title="Añadir Nueva Colonia">
                <AddColonyForm onSubmit={handleAddColony} onCancel={() => setAddColonyModalOpen(false)} />
            </Modal>
        </div>
    );
};

// SVG Icons
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 010 5.292" />
  </svg>
);

const SterilizedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v4.512a2 2 0 001.196 1.834l.304.152a6 6 0 013.3 3.3l.152.304a2 2 0 001.834 1.196V8l-1-1V4z" />
  </svg>
);

const ChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

export default Dashboard;
