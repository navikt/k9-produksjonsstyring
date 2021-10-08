import moment from 'moment';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';

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

export const cssText = {
  fontFamily: 'Source Sans Pro, Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
};

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
