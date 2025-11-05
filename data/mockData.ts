import type { Colony, Cat } from '../types';

// Helper function to generate cats for a colony
const generateCats = (
    colonyId: string,
    counts: {
        females: number;
        sterilizedFemales: number;
        males: number;
        castratedMales: number;
        kittens: number;
    }
): Cat[] => {
    const cats: Cat[] = [];
    let catCounter = 1;

    const sFemales = Math.min(counts.females, counts.sterilizedFemales);
    const cMales = Math.min(counts.males, counts.castratedMales);

    // Generate sterilized females
    for (let i = 0; i < sFemales; i++) {
        cats.push({
            id: `cat-${colonyId}-${catCounter++}`,
            colonyId,
            name: `Hembra ${catCounter - 1}`,
            gender: 'Hembra',
            age: 'Adulto',
            isSterilized: true,
            isChipped: false,
            photoUrl: `https://picsum.photos/seed/${colonyId}-${catCounter}/300/300`,
            description: 'Gata adulta de la colonia.',
            diseases: [],
            vetVisits: [],
        });
    }

    // Generate non-sterilized females
    for (let i = 0; i < counts.females - sFemales; i++) {
        cats.push({
            id: `cat-${colonyId}-${catCounter++}`,
            colonyId,
            name: `Hembra ${catCounter - 1}`,
            gender: 'Hembra',
            age: 'Adulto',
            isSterilized: false,
            isChipped: false,
            photoUrl: `https://picsum.photos/seed/${colonyId}-${catCounter}/300/300`,
            description: 'Gata adulta de la colonia.',
            diseases: [],
            vetVisits: [],
        });
    }

    // Generate castrated males
    for (let i = 0; i < cMales; i++) {
        cats.push({
            id: `cat-${colonyId}-${catCounter++}`,
            colonyId,
            name: `Macho ${catCounter - 1}`,
            gender: 'Macho',
            age: 'Adulto',
            isSterilized: true,
            isChipped: false,
            photoUrl: `https://picsum.photos/seed/${colonyId}-${catCounter}/300/300`,
            description: 'Gato adulto de la colonia.',
            diseases: [],
            vetVisits: [],
        });
    }

    // Generate non-castrated males
    for (let i = 0; i < counts.males - cMales; i++) {
        cats.push({
            id: `cat-${colonyId}-${catCounter++}`,
            colonyId,
            name: `Macho ${catCounter - 1}`,
            gender: 'Macho',
            age: 'Adulto',
            isSterilized: false,
            isChipped: false,
            photoUrl: `https://picsum.photos/seed/${colonyId}-${catCounter}/300/300`,
            description: 'Gato adulto de la colonia.',
            diseases: [],
            vetVisits: [],
        });
    }

    // Generate kittens
    for (let i = 0; i < counts.kittens; i++) {
        cats.push({
            id: `cat-${colonyId}-${catCounter++}`,
            colonyId,
            name: `Cachorro ${catCounter - 1}`,
            gender: Math.random() > 0.5 ? 'Macho' : 'Hembra',
            age: 'Cachorro',
            isSterilized: false,
            isChipped: false,
            photoUrl: `https://picsum.photos/seed/${colonyId}-${catCounter}/300/300`,
            description: 'Cachorro de la colonia.',
            diseases: [],
            vetVisits: [],
        });
    }
    
    return cats;
};

