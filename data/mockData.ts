import type { Colony, Cat } from '../types';

export const initialColonies: Colony[] = [
    {
        id: 'colony-1',
        name: 'Colonia del Parque Central',
        location: { lat: 37.493, lng: -2.775 },
        description: 'Ubicada cerca de la fuente principal del parque. Zona tranquila con muchos árboles.'
    },
    {
        id: 'colony-2',
        name: 'Colonia del Mercado',
        location: { lat: 37.489, lng: -2.771 },
        description: 'Detrás del mercado municipal. Los gatos se resguardan en los soportales.'
    },
    {
        id: 'colony-3',
        name: 'Gatos del Río',
        location: { lat: 37.495, lng: -2.770 },
        description: 'A lo largo de la ribera del río. Suelen estar entre los juncos.'
    }
];

export const initialCats: Cat[] = [
    {
        id: 'cat-1',
        colonyId: 'colony-1',
        name: 'Misha',
        gender: 'Hembra',
        age: 'Adulto',
        isSterilized: true,
        isChipped: true,
        chipNumber: '941000012345678',
        photoUrl: 'https://picsum.photos/seed/misha/300/300',
        description: 'Gata tricolor muy sociable y curiosa. La líder del grupo.',
        diseases: ['Alergia leve al polen'],
        vetVisits: [
            { id: 'visit-1', date: '2023-05-15', reason: 'Esterilización', notes: 'Cirugía realizada sin complicaciones.' },
            { id: 'visit-2', date: '2024-01-20', reason: 'Vacunación anual', notes: 'Se administró la vacuna trivalente.' }
        ]
    },
    {
        id: 'cat-2',
        colonyId: 'colony-1',
        name: 'Simba',
        gender: 'Macho',
        age: 'Adulto',
        isSterilized: true,
        isChipped: false,
        photoUrl: 'https://picsum.photos/seed/simba/300/300',
        description: 'Gato atigrado de color naranja. Algo tímido con los desconocidos.',
        diseases: [],
        vetVisits: [
             { id: 'visit-3', date: '2023-06-10', reason: 'Castración', notes: 'Procedimiento exitoso.' },
        ]
    },
    {
        id: 'cat-3',
        colonyId: 'colony-1',
        name: 'Luna',
        gender: 'Hembra',
        age: 'Cachorro',
        isSterilized: false,
        isChipped: false,
        photoUrl: 'https://picsum.photos/seed/luna/300/300',
        description: 'Cachorra juguetona de pelaje negro. Inseparable de su hermano Sol.',
        diseases: [],
        vetVisits: []
    },
    {
        id: 'cat-4',
        colonyId: 'colony-2',
        name: 'Leo',
        gender: 'Macho',
        age: 'Adulto',
        isSterilized: false,
        isChipped: true,
        chipNumber: '941000012345680',
        photoUrl: 'https://picsum.photos/seed/leo/300/300',
        description: 'Un gato grande y tranquilo, de color gris. Le encanta dormir al sol.',
        diseases: [],
        vetVisits: [
             { id: 'visit-4', date: '2024-02-11', reason: 'Revisión por cojera', notes: 'Leve esguince, se recetó reposo.' },
        ]
    },
    {
        id: 'cat-5',
        colonyId: 'colony-3',
        name: 'Nala',
        gender: 'Hembra',
        age: 'Adulto',
        isSterilized: true,
        isChipped: true,
        chipNumber: '941000012345681',
        photoUrl: 'https://picsum.photos/seed/nala/300/300',
        description: 'Gata siamesa muy elegante. Es la más esquiva de la colonia del río.',
        diseases: ['Asma felino leve'],
        vetVisits: []
    },
];