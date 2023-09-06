import React from 'react';
import { Oppgavefelt } from './filterTsTypes';

export type FilterContextType = {
	kriterierSomKanVelges: Oppgavefelt[];
	oppdaterFilter: (id: string, newData: any) => void;
	fjernFilter: (id: string) => void;
	leggTilFilter: (id: string) => void;
	leggTilGruppe: (id: string) => void;
};

const FilterContext = React.createContext<FilterContextType>(null);

export default FilterContext;
