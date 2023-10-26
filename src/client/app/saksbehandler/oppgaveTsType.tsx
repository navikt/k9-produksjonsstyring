import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveStatus } from './oppgaveStatusTsType';

type Oppgave = {
	status: OppgaveStatus;
	saksnummer: string;
	behandlingId: number;
	journalpostId: string;
	personnummer: string;
	oppgaveNøkkel: OppgaveNøkkel;
	merknad: {
		merknadKoder: string[];
		fritekst: string;
	};
	navn: string;
	system: string;
	behandlingstype: KodeverkMedNavn;
	behandlingStatus: string;
	opprettetTidspunkt: string;
	behandlingsfrist: string;
	fagsakYtelseType: string;
	fagsakPeriode?: {
		fom: string;
		tom: string;
	};
	erTilSaksbehandling: boolean;
	eksternId: string;
	paaVent?: boolean;
	tilBeslutter?: boolean;
	utbetalingTilBruker?: boolean;
	avklarArbeidsforhold?: boolean;
	selvstendigFrilans?: boolean;
	søktGradering?: boolean;
};

export default Oppgave;
