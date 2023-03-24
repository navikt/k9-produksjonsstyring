import { OppgaveQuery } from 'filter/filterTsTypes';

export interface OppgavekøV2 {
	id: number;
	tittel: string;
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	saksbehandlere: string[];
	sistEndret: string;
	antallOppgaver: string;
	versjon: number;
}
