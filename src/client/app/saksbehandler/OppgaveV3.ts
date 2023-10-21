import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveStatus } from './oppgaveStatusTsType';

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	saksnummer: string;
	oppgaveEksternId: string;
	journalpostId: string;
	oppgavestatus: OppgaveStatus;
	behandlingstype: KodeverkMedNavn;
};

export default OppgaveV3;
