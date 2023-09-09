import React from 'react';
import { OppgaveQuery } from './filterTsTypes';

export type FilterContextType = {
	oppdaterFilter: (id: string, newData: any) => void;
	fjernFilter: (id: string) => void;
	leggTilFilter: (id: string) => void;
	leggTilGruppe: (id: string) => void;
};

export type OrderContextType = {
	oppgaveQuery: OppgaveQuery;
	oppdaterSortering: (id: string, newData: any) => void;
	fjernSortering: (id: string) => void;
	leggTilSortering: (data?: any) => void;
	nullstillOgLeggTilSortering: (data?: any) => void;
	nullstillSortering: () => void;
};

export const FilterContext = React.createContext<FilterContextType>(null);
export const OrderContext = React.createContext<OrderContextType>(null);
