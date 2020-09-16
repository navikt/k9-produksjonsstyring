import { Kodeverk } from 'kodeverk/kodeverkTsType';

type BeholdningPerDato = Readonly<{
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
}>

export default BeholdningPerDato;
