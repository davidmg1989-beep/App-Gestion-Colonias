
import React, { useState, useCallback } from 'react';

import Dashboard from './components/Dashboard';

import ColonyDetail from './components/ColonyDetail';

import CatDetail from './components/CatDetail';

import { initialColonies, initialCats } from './data/mockData';

import type { Colony, Cat, VetVisit, View } from './types';

import { useAuth } from './components/AuthContext';

import Login from './components/Login';



const App: React.FC = () => {

    const { isAuthenticated, logout } = useAuth();

    const [colonies, setColonies] = useState<Colony[]>(initialColonies);

    const [cats, setCats] = useState<Cat[]>(initialCats);



    const [currentView, setCurrentView] = useState<View>({ type: 'dashboard' });



    const handleSelectColony = useCallback((colonyId: string) => {

        setCurrentView({ type: 'colony', colonyId });

    }, []);



    const handleSelectCat = useCallback((catId: string) => {

        const cat = cats.find(c => c.id === catId);

        if (cat) {

            setCurrentView({ type: 'cat', catId, colonyId: cat.colonyId });

        }

    }, [cats]);



        const handleBack = useCallback(() => {



            if (currentView.type === 'cat') {



                setCurrentView({ type: 'colony', colonyId: currentView.colonyId });



            } else {



                setCurrentView({ type: 'dashboard' });



            }



        }, [currentView]);



    const addColony = (colony: Omit<Colony, 'id'>) => {

        const newColony: Colony = { ...colony, id: `colony-${Date.now()}` };

        setColonies(prev => [...prev, newColony]);

    };

    

    const updateColony = (updatedColony: Colony) => {

        setColonies(prev => prev.map(c => c.id === updatedColony.id ? updatedColony : c));

        setCurrentView({ type: 'colony', colonyId: updatedColony.id });

    };

    

    const addCat = (cat: Omit<Cat, 'id'>) => {

        const newCat: Cat = { ...cat, id: `cat-${Date.now()}` };

        setCats(prev => [...prev, newCat]);

    };



    const updateCat = (updatedCat: Cat) => {

        setCats(prev => prev.map(cat => cat.id === updatedCat.id ? updatedCat : cat));

    };



    const addVetVisit = (catId: string, visit: Omit<VetVisit, 'id'>) => {

        const newVisit: VetVisit = { ...visit, id: `visit-${Date.now()}` };

        const updatedCat = cats.find(c => c.id === catId);

        if (updatedCat) {

            const newCatData = { ...updatedCat, vetVisits: [...(updatedCat.vetVisits || []), newVisit] };

            updateCat(newCatData);

        }

    };



    if (!isAuthenticated) {

        return <Login />;

    }



    const renderView = () => {

        switch (currentView.type) {

            case 'dashboard':

                return <Dashboard colonies={colonies} cats={cats} onSelectColony={handleSelectColony} onAddColony={addColony} />;

            case 'colony':

                const selectedColony = colonies.find(c => c.id === currentView.colonyId);

                const colonyCats = cats.filter(c => c.colonyId === currentView.colonyId);

                return selectedColony ? (

                    <ColonyDetail

                        colony={selectedColony}

                        cats={colonyCats}

                        onSelectCat={handleSelectCat}

                        onBack={handleBack}

                        onAddCat={addCat}

                        onUpdateColony={updateColony}

                    />

                ) : null;

            case 'cat':

                const selectedCat = cats.find(c => c.id === currentView.catId);

                return selectedCat ? <CatDetail cat={selectedCat} onBack={handleBack} onUpdateCat={updateCat} onAddVetVisit={addVetVisit} /> : null;

            default:

                return <Dashboard colonies={colonies} cats={cats} onSelectColony={handleSelectColony} onAddColony={addColony} />;

        }

    };

    

    return (

        <div className="min-h-screen text-gray-800 dark:text-gray-200">

            <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">

                <div className="flex items-center space-x-3">

                    <CatIcon className="h-8 w-8 text-indigo-500" />

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Colonias Felinas</h1>

                </div>

                <div className="flex items-center space-x-4">

                    {currentView.type !== 'dashboard' && (

                        <button

                            onClick={handleBack}

                            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"

                        >

                            <ArrowLeftIcon className="h-5 w-5 mr-2" />

                            Volver

                        </button>

                    )}

                    <button

                        onClick={logout}

                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"

                    >

                        Logout

                    </button>

                </div>

            </header>

            <main className="p-4 sm:p-6 lg:p-8">

                {renderView()}

            </main>

        </div>

    );

};



// SVG Icons

const CatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (

  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">

    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.71 6.29c-.39.39-1.02.39-1.41 0L12 7.41l-1.29 1.29c-.39.39-1.02.39-1.41 0s-.39-1.02 0-1.41l2-2c.39-.39 1.02-.39 1.41 0l2 2c.4.39.4 1.02.01 1.41zM10 14c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2zm2 4c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" />

    <path d="M4.27 19.19c.39.39 1.02.39 1.41 0l1.17-1.17c-.16-.14-.31-.3-.46-.46L5.22 18.7c-.38.39-.38 1.03.01 1.42zm14.05-1.42c.39-.39.39-1.02 0-1.41l-1.17-1.17c.16.14.31.3.46.46l1.17 1.17c.39.39.39 1.02 0 1.41zM9 4.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5 1.5S9 5.33 9 4.5zm6 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .83-.67 1.5-1.5-1.5s-1.5-.67-1.5-1.5z"/>

  </svg>

);

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (

  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">

    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />

  </svg>

);





export default App;
