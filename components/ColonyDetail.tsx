
import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { Colony, Cat } from '../types';
import Modal from './Modal';
import AddCatForm from './AddCatForm';
import L from 'leaflet';

interface ColonyDetailProps {
    colony: Colony;
    cats: Cat[];
    onSelectCat: (catId: string) => void;
    onBack: () => void;
    onAddCat: (cat: Omit<Cat, 'id'>) => void;
    onUpdateColony: (colony: Colony) => void;
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

// Configure Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const ColonyDetail: React.FC<ColonyDetailProps> = ({ colony, cats, onSelectCat, onAddCat, onUpdateColony }) => {
    const [isAddCatModalOpen, setAddCatModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedColony, setEditedColony] = useState<Colony>(colony);

    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    

    const stats = useMemo(() => {
        const total = cats.length;
        const males = cats.filter(c => c.gender === 'Macho').length;
        const females = cats.filter(c => c.gender === 'Hembra').length;
        const kittens = cats.filter(c => c.age === 'Cachorro').length;
        const sterilized = cats.filter(c => c.isSterilized).length;
        const chipped = cats.filter(c => c.isChipped).length;
        return { total, males, females, kittens, sterilized, chipped };
    }, [cats]);

    useEffect(() => {
        if (mapRef.current && !map) {
            const initialCoords: L.LatLngExpression = [colony.location.lat, colony.location.lng];
            const newMap = L.map(mapRef.current).setView(initialCoords, 16);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(newMap);
            
            setMap(newMap);

            if (isEditing) {
                newMap.on('click', (e: L.LeafletMouseEvent) => {
                    const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
                    setEditedColony(prev => ({...prev, location: newLocation}));
                });
            } else {
                 newMap.dragging.disable();
                 newMap.touchZoom.disable();
                 newMap.doubleClickZoom.disable();
                 newMap.scrollWheelZoom.disable();
                 newMap.boxZoom.disable();
                 newMap.keyboard.disable();
                 // FIX: The 'tap' property does not exist on the Leaflet Map object in this version, causing a TypeScript error.
                 // The other disabled interactions should be sufficient to make the map static.
            }
        }

        // Cleanup map instance on component unmount
        return () => {
            if (map) {
                map.remove();
                setMap(null);
            }
        };

    }, [isEditing]); // Reruns when edit mode changes to attach/detach click handler

    useEffect(() => {
        if(map) {
             // Place or update marker
            const location = editedColony.location;
            if (markerRef.current) {
                markerRef.current.setLatLng(location);
            } else {
                markerRef.current = L.marker(location).addTo(map);
            }
            map.setView(location);
        }
    }, [map, editedColony.location]);

    const handleAddCat = (catData: Omit<Cat, 'id'|'colonyId'>) => {
        onAddCat({ ...catData, colonyId: colony.id});
        setAddCatModalOpen(false);
    };

    const handleSaveColony = () => {
        onUpdateColony(editedColony);
        setIsEditing(false);
    };
    
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedColony(colony);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEditedColony({ ...editedColony, [e.target.name]: e.target.value });
    };

    const CatIcon: React.FC<{cat: Cat}> = ({cat}) => {
        if (cat.age === 'Cachorro') {
            return <KittenIcon className="h-16 w-16 text-yellow-500" />;
        }
        if (cat.gender === 'Macho') {
            return <MaleIcon className="h-16 w-16 text-blue-500" />;
        }
        return <FemaleIcon className="h-16 w-16 text-pink-500" />;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-grow">
                         {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nombre de la Colonia</label>
                                    <input type="text" id="name" name="name" value={editedColony.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="feederName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nombre Alimentador</label>
                                        <input type="text" id="feederName" name="feederName" value={editedColony.feederName || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                     </div>
                                      <div>
                                        <label htmlFor="feederPhone" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono Alimentador</label>
                                        <input type="text" id="feederPhone" name="feederPhone" value={editedColony.feederPhone || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                     </div>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Descripción / Comentarios</label>
                                    <textarea id="description" name="description" value={editedColony.description} onChange={handleInputChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                                </div>
                            </div>
                        ) : (
                             <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{colony.name}</h2>
                                {colony.feederName && (
                                    <div className="mt-4 flex items-center space-x-4">
                                         <div className="flex-shrink-0"><FeederIcon className="h-6 w-6 text-gray-400"/></div>
                                         <div>
                                            <p className="font-semibold">{colony.feederName}</p>
                                            {colony.feederPhone && <p className="text-sm text-gray-500">{colony.feederPhone}</p>}
                                         </div>
                                    </div>
                                )}
                                {colony.description && <p className="mt-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{colony.description}</p>}
                            </div>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <button onClick={handleSaveColony} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Guardar</button>
                                <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400">Cancelar</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Editar</button>
                        )}
                    </div>
                </div>
                 <div className="mt-6">
                     <h3 className="text-lg font-semibold mb-2">Ubicación</h3>
                     <div ref={mapRef} className={`w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg z-0 ${isEditing ? 'cursor-pointer' : ''}`} />
                     {isEditing && <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Haz clic en el mapa para cambiar la ubicación.</p>}
                 </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Total Gatos" value={stats.total} icon={<UsersIcon className="h-6 w-6 text-indigo-500" />} />
                <StatCard title="Machos" value={stats.males} icon={<MaleIcon className="h-6 w-6 text-blue-500" />} />
                <StatCard title="Hembras" value={stats.females} icon={<FemaleIcon className="h-6 w-6 text-pink-500" />} />
                <StatCard title="Cachorros" value={stats.kittens} icon={<KittenIcon className="h-6 w-6 text-yellow-500" />} />
                <StatCard title="Esterilizados" value={stats.sterilized} icon={<SterilizedIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title="Con Chip" value={stats.chipped} icon={<ChipIcon className="h-6 w-6 text-purple-500" />} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gatos de la Colonia</h3>
                    <button
                        onClick={() => setAddCatModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Añadir Gato
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {cats.map(cat => (
                        <div key={cat.id} onClick={() => onSelectCat(cat.id)} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group flex flex-col">
                            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <CatIcon cat={cat} />
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 truncate">{cat.name}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.gender}, {cat.age}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {cat.isSterilized && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">Esterilizado</span>}
                                    {cat.isChipped && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full dark:bg-purple-900 dark:text-purple-200">Con Chip</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                 {cats.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay gatos registrados en esta colonia.</p>}
            </div>

            <Modal isOpen={isAddCatModalOpen} onClose={() => setAddCatModalOpen(false)} title="Añadir Nuevo Gato">
                <AddCatForm onSubmit={handleAddCat} onCancel={() => setAddCatModalOpen(false)} />
            </Modal>
        </div>
    );
};

// SVG Icons
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292M12 4.354a4 4 0 010 5.292" />
  </svg>
);
const MaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
   </svg>
);
const FemaleIcon = (props: React.SVGProps<SVGSVGElement>) => (
   <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v6.75m-3.375-3.375h6.75" />
   </svg>
);
const KittenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);
const FeederIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);


export default ColonyDetail;