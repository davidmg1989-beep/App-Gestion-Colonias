
import React, { useState } from 'react';
import type { Cat, VetVisit } from '../types';
import Modal from './Modal';
import AddVetVisitForm from './AddVetVisitForm';

interface CatDetailProps {
    cat: Cat;
    onBack: () => void;
    onUpdateCat: (cat: Cat) => void;
    onAddVetVisit: (catId: string, visit: Omit<VetVisit, 'id'>) => void;
}

const CatDetail: React.FC<CatDetailProps> = ({ cat, onUpdateCat, onAddVetVisit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCat, setEditedCat] = useState<Cat>(cat);
    const [isAddVisitModalOpen, setAddVisitModalOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
             setEditedCat({ ...editedCat, [name]: e.target.checked });
        } else {
             setEditedCat({ ...editedCat, [name]: value });
        }
    };

    const handleSave = () => {
        onUpdateCat(editedCat);
        setIsEditing(false);
    };

    const handleAddVisit = (visit: Omit<VetVisit, 'id'>) => {
        onAddVetVisit(cat.id, visit);
        setAddVisitModalOpen(false);
    };
    
    const CatIconDisplay: React.FC = () => {
        if (cat.age === 'Cachorro') {
            return <KittenIcon className="w-full h-full text-yellow-500" />;
        }
        if (cat.gender === 'Macho') {
            return <MaleIcon className="w-full h-full text-blue-500" />;
        }
        return <FemaleIcon className="w-full h-full text-pink-500" />;
    }


    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 text-center">
                    <div className="w-full rounded-lg shadow-md aspect-square bg-gray-200 dark:bg-gray-700 p-4">
                       <CatIconDisplay />
                    </div>
                    <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">{cat.name}</h2>
                </div>
                <div className="md:w-2/3 space-y-4">
                    <div className="flex justify-end space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Guardar</button>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400">Cancelar</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">Editar</button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</label><input type="text" name="name" value={editedCat.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Género</label><select name="gender" value={editedCat.gender} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"><option>Macho</option><option>Hembra</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Edad</label><select name="age" value={editedCat.age} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"><option>Cachorro</option><option>Adulto</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nº Chip</label><input type="text" name="chipNumber" value={editedCat.chipNumber || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" /></div>
                            <div className="flex items-center"><input type="checkbox" name="isSterilized" checked={editedCat.isSterilized} onChange={handleInputChange} className="mr-2" /><label>Esterilizado</label></div>
                            <div className="flex items-center"><input type="checkbox" name="isChipped" checked={editedCat.isChipped} onChange={handleInputChange} className="mr-2" /><label>Con Chip</label></div>
                            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Descripción</label><textarea name="description" value={editedCat.description} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea></div>
                            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Enfermedades (separadas por comas)</label><input type="text" name="diseases" value={editedCat.diseases.join(', ')} onChange={(e) => setEditedCat({...editedCat, diseases: e.target.value.split(',').map(d => d.trim())})} className="mt-1 w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" /></div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                             <p><strong className="text-gray-500 dark:text-gray-400">Género:</strong> {cat.gender}</p>
                             <p><strong className="text-gray-500 dark:text-gray-400">Edad:</strong> {cat.age}</p>
                             <p><strong className="text-gray-500 dark:text-gray-400">Estado:</strong> {cat.isSterilized ? "Esterilizado" : "No esterilizado"}, {cat.isChipped ? "con chip" : "sin chip"}.</p>
                             {cat.isChipped && <p><strong className="text-gray-500 dark:text-gray-400">Nº Chip:</strong> {cat.chipNumber}</p>}
                             <p><strong className="text-gray-500 dark:text-gray-400">Descripción:</strong> {cat.description}</p>
                             {cat.diseases.length > 0 && <p><strong className="text-gray-500 dark:text-gray-400">Enfermedades:</strong> {cat.diseases.join(', ')}</p>}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 border-t dark:border-gray-700 pt-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visitas al Veterinario</h3>
                    <button onClick={() => setAddVisitModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Añadir Visita</button>
                </div>
                <div className="space-y-4">
                    {cat.vetVisits.length > 0 ? cat.vetVisits.map(visit => (
                        <div key={visit.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="font-bold">{new Date(visit.date).toLocaleDateString()}: {visit.reason}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{visit.notes}</p>
                        </div>
                    )) : <p className="text-gray-500 dark:text-gray-400">No hay visitas registradas.</p>}
                </div>
            </div>
             <Modal isOpen={isAddVisitModalOpen} onClose={() => setAddVisitModalOpen(false)} title="Añadir Visita Veterinaria">
                <AddVetVisitForm onSubmit={handleAddVisit} onCancel={() => setAddVisitModalOpen(false)} />
            </Modal>
        </div>
    );
};

// SVG Icons copied from ColonyDetail for consistency
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


export default CatDetail;