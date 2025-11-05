
import React, { useState } from 'react';
import type { VetVisit } from '../types';

interface AddVetVisitFormProps {
    onSubmit: (visit: Omit<VetVisit, 'id'>) => void;
    onCancel: () => void;
}

const AddVetVisitForm: React.FC<AddVetVisitFormProps> = ({ onSubmit, onCancel }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ date, reason, notes });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de la Visita</label>
                <input type="date" id="visit-date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="visit-reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo de la Visita</label>
                <input type="text" id="visit-reason" value={reason} onChange={e => setReason(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
             <div>
                <label htmlFor="visit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notas</label>
                <textarea id="visit-notes" value={notes} onChange={e => setNotes(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Añadir Visita</button>
            </div>
        </form>
    );
};

export default AddVetVisitForm;
