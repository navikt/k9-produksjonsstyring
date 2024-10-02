import OppgaveV3, { OppgavestatusV3 } from 'types/OppgaveV3';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

interface BaseReservasjonV3 {
	reservertAvIdent: string;
	reservertAvEpost: string;
	reservertAvNavn?: string;
	reservertFra: string;
	reservertTil: string;
	endretAvNavn?: string;
}

interface ReservasjonV3 extends BaseReservasjonV3 {
	reserverteV3Oppgaver: OppgaveV3[];
	reservertOppgaveV1Dto?: Oppgave;
	kommentar: string;
}

export interface ReservasjonV3FraKøDto extends BaseReservasjonV3 {
	oppgaveNøkkelDto: OppgaveNøkkel;
	reservasjonsnøkkel: string;
	oppgavebehandlingsUrl: string;
}

export type MappedReservasjon = (Oppgave | OppgaveV3) &
	Pick<ReservasjonV3, 'reservertAvIdent' | 'reservertAvEpost' | 'kommentar' | 'reservertFra' | 'reservertTil'>;

function pickReservasjonProperties(reservasjon: ReservasjonV3) {
	const { reservertAvIdent, kommentar, reservertFra, reservertTil, reservertAvEpost } = reservasjon;
	return { reservertAvIdent, kommentar, reservertFra, reservertTil, reservertAvEpost };
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
		return reservasjon.reserverteV3Oppgaver
			.filter((v) => v.oppgavestatus === OppgavestatusV3.AAPEN)
			.map(
				(oppgave): MappedReservasjon => ({
					...(oppgave as MappedReservasjon),
					...pickReservasjonProperties(reservasjon),
				}),
			);
	});
}

export default ReservasjonV3;
