import { OppgaveQuery } from 'filter/filterTsTypes';

export interface OppgavekøerV2 {
	koer: OppgavekøV2[];
}
export interface OppgavekøV2 extends OppgavekøV2Enkel {
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	saksbehandlere: string[];
	frittValgAvOppgave: boolean;
	sistEndret: string;
	antallOppgaver: string;
	versjon: number;
}

export interface OppgavekøV2Enkel {
	id: string;
	tittel: string;
	antallSaksbehandlere: number;
	sistEndret: string | null;
}

export interface OppgavekøV2MedNavn extends OppgavekøV2 {
	navn: string;
}
