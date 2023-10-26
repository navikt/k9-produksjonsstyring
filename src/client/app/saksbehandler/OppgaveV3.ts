import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveStatus } from './oppgaveStatusTsType';

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	saksnummer: string;
	journalpostId: string;
	oppgavebehandlingsUrl: string;
	oppgavestatus: OppgaveStatus;
	behandlingstype: KodeverkMedNavn;
	oppgaveNøkkel: {
		områdeEksternId: string;
		oppgaveEksternId: string;
		oppgaveTypeEksternId: string;
	};
};

export default OppgaveV3;