export const initialColonies: Colony[] = [
    { id: 'colony-1', name: 'Dama de Baza', location: { lat: 37.4901, lng: -2.7742 }, description: 'Alimentador: Ana' },
    { id: 'colony-2', name: 'Biblioteca', location: { lat: 37.4925, lng: -2.7761 }, description: 'Alimentador: Ana' },
    { id: 'colony-3', name: 'Cordobés', location: { lat: 37.4915, lng: -2.7733 }, description: 'Alimentador: Ana' },
    { id: 'colony-4', name: 'Barrio Colonia Cisne', location: { lat: 37.4882, lng: -2.7795 }, description: 'Se han visto gatos con colas amputadas. Se dió aviso al Ayuntamiento del maltrato animal. Alimentador: Ana, Marisa y María Duran, Colaboradoras acreditadas' },
    { id: 'colony-5', name: 'Sebas', location: { lat: 37.4895, lng: -2.7801 }, description: 'Alimentador: Charo' },
    { id: 'colony-6', name: 'Duende', location: { lat: 37.4903, lng: -2.7812 }, description: 'Alimentador: Charo' },
    { id: 'colony-7', name: 'Cordoba', location: { lat: 37.4888, lng: -2.7756 }, description: 'Alimentador: Charo' },
    { id: 'colony-8', name: 'Segureca', location: { lat: 37.4931, lng: -2.7718 }, description: 'Alimentador: Isa' },
    { id: 'colony-9', name: 'ITV', location: { lat: 37.4815, lng: -2.7883 }, description: 'Alimentador: Isa' },
    { id: 'colony-10', name: 'Club de Tenis', location: { lat: 37.4852, lng: -2.7654 }, description: 'Alimentador: Mavi' },
    { id: 'colony-11', name: 'Perdices', location: { lat: 37.4955, lng: -2.7781 }, description: '6 o 7 gatos fijos, los demas merodeadores, le queda una hembra y Un macho por castrar de los fijos. Alimentador: Mavi' },
    { id: 'colony-12', name: 'Hospital Baza', location: { lat: 37.4810, lng: -2.7805 }, description: 'Alimentador: MDA' },
    { id: 'colony-13', name: 'Alcrebite', location: { lat: 37.4962, lng: -2.7729 }, description: 'Alimentador: MDA' },
    { id: 'colony-14', name: 'Fuentezuelas-Cruz Sierra', location: { lat: 37.4877, lng: -2.7698 }, description: 'Han muerto 2 hembras castradas y 2 machos castrados de menos de 2 años. Alimentador: Angustias' },
    { id: 'colony-15', name: 'Piedras', location: { lat: 37.4866, lng: -2.7751 }, description: 'Alimentador: Alicia/Noel' },
    { id: 'colony-16', name: 'Parque Fidel del campo Avd. Mediterráneo', location: { lat: 37.4855, lng: -2.7739 }, description: 'Alimentador: Elisabeth' },
    { id: 'colony-17', name: 'Calle Enrique Pareja (1)', location: { lat: 37.4933, lng: -2.7748 }, description: 'Son cercanas entre si. Alimentador: Elisabeth' },
    { id: 'colony-18', name: 'Calle Enrique Pareja (2)', location: { lat: 37.4935, lng: -2.7745 }, description: 'Son cercanas entre si. Alimentador: Jorge (argentino)' },
    { id: 'colony-19', name: 'Monjas', location: { lat: 37.4918, lng: -2.7767 }, description: 'Alimentador: Eva' },
    { id: 'colony-20', name: 'Plaza de Santiago', location: { lat: 37.4879, lng: -2.7743 }, description: 'Alimentador: Charo' },
    { id: 'colony-21', name: 'Sebas (2)', location: { lat: 37.4897, lng: -2.7803 }, description: 'Alimentador: Charo' },
    { id: 'colony-22', name: 'Duende (2)', location: { lat: 37.4905, lng: -2.7814 }, description: 'Alimentador: Charo' },
    { id: 'colony-23', name: 'Cordoba (2)', location: { lat: 37.4890, lng: -2.7758 }, description: 'Alimentador: Charo' },
    { id: 'colony-24', name: 'Almería', location: { lat: 37.4885, lng: -2.7721 }, description: 'Alimentador: Charo' },
    { id: 'colony-25', name: 'Jázmin', location: { lat: 37.4941, lng: -2.7705 }, description: 'Alimentador: Maria Jose Carrillo' },
    { id: 'colony-26', name: 'Cáliz', location: { lat: 37.4943, lng: -2.7707 }, description: 'Alimentador: Maria Jose Carrillo' },
    { id: 'colony-27', name: 'Cojo Mojon', location: { lat: 37.4971, lng: -2.7753 }, description: 'Alimentador: Miguel' },
    { id: 'colony-28', name: 'Mercadona', location: { lat: 37.4862, lng: -2.7779 }, description: 'Alimentador: Miguel' },
    { id: 'colony-29', name: 'Espíritu Santo', location: { lat: 37.4841, lng: -2.7712 }, description: 'Alimentador: MDG' },
    { id: 'colony-30', name: 'Santa Rita', location: { lat: 37.4899, lng: -2.7688 }, description: 'Alimentador: MDG' },
    { id: 'colony-31', name: 'Zalema', location: { lat: 37.4858, lng: -2.7715 }, description: 'Falta información por parte de la alimentadora. Alimentador: Carmen' },
    { id: 'colony-32', name: 'Canta Ranas', location: { lat: 37.4965, lng: -2.7699 }, description: 'Falta información por parte de la alimentadora. Alimentador: Carmen' },
    { id: 'colony-33', name: 'Polígono Baico', location: { lat: 37.4998, lng: -2.7891 }, description: 'Tres puntos de alimentación. Alimentador: Luis/ Inma' },
    { id: 'colony-34', name: 'Centro Joven', location: { lat: 37.4948, lng: -2.7731 }, description: 'Alimentador: Inma/Luis' },
    { id: 'colony-35', name: 'Cerezo', location: { lat: 37.4871, lng: -2.7709 }, description: 'Alimentador: Inma/Luis' },
    { id: 'colony-36', name: 'Barrio Perchel', location: { lat: 37.4938, lng: -2.7681 }, description: 'Alimentador: Ana Belen Lozano' },
    { id: 'colony-37', name: 'Jiménez', location: { lat: 37.4845, lng: -2.7736 }, description: 'Alimentador: Francesca' },
    { id: 'colony-38', name: 'José de Mora', location: { lat: 37.4908, lng: -2.7702 }, description: 'Alimentador: Silvana/MA' },
    { id: 'colony-39', name: 'Palacio Enríquez', location: { lat: 37.4911, lng: -2.7775 }, description: 'Alimentador: Elena/Dora' },
    { id: 'colony-40', name: 'Fco. Velasco', location: { lat: 37.4922, lng: -2.7695 }, description: 'Alimentador: Encarni' },
    { id: 'colony-41', name: 'Pintor Zurbarán', location: { lat: 37.4869, lng: -2.7675 }, description: 'Alimentador: Candi' },
    { id: 'colony-42', name: 'Club Zoaime', location: { lat: 37.4833, lng: -2.7759 }, description: 'Alimentador: Mada' },
    { id: 'colony-43', name: 'Cruz Baja Espiritu Santo', location: { lat: 37.4839, lng: -2.7718 }, description: 'Preñada una hembra. Alimentador: Antonio/Maria I.' },
    { id: 'colony-44', name: 'Callejón Toril', location: { lat: 37.4828, lng: -2.7741 }, description: 'Alimentador: Yeni' },
    { id: 'colony-45', name: 'Bolas', location: { lat: 37.4892, lng: -2.7659 }, description: 'Alimentador: Ana' },
    { id: 'colony-46', name: 'Geas/Baños Zamora', location: { lat: 37.4831, lng: -2.7685 }, description: 'Alimentador: Raúl' },
    { id: 'colony-47', name: 'Picasso', location: { lat: 37.4874, lng: -2.7682 }, description: 'Alimentador: Alfonso' },
    { id: 'colony-48', name: 'San Sebastián', location: { lat: 37.4851, lng: -2.7701 }, description: 'Alimentador: Paqui' },
    { id: 'colony-49', name: 'Minerva', location: { lat: 37.4905, lng: -2.7677 }, description: 'Alimentador: M.Angeles' },
    { id: 'colony-50', name: 'Callejón Redondo', location: { lat: 37.4844, lng: -2.7753 }, description: 'se sabe que hay camada pero aun no se avistado. Alimentador: Emilio Sanchez' },
    { id: 'colony-51', name: 'Colonia Torre Capel', location: { lat: 37.5011, lng: -2.7658 }, description: 'Alimentador: Ramón Moya' },
    { id: 'colony-52', name: 'Flores', location: { lat: 37.4929, lng: -2.7788 }, description: 'Antes había una alimentadora, pero ya no están. Alimentan vecinos.' },
    { id: 'colony-53', name: 'Polígono La Noria', location: { lat: 37.4789, lng: -2.7723 }, description: 'Se tiene conocimiento de que hay gatos, Pero no hay gestor oficial en este punto.' },
    { id: 'colony-54', name: 'Corredera', location: { lat: 37.4921, lng: -2.7744 }, description: 'Tiene alimentador, pero no registrado aún.' },
    { id: 'colony-55', name: 'Santiago-Plaza de botas', location: { lat: 37.4875, lng: -2.7740 }, description: 'Se conoce que hay gatos por esa zona, pero los alimentan los vecinos. Posiblemente se muevan por las colonias de alrededor' },
    { id: 'colony-56', name: 'Callejón Molinos', location: { lat: 37.4863, lng: -2.7725 }, description: 'Se conoce que hay gatos por esa zona. No tiene alimentador registrado.' },
    { id: 'colony-57', name: 'Urbano', location: { lat: 37.4900, lng: -2.7700 }, description: 'Se conoce que hay gatos por esa zona. No tiene alimentador registrado.' }
];

