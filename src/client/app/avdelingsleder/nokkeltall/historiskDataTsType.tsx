import Kodeverk from 'kodeverk/kodeverkTsType';

type HistoriskData = Readonly<{
  fagsakYtelseType: Kodeverk;
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
  enhet?: string;
}>;

export default HistoriskData;
