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

export enum fagytelsetyperForOppgaveFiltrering {
  OMSORGSPENGER = 'Omsorgspenger',
  OMSORGSDAGER = 'Omsorgsdager',
  PLEIEPENGER_SYKT_BARN = 'Pleiepenger',
  PUNSJ = 'Punsj',
  ALLE_YTELSETYPER_VALGT = 'Alle ytelser'
}
