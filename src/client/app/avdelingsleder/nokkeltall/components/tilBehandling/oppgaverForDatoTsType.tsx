import { Kodeverk } from 'kodeverk/kodeverkTsType';

type OppgaveForDato = Readonly<{
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
}>

export default OppgaveForDato;
