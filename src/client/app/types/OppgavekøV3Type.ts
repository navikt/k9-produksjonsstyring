import { OppgaveQuery } from 'filter/filterTsTypes';

export interface OppgavekøerV3 {
	koer: OppgavekøV3[];
}
export interface OppgavekøV3 extends OppgavekøV3Enkel {
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	saksbehandlere: string[];
	frittValgAvOppgave: boolean;
	sistEndret: string;
	antallOppgaver: string;
	versjon: number;
}

export interface OppgavekøV3Enkel {
	id: string;
	tittel: string;
	antallSaksbehandlere: number;
	sistEndret: string | null;
}

export interface OppgavekøV3MedNavn extends OppgavekøV3 {
	navn: string;
}
