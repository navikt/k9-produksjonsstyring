import { Kodeverk } from 'kodeverk/kodeverkTsType';

type Reservasjon = Readonly<{
  reservertAvUid: string;
  reservertAvNavn: string;
  reservertTilTidspunkt: string;
  oppgaveId: string;
  saksnummer: string;
  behandlingType: Kodeverk;
  tilBeslutter: boolean;
}>

export default Reservasjon;
