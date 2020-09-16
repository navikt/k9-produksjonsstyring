import { Kodeverk } from 'kodeverk/kodeverkTsType';

type NyeOgFerdigstilteOppgaver = Readonly<{
  behandlingType: Kodeverk;
  antallNye: number;
  antallFerdigstilte: number;
  antallFerdigstilteMine: number;
  dato: string;
}>

export default NyeOgFerdigstilteOppgaver;
