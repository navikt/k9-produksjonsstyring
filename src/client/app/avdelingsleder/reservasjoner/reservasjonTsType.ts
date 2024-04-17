import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

type Reservasjon = Readonly<{
	oppgavenøkkel: OppgaveNøkkel;
	reservertAvEpost: string;
	reservertTilTidspunkt: string;
	saksnummer: string;
	behandlingType: KodeverkMedNavn;
	kommentar?: string;
}>;

export default Reservasjon;

// val reservertAvEpost: String,
// val saksnummer: String,
// val behandlingType: BehandlingType,
// val reservertTilTidspunkt: LocalDateTime,
// val oppgavenøkkel: OppgaveNøkkelDto,
