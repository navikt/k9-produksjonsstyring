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

export type MappedReservasjon = (Oppgave | OppgaveV3) &
	Pick<ReservasjonV3, 'reservertAv' | 'kommentar' | 'reservertFra' | 'reservertTil'>;

function pickReservasjonProperties(reservasjon: ReservasjonV3) {
	const { reservertAv, kommentar, reservertFra, reservertTil } = reservasjon;
	return { reservertAv, kommentar, reservertFra, reservertTil };
}

export function mapReservasjonV3Array(reservasjonV3Array: ReservasjonV3[]): MappedReservasjon[] {
	return reservasjonV3Array.flatMap((reservasjon): MappedReservasjon[] => {
		if (reservasjon.reservertOppgaveV1Dto) {
			return [
				{
					...(reservasjon.reservertOppgaveV1Dto as MappedReservasjon),
					...pickReservasjonProperties(reservasjon),
				},
			];
		}
		return reservasjon.reserverteV3Oppgaver.map(
			(oppgave): MappedReservasjon => ({
				...(oppgave as MappedReservasjon),
				...pickReservasjonProperties(reservasjon),
			}),
		);
	});
}

export default ReservasjonV3;
