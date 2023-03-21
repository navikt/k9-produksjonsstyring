import { OppgaveQuery } from 'filter/filterTsTypes';

export interface Kødefinisjon {
	id: number;
	tittel: string;
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	saksbehandlere: string[];
	sistEndret: string;
	antallOppgaver: string;
	versjon: number;
}