const catsData: Cat[] = [
    ...generateCats('colony-1', { females: 4, sterilizedFemales: 0, males: 6, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-2', { females: 3, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-3', { females: 4, sterilizedFemales: 0, males: 5, castratedMales: 1, kittens: 0 }),
    ...generateCats('colony-4', { females: 4, sterilizedFemales: 4, males: 4, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-5', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-6', { females: 2, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-7', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-8', { females: 3, sterilizedFemales: 0, males: 5, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-9', { females: 9, sterilizedFemales: 0, males: 16, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-10', { females: 3, sterilizedFemales: 0, males: 6, castratedMales: 0, kittens: 3 }),
    ...generateCats('colony-11', { females: 4, sterilizedFemales: 3, males: 10, castratedMales: 3, kittens: 0 }),
    ...generateCats('colony-12', { females: 4, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-13', { females: 3, sterilizedFemales: 0, males: 5, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-14', { females: 5, sterilizedFemales: 6, males: 12, castratedMales: 6, kittens: 0 }), // Capped sterilizedFemales to 5
    ...generateCats('colony-15', { females: 17, sterilizedFemales: 0, males: 22, castratedMales: 0, kittens: 5 }),
    ...generateCats('colony-16', { females: 9, sterilizedFemales: 0, males: 5, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-17', { females: 4, sterilizedFemales: 0, males: 1, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-18', { females: 1, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 6 }),
    ...generateCats('colony-19', { females: 1, sterilizedFemales: 0, males: 4, castratedMales: 0, kittens: 1 }),
    ...generateCats('colony-20', { females: 4, sterilizedFemales: 0, males: 5, castratedMales: 0, kittens: 3 }),
    ...generateCats('colony-21', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-22', { females: 2, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-23', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-24', { females: 2, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-25', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 2 }),
    ...generateCats('colony-26', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }), // Totals mismatch in source, assuming 0
    ...generateCats('colony-27', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-28', { females: 2, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 2 }), // Totals mismatch
    ...generateCats('colony-29', { females: 2, sterilizedFemales: 0, males: 5, castratedMales: 0, kittens: 2 }),
    ...generateCats('colony-30', { females: 2, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-31', { females: 5, sterilizedFemales: 0, males: 7, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-32', { females: 3, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 3 }), // Totals mismatch
    ...generateCats('colony-33', { females: 7, sterilizedFemales: 0, males: 11, castratedMales: 0, kittens: 4 }),
    ...generateCats('colony-34', { females: 3, sterilizedFemales: 0, males: 9, castratedMales: 0, kittens: 5 }),
    ...generateCats('colony-35', { females: 4, sterilizedFemales: 0, males: 7, castratedMales: 0, kittens: 4 }),
    ...generateCats('colony-36', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }), // No data in source
    ...generateCats('colony-37', { females: 4, sterilizedFemales: 3, males: 3, castratedMales: 2, kittens: 0 }),
    ...generateCats('colony-38', { females: 1, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-39', { females: 3, sterilizedFemales: 0, males: 9, castratedMales: 0, kittens: 2 }),
    ...generateCats('colony-40', { females: 5, sterilizedFemales: 0, males: 4, castratedMales: 0, kittens: 2 }),
    ...generateCats('colony-41', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }), // No data in source
    ...generateCats('colony-42', { females: 5, sterilizedFemales: 2, males: 2, castratedMales: 0, kittens: 2 }),
    ...generateCats('colony-43', { females: 6, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-44', { females: 6, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 6 }),
    ...generateCats('colony-45', { females: 5, sterilizedFemales: 4, males: 2, castratedMales: 1, kittens: 0 }),
    ...generateCats('colony-46', { females: 1, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 2 }), // Totals mismatch
    ...generateCats('colony-47', { females: 3, sterilizedFemales: 0, males: 2, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-48', { females: 3, sterilizedFemales: 0, males: 4, castratedMales: 0, kittens: 3 }),
    ...generateCats('colony-49', { females: 5, sterilizedFemales: 0, males: 7, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-50', { females: 2, sterilizedFemales: 1, males: 7, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-51', { females: 4, sterilizedFemales: 0, males: 10, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-52', { females: 3, sterilizedFemales: 0, males: 3, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-53', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }), // No data
    ...generateCats('colony-54', { females: 3, sterilizedFemales: 0, males: 4, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-55', { females: 4, sterilizedFemales: 0, males: 6, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-56', { females: 1, sterilizedFemales: 1, males: 1, castratedMales: 0, kittens: 0 }),
    ...generateCats('colony-57', { females: 0, sterilizedFemales: 0, males: 0, castratedMales: 0, kittens: 0 }), // No data
];

export const initialCats: Cat[] = catsData;
