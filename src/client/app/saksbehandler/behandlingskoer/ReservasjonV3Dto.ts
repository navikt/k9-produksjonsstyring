import OppgaveV3 from 'saksbehandler/OppgaveV3';
import Oppgave from 'saksbehandler/oppgaveTsType';

interface ReservasjonV3 {
	reserverteV3Oppgaver: OppgaveV3[];
	reservertOppgaveV1Dto?: Oppgave;
	reservasjonsnøkkel: string;
	reservertAv: string;
	kommentar: string;
	reservertFra: Date;
	reservertTil?: Date;
}
export default ReservasjonV3;
