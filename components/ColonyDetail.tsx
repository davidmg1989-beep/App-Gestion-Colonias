import React, { useMemo, useState } from 'react';
import type { Colony, Cat } from '../types';
import Modal from './Modal';
import AddCatForm from './AddCatForm';

interface ColonyDetailProps {
    colony: Colony;
    cats: Cat[];
    onSelectCat: (catId: string) => void;
    onBack: () => void;
    onAddCat: (cat: Omit<Cat, 'id'>) => void;
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

const ColonyDetail: React.FC<ColonyDetailProps> = ({ colony, cats, onSelectCat, onAddCat }) => {
    const [isAddCatModalOpen, setAddCatModalOpen] = useState(false);

    const stats = useMemo(() => {
        const total = cats.length;
        const males = cats.filter(c => c.gender === 'Macho').length;
        const females = cats.filter(c => c.gender === 'Hembra').length;
        const kittens = cats.filter(c => c.age === 'Cachorro').length;
        const sterilized = cats.filter(c => c.isSterilized).length;
        const chipped = cats.filter(c => c.isChipped).length;
        return { total, males, females, kittens, sterilized, chipped };
    }, [cats]);

    const handleAddCat = (catData: Omit<Cat, 'id'|'colonyId'>) => {
        onAddCat({ ...catData, colonyId: colony.id});
        setAddCatModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{colony.name}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{colony.description}</p>
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
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Añadir Gato
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cats.map(cat => (
                        <div key={cat.id} onClick={() => onSelectCat(cat.id)} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                            <img src={cat.photoUrl} alt={cat.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-500">{cat.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{cat.gender}, {cat.age}</p>
                                <div className="flex space-x-2 mt-2">
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5 20.25 3.75m0 0h-3.75m3.75 0v3.75" />
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

export default ColonyDetail;