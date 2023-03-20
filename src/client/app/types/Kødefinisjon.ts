import { OppgaveQuery } from 'filter/filterTsTypes';

export interface Kødefinisjon {
	id: number;
	tittel: string;
	oppgaveQuery: OppgaveQuery;
	saksbehandlere: string[];
	versjon: number;
}
