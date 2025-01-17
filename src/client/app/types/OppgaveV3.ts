import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveNøkkel } from './OppgaveNøkkel';

export enum OppgavestatusV3 {
	AAPEN = 'AAPEN',
	VENTER = 'VENTER',
	LUKKET = 'LUKKET',
}

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	behandlingstype: KodeverkMedNavn;
	opprettetTidspunkt?: string;
	saksnummer: string;
	oppgaveNøkkel: OppgaveNøkkel;
	journalpostId: string;
	oppgavestatus: OppgavestatusV3;
	oppgavebehandlingsUrl: string;
};

export default OppgaveV3;
