import Kodeverk from 'kodeverk/kodeverkTsType';

type NyeOgFerdigstilteOppgaver = Readonly<{
  behandlingType: Kodeverk;
  fagsakYtelseType: Kodeverk;
  antallNye: number;
  antallFerdigstilte: number;
  antallFerdigstilteMine: number;
  dato: string;
}>

export default NyeOgFerdigstilteOppgaver;
