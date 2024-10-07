type OppgaveNøkkelDto = {
	områdeEksternId: string;
	oppgaveEksternId: string;
	oppgaveTypeEksternId: string;
};

type KodeverkMedNavn = {
	kode: string;
	navn: string;
	kodeverk: string;
};

type Oppgavestatus = {
	kode: 'AAPEN' | 'VENTER' | 'LUKKET';
	navn: string;
};

type Behandlingsstatus = {
	kode: string;
	navn: string;
};

export type SøkeboksOppgaveDto = {
	navn: string;
	fnr: string;
	kjønn: string;
	dødsdato?: string;
	ytelsestype: KodeverkMedNavn;
	behandlingstype: KodeverkMedNavn;
	saksnummer: string | undefined;
	oppgaveNøkkel: OppgaveNøkkelDto;
	hastesak: boolean;
	journalpostId: string | undefined;
	opprettetTidspunkt: string | undefined;
	oppgavestatus: Oppgavestatus;
	behandlingsstatus?: Behandlingsstatus;
	oppgavebehandlingsUrl: string | undefined;
	reservasjonsnøkkel: string;
	reservertAvSaksbehandlerNavn: string | undefined;
	reservertAvSaksbehandlerIdent: string | undefined;
	reservertTom: string | undefined;
};
