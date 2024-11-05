import { OppgaveQuery } from 'filter/filterTsTypes';

export interface OppgaveKoIdOgTittel {
	id: number;
	tittel: string;
}
export interface OppgavekøV3Enkel {
	id: number;
	tittel: string;
	sistEndret: string | null;
	antallSaksbehandlere: number;
}
export interface OppgavekøV3 {
	id: number;
	versjon: number;
	tittel: string;
	beskrivelse: string;
	oppgaveQuery: OppgaveQuery;
	frittValgAvOppgave: boolean;
	saksbehandlere: string[];
	endretTidspunkt: string | undefined;
	skjermet: boolean;
}
export interface OppgavekøerV3 {
	koer: OppgavekøV3[];
}

export interface OppgavekøV3MedNavn extends OppgavekøV3 {
	navn: string;
}
