import { Kodeverk } from 'kodeverk/kodeverkTsType';

type HistoriskData = Readonly<{
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
}>

export default HistoriskData;
