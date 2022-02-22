import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import behandlingType from 'kodeverk/behandlingType';
import NyeOgFerdigstilteMedStonadstype from 'avdelingsleder/nokkeltall/nyeOgFerdigstilteMedStonadstypeTsType';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import dayjs from 'dayjs';
import punsjBehandlingstyper from '../../types/PunsjBehandlingstyper';
import omsorgsdagerYtelsetyper from '../../types/OmsorgsdagerYtelsetyper';

export const ALLE_YTELSETYPER_VALGT = 'ALLE';
export const punsjKodeverkNavn = 'PUNSJ_INNSENDING_TYPE';
export const UKE_4 = '4';
export const UKE_2 = '2';

export const ytelseTyper = [
  {
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
  },
];

export const uker = [
  {
    kode: UKE_2,
    tekstKode: 'Historikk.ToSisteUker',
  },
  {
    kode: UKE_4,
    tekstKode: 'Historikk.FireSisteUker',
  },
];

export const fremtidigeUker = [
  {
    kode: UKE_2,
    tekstKode: 'BehandlingerGårAvVent.ToNesteUker',
  },
  {
    kode: UKE_4,
    tekstKode: 'BehandlingerGårAvVent.FireNesteUker',
  },
];

export const behandlingstypeOrder = [
  behandlingType.FORSTEGANGSSOKNAD,
  behandlingType.REVURDERING,
  // behandlingType.ANKE,
  behandlingType.INNSYN,
  // behandlingType.KLAGE,
  behandlingType.TILBAKEBETALING,
];

export const erDatoInnenforPeriode = (oppgaveForAvdeling, ukevalg) => {
  if (ukevalg === uker[1].kode) {
    return true;
  }
  const fireUkerSiden = dayjs().subtract(4, 'w');
  return dayjs(oppgaveForAvdeling.dato).isSameOrAfter(fireUkerSiden);
};

export const slaSammenLikeBehandlingstyperOgDatoer = (oppgaver: HistoriskData[]) => {
  const sammenslatte = [];

  oppgaver.forEach(o => {
    if (o.behandlingType.kodeverk === punsjKodeverkNavn) {
      return;
    }
    const index = sammenslatte.findIndex(s => s.behandlingType.kode === o.behandlingType.kode && s.dato === o.dato);
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

export const slaSammenLikeBehandlingstyperForNyeOgFerdigstilleOppgaver = (oppgaver: NyeOgFerdigstilteOppgaver[]) => {
  const sammenslatte = [];

  oppgaver.forEach(o => {
    const index = sammenslatte.findIndex(s => s.behandlingType.kode === o.behandlingType.kode && s.dato === o.dato);
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

export const slaSammenAllePunsjBehandlingstyperForNyeOgFerdigstilleOppgaver = (
  oppgaver: NyeOgFerdigstilteOppgaver[],
) => {
  const sammenslatte = [];

  oppgaver.forEach(o => {
    if (o.behandlingType.kodeverk !== punsjKodeverkNavn) {
      return;
    }
    const index = sammenslatte.findIndex(
      s =>
        s.behandlingType.kodeverk === punsjKodeverkNavn &&
        s.fagsakYtelseType.kode === o.fagsakYtelseType.kode &&
        s.dato === o.dato,
    );
    if (index === -1) {
      sammenslatte.push(o);
    } else {
      sammenslatte[index] = {
        behandlingType: sammenslatte[index].behandlingType,
        fagsakYtelseType: sammenslatte[index].fagsakYtelseType,
        dato: sammenslatte[index].dato,
        antallNye: sammenslatte[index].antallNye + o.antallNye,
        antallFerdigstilte: sammenslatte[index].antallFerdigstilte + o.antallFerdigstilte,
        antallFerdigstilteMine: sammenslatte[index].antallFerdigstilteMine + o.antallFerdigstilteMine,
      };
    }
  });

  return sammenslatte;
};

export const slaSammenPunsjBehandlingstyperOgDatoer = (oppgaver: HistoriskData[]) => {
  const sammenslatte = [];

  oppgaver.forEach(o => {
    if (o.behandlingType.kodeverk !== punsjKodeverkNavn) {
      return;
    }
    const index = sammenslatte.findIndex(
      s =>
        s.behandlingType.kode === 'PUNSJ' && s.dato === o.dato && s.fagsakYtelseType.kode === o.fagsakYtelseType.kode,
    );
    if (index === -1) {
      sammenslatte.push({
        fagsakYtelseType: o.fagsakYtelseType,
        behandlingType: {
          kode: 'PUNSJ',
          navn: 'PUNSJ',
        },
        dato: o.dato,
        antall: o.antall,
      });
    } else {
      sammenslatte[index] = {
        fagsakYtelseType: o.fagsakYtelseType,
        behandlingType: {
          kode: 'PUNSJ',
          navn: 'PUNSJ',
        },
        dato: sammenslatte[index].dato,
        antall: sammenslatte[index].antall + o.antall,
      };
    }
  });

  return sammenslatte;
};

export const sjekkOmOppgaveSkalLeggesTil = (
  ytelse: string,
  oppgave: NyeOgFerdigstilteMedStonadstype | HistoriskData | AlleOppgaver | NyeOgFerdigstilteOppgaver,
): boolean => {
  // Skal ikke ta med klage og anke sedan det ikke er en del av LOS ännu.
  if (oppgave.behandlingType.kode === behandlingType.KLAGE || oppgave.behandlingType.kode === behandlingType.ANKE) {
    return false;
  }
  switch (ytelse) {
    case fagsakYtelseType.PUNSJ:
      return punsjBehandlingstyper.includes(oppgave.behandlingType.kode);
    case fagsakYtelseType.OMSORGSDAGER:
      return omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType.kode);
    case ALLE_YTELSETYPER_VALGT: {
      return (
        !punsjBehandlingstyper.includes(oppgave.behandlingType.kode) &&
        (omsorgsdagerYtelsetyper.includes(oppgave.fagsakYtelseType.kode) ||
          oppgave.fagsakYtelseType.kode === fagsakYtelseType.OMSORGSPENGER ||
          oppgave.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER_SYKT_BARN)
      );
    }
    default:
      return ytelse === oppgave.fagsakYtelseType.kode && !punsjBehandlingstyper.includes(oppgave.behandlingType.kode);
  }
};

export const filtrereNyePerDato = (
  ytelseType: string,
  ukevalg: string,
  nyePerDato: HistoriskData[],
): HistoriskData[] => {
  if (nyePerDato) {
    if (ytelseType === 'PUNSJ') {
      return slaSammenPunsjBehandlingstyperOgDatoer(
        nyePerDato
          .filter(ofa => sjekkOmOppgaveSkalLeggesTil(ytelseType, ofa))
          .filter(ofa => erDatoInnenforPeriode(ofa, ukevalg)),
      );
    }
    return slaSammenLikeBehandlingstyperOgDatoer(
      nyePerDato
        .filter(ofa => sjekkOmOppgaveSkalLeggesTil(ytelseType, ofa))
        .filter(ofa => erDatoInnenforPeriode(ofa, ukevalg)),
    );
  }
  return [];
};
