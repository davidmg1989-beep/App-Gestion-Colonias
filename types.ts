export interface Colony {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    description: string;
}

export interface Cat {
    id:string;
    colonyId: string;
    name: string;
    gender: 'Macho' | 'Hembra';
    age: 'Cachorro' | 'Adulto';
    isSterilized: boolean;
    isChipped: boolean;
    chipNumber?: string;
    photoUrl: string;
    description: string;
    diseases: string[];
    vetVisits: VetVisit[];
}

export interface VetVisit {
    id: string;
    date: string;
    reason: string;
    notes: string;
}

export type View =
    | { type: 'dashboard' }
    | { type: 'colony'; colonyId: string }
    | { type: 'cat'; catId: string; colonyId: string };
