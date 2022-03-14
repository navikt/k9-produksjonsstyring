type HistoriskData = Readonly<{
  fagsakYtelseType: string;
  behandlingType: string;
  dato: string;
  antall: number;
  enhet?: string;
}>;

export default HistoriskData;
