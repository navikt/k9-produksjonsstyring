import { OppgaveStatus } from './oppgaveStatusTsType';

type OppgaveV3 = {
	søkersNavn: string;
	søkersPersonnr: string;
	saksnummer: string;
	oppgaveEksternId: string;
	journalpostId: string;
	oppgavestatus: OppgaveStatus;
};

export default OppgaveV3;
