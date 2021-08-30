import moment from 'moment';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import NyeOgFerdigstilteMedStonadstype from 'avdelingsleder/nokkeltall/nyeOgFerdigstilteMedStonadstypeTsType';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import punsjBehandlingstyper from '../../types/PunsjBehandlingstyper';
import omsorgsdagerYtelsetyper from '../../types/OmsorgsdagerYtelsetyper';

export const ALLE_YTELSETYPER_VALGT = 'ALLE';
export const UKE_4 = '4';
export const UKE_2 = '2';

export const ytelseTyper = [{
  kode: fagsakYtelseType.OMSORGSPENGER,
  navn: 'Omsorgspenger',
},
{
  kode: fagsakYtelseType.OMSORGSDAGER,
  navn: 'Omsorgsdager',
},
{
  kode: fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  navn: 'Pleiepenger sykt barn',
},
{
  kode: fagsakYtelseType.PUNSJ,
  navn: 'Punsj',
},
{
  kode: ALLE_YTELSETYPER_VALGT,
  navn: 'Alle ytelser',
}];

export const uker = [{
  kode: UKE_4,
  tekstKode: 'TilBehandlingPanel.FireSisteUker',
}, {
  kode: '8',
  tekstKode: 'TilBehandlingPanel.8SisteUker',
}];

export const behandlingstypeOrder = [
  behandlingType.FORSTEGANGSSOKNAD,
  behandlingType.REVURDERING,
  behandlingType.ANKE,
  behandlingType.INNSYN,
  behandlingType.KLAGE,
];

export const erDatoInnenforPeriode = (oppgaveForAvdeling, ukevalg) => {
  if (ukevalg === uker[1].kode) {
    return true;
  }
  const fireUkerSiden = moment().subtract(4, 'w');
  return moment(oppgaveForAvdeling.dato).isSameOrAfter(fireUkerSiden);
};

export const slaSammenLikeBehandlingstyperOgDatoer = (oppgaver) => {
  const sammenslatte = [];

  oppgaver.forEach((o) => {
    const index = sammenslatte.findIndex((s) => s.behandlingType.kode === o.behandlingType.kode && s.dato === o.dato);
    if (index === -1) {
      sammenslatte.push(o);
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        dato: sammenslatte[index].dato,
        antall: sammenslatte[index].antall + o.antall,
      };
    }
  });

  return sammenslatte;
};

export const slaSammenLikeFagsakstyperOgDatoer = (oppgaver) => {
  const sammenslatte = [];

  oppgaver.forEach((o) => {
    const index = sammenslatte.findIndex((s) => s.behandlingType.kode === o.behandlingType.kode && s.dato === o.dato);
    if (index === -1) {
      sammenslatte.push(o);
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        dato: sammenslatte[index].dato,
        antallNye: sammenslatte[index].antallNye + o.antallNye,
        antallFerdigstilte: sammenslatte[index].antallFerdigstilte + o.antallFerdigstilte,
        antallFerdigstilteMine: sammenslatte[index].antallFerdigstilteMine + o.antallFerdigstilteMine,
      };
    }
  });

  return sammenslatte;
};

export const slaSammenAllePunsjBehandlingstyper = (oppgaver) => {
  const sammenslatte = [];

  oppgaver.forEach((o) => {
    const index = sammenslatte.findIndex((s) => s.behandlingType.kodeverk === 'PUNSJ_INNSENDING_TYPE' && s.dato === o.dato);
    if (index === -1) {
      sammenslatte.push(o);
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        dato: sammenslatte[index].dato,
        antallNye: sammenslatte[index].antallNye + o.antallNye,
        antallFerdigstilte: sammenslatte[index].antallFerdigstilte + o.antallFerdigstilte,
        antallFerdigstilteMine: sammenslatte[index].antallFerdigstilteMine + o.antallFerdigstilteMine,
      };
    }
  });

  return sammenslatte;
};

export const sjekkOmOppgaveSkalLeggesTil = (
  ytelse: string,
  oppgave: NyeOgFerdigstilteMedStonadstype | HistoriskData | AlleOppgaver | NyeOgFerdigstilteOppgaver,
): boolean => {
  switch (ytelse) {
    case fagsakYtelseType.PUNSJ:
      return punsjBehandlingstyper.includes(oppgave.behandlingType.kode);
    case fagsakYtelseType.OMSORGSDAGER: return omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType.kode);
    case ALLE_YTELSETYPER_VALGT: {
      return !punsjBehandlingstyper.includes(oppgave.behandlingType.kode)
        && (omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType.kode)
          || oppgave.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER
          || oppgave.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN);
    }
    default:
      return ytelse === oppgave.fagsakYtelseType.kode && !punsjBehandlingstyper.includes(oppgave.behandlingType.kode);
  }
};
