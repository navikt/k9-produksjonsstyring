import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveStatus } from '../saksbehandler/oppgaveStatusTsType';
import { OppgaveNøkkel } from './OppgaveNøkkel';

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	saksnummer: string;
	journalpostId: string;
	oppgavebehandlingsUrl: string;
	oppgavestatus: OppgaveStatus;
	behandlingstype: KodeverkMedNavn;
	oppgaveNøkkel: OppgaveNøkkel;
};

export default OppgaveV3;
