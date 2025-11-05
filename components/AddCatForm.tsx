

import React, { useState } from 'react';
import type { Cat } from '../types';

interface AddCatFormProps {
    onSubmit: (cat: Omit<Cat, 'id' | 'colonyId'>) => void;
    onCancel: () => void;
}

const AddCatForm: React.FC<AddCatFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'Macho' | 'Hembra'>('Hembra');
    const [age, setAge] = useState<'Cachorro' | 'Adulto'>('Cachorro');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            gender,
            age,
            description,
            isSterilized: false,
            isChipped: false,
            diseases: [],
            vetVisits: [],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Gato</label>
                <input type="text" id="cat-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Género</label>
                    <select id="gender" value={gender} onChange={e => setGender(e.target.value as 'Macho' | 'Hembra')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Hembra</option>
                        <option>Macho</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Edad</label>
                    <select id="age" value={age} onChange={e => setAge(e.target.value as 'Cachorro' | 'Adulto')} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Cachorro</option>
                        <option>Adulto</option>
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea id="cat-description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Añadir Gato</button>
            </div>
        </form>
    );
};

export default AddCatForm;
