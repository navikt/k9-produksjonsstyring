import OppgaveV3 from 'types/OppgaveV3';
import Oppgave from 'saksbehandler/oppgaveTsType';

interface ReservasjonV3 {
	reserverteV3Oppgaver: OppgaveV3[];
	reservertOppgaveV1Dto?: Oppgave;
	reservertAv: string;
	kommentar: string;
	reservertFra: Date;
	reservertTil?: Date;
}
export default ReservasjonV3;
