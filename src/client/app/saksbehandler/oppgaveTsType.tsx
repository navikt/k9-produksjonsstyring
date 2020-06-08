import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { OppgaveStatus } from './oppgaveStatusTsType';

type Oppgave = {
  status: OppgaveStatus;
  saksnummer: string;
  behandlingId: number;
  personnummer: string;
  navn: string;
  system: string;
  behandlingstype: Kodeverk;
  behandlingStatus: Kodeverk;
  opprettetTidspunkt: string;
  behandlingsfrist: string;
  fagsakYtelseType: Kodeverk;
  erTilSaksbehandling: boolean;
  eksternId: string;
};

export default Oppgave;
