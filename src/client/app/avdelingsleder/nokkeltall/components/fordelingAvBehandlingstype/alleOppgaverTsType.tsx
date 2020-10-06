import Kodeverk from 'kodeverk/kodeverkTsType';

type AlleOppgaver = Readonly<{
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  tilBehandling: boolean;
  antall: number;
}>;

export default AlleOppgaver;
