/* eslint-disable no-use-before-define */

export type Oppgavefilter = {
	type: string;
};

export type FeltverdiOppgavefilter = Oppgavefilter & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
	operator: string;
	verdi: string | string[];
};

export type CombineOppgavefilter = Oppgavefilter &
	FilterContainer & {
		combineOperator: string;
	};

export type FilterType = FeltverdiOppgavefilter | CombineOppgavefilter;

export type FilterContainer = {
	id: string;
	filtere: FilterType[];
};

export type OppgaveQuery = FilterContainer & {
	select: EnkelSelectFelt[];
	order: EnkelOrderFelt[];
	limit: number;
};

export type OrderFelt = {
	type: string;
};

export type EnkelOrderFelt = OrderFelt & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
	økende: boolean;
};

export type SelectFelt = {
	type: string;
};

export type EnkelSelectFelt = SelectFelt & {
	id: string;
	område: string;
	kode: OppgavefilterKode;
};

export type Oppgavefeltverdi = {
	område: string;
	kode: OppgavefilterKode;
	verdi: string | string[];
};

export type Oppgaverad = {
	id?: string;
	felter: Oppgavefeltverdi[];
};

export type Verdiforklaring = {
	verdi: string;
	visningsnavn: string;
	sekundærvalg: boolean;
};

export enum TolkesSom {
	String = 'String',
	Duration = 'Duration',
	Boolean = 'boolean',
	Timestamp = 'Timestamp',
}
export type Oppgavefelt = {
	område: string;
	kode: OppgavefilterKode;
	visningsnavn: string;
	kokriterie: boolean;
	tolkes_som: TolkesSom;
	verdiforklaringerErUttømmende: boolean;
	verdiforklaringer: Verdiforklaring[] | null;
};

export enum OppgavefilterKode {
	Antall = 'Antall',
	AkkumulertVentetidAnnetForTidligereVersjoner = 'akkumulertVentetidAnnetForTidligereVersjoner',
	AkkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner = 'akkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner',
	AkkumulertVentetidArbeidsgiverForTidligereVersjoner = 'akkumulertVentetidArbeidsgiverForTidligereVersjoner',
	AkkumulertVentetidSaksbehandlerForTidligereVersjoner = 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
	AkkumulertVentetidSøkerForTidligereVersjoner = 'akkumulertVentetidSøkerForTidligereVersjoner',
	AkkumulertVentetidTekniskFeilForTidligereVersjoner = 'akkumulertVentetidTekniskFeilForTidligereVersjoner',
	Aksjonspunkt = 'aksjonspunkt',
	AktivVentefrist = 'aktivVentefrist',
	AktivVenteårsak = 'aktivVenteårsak',
	AktivtAksjonspunkt = 'aktivtAksjonspunkt',
	AktorId = 'aktorId',
	AnsvarligBeslutter = 'ansvarligBeslutter',
	AnsvarligSaksbehandler = 'ansvarligSaksbehandler',
	AvventerAnnet = 'avventerAnnet',
	AvventerAnnetIkkeSaksbehandlingstid = 'avventerAnnetIkkeSaksbehandlingstid',
	AvventerArbeidsgiver = 'avventerArbeidsgiver',
	AvventerSaksbehandler = 'avventerSaksbehandler',
	AvventerSøker = 'avventerSøker',
	AvventerTekniskFeil = 'avventerTekniskFeil',
	BehandlendeEnhet = 'behandlendeEnhet',
	BehandlingTypekode = 'behandlingTypekode',
	BehandlingUuid = 'behandlingUuid',
	Behandlingsstatus = 'behandlingsstatus',
	Behandlingssteg = 'behandlingssteg',
	Fagsystem = 'fagsystem',
	FraEndringsdialog = 'fraEndringsdialog',
	Hastesak = 'hastesak',
	HelautomatiskBehandlet = 'helautomatiskBehandlet',
	Kildeområde = 'kildeområde',
	LøsbartAksjonspunkt = 'løsbartAksjonspunkt',
	MottattDato = 'mottattDato',
	NyeKrav = 'nyeKrav',
	Oppgaveområde = 'oppgaveområde',
	Oppgavestatus = 'oppgavestatus',
	Oppgavetype = 'oppgavetype',
	PleietrengendeAktorId = 'pleietrengendeAktorId',
	PåklagdBehandlingUuid = 'påklagdBehandlingUuid',
	RegistrertDato = 'registrertDato',
	RelatertPartAktorid = 'relatertPartAktorid',
	Resultattype = 'resultattype',
	Saksnummer = 'saksnummer',
	Totrinnskontroll = 'totrinnskontroll',
	Vedtaksdato = 'vedtaksdato',
	Ytelsestype = 'ytelsestype',
}
