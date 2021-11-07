import React, {
  useState, useMemo, useCallback, FunctionComponent, useRef,
} from 'react';
import {
  XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalRectSeries, Hint, DiscreteColorLegend,
} from 'react-vis';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import Kodeverk from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';

import { cssText } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import Oppgave from 'saksbehandler/oppgaveTsType';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

import 'react-vis/dist/style.css';
import styles from './nyeOgFerdigstilteOppgaverForIdagGraf.less';
import punsjBehandlingstyper from '../../../../../types/PunsjBehandlingstyper';
import { eChartGridDef, eChartLegendStyle } from '../../../../../../styles/echartStyle';

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.INNSYN,
  behandlingType.ANKE,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD];

interface Koordinat {
  x: number;
  y: number;
}

const settCustomHoydePaSoylene = (data, over) => {
  const transformert = data.map((el) => ({
    ...el,
    y0: el.y + (over ? 0.15 : -0.13),
    y: el.y + (over ? -0.07 : -0.35),
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

const settCustomHoydePaSoylene2 = (data) => {
  const transformert = data.map((el) => ({
    ...el,
    y0: el.y + 0.41,
    y: el.y + 0.21,
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

export const punsjYKoordinat = 3;

const lagDatastrukturForFerdigstilte = (
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[],
  skalPunsjVises: boolean,
): Koordinat[] => settCustomHoydePaSoylene(
  nyeOgFerdigstilteOppgaver.map((value) => ({
    x: value.antallFerdigstilte,
    y: skalPunsjVises ? punsjYKoordinat : behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), true,
);

const lagDatastrukturForNye = (nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[], skalPunsjVises: boolean): Koordinat[] => settCustomHoydePaSoylene2(
  nyeOgFerdigstilteOppgaver.map((value) => ({
    x: value.antallNye,
    y: skalPunsjVises ? punsjYKoordinat : behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })),
);

export const lagDatastrukturForFerdigstilteMine = (
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[],
  skalPunsjVises: boolean,
): Koordinat[] => settCustomHoydePaSoylene(nyeOgFerdigstilteOppgaver
  .map((value) => ({
    x: value.antallFerdigstilteMine,
    y: skalPunsjVises ? punsjYKoordinat : behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), false);

interface OwnProps {
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
  skalPunsjbehandlingerVises: boolean;
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
const NyeOgFerdigstilteOppgaverForIdagEchartGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  nyeOgFerdigstilteOppgaver,
  behandlingTyper,
  skalPunsjbehandlingerVises,
}) => {
  const behandlingTypeNavnForYAkse = useMemo(() => {
    if (skalPunsjbehandlingerVises) {
      return ['Punsj'];
    }
    return behandlingstypeOrder.map((bType) => {
      if (bType === behandlingType.FORSTEGANGSSOKNAD) {
        return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Førstegangsbehandling' });
      }
      const type = behandlingTyper.find((bt) => bt.kode === bType);
      return type ? type.navn : '';
    });
  }, [behandlingTyper, skalPunsjbehandlingerVises]);

  const ferdigLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Ferdigstilte' });
  const nyLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Nye' });
  const mineFerdigeLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.FerdigstilteMine' });

  const filtrereUtRelevanteOppgaver = (valgtProperty: string): number[] => {
    if (skalPunsjbehandlingerVises) {
      let punsjAntallFerdigstilte = 0;
      nyeOgFerdigstilteOppgaver.forEach((oppgave) => {
        if (oppgave.behandlingType.kodeverk === 'PUNSJ_INNSENDING_TYPE') {
          punsjAntallFerdigstilte = +oppgave[valgtProperty];
        }
      });
      return [punsjAntallFerdigstilte];
    }

    return behandlingstypeOrder.map((type) => {
      const oppgave = nyeOgFerdigstilteOppgaver.find((o) => o.behandlingType.kode === type && o.behandlingType.kodeverk !== 'PUNSJ_INNSENDING_TYPE');
      if (oppgave) {
        return oppgave[valgtProperty];
      }
      return 0;
    });
  };

  const dataFerdigstilte = useMemo(() => filtrereUtRelevanteOppgaver('antallFerdigstilte'), [nyeOgFerdigstilteOppgaver]);
  const dataNye = useMemo(() => filtrereUtRelevanteOppgaver('antallNye'), [nyeOgFerdigstilteOppgaver]);
  const dataMineFerdigstilte = useMemo(() => filtrereUtRelevanteOppgaver('antallFerdigstilteMine'), [nyeOgFerdigstilteOppgaver]);

  return (
    <ReactECharts
      height={height}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 16,
          },
        },
        legend: {
          ...eChartLegendStyle,
          data: [ferdigLabel, nyLabel, mineFerdigeLabel],
        },
        grid: eChartGridDef,
        xAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            fontSize: 15,
          },
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: 15,
            margin: 15,
          },
          data: behandlingTypeNavnForYAkse,
        },
        series: [
          {
            name: nyLabel,
            type: 'bar',
            data: dataNye,
            barMaxWidth: 8,
          },
          {
            name: ferdigLabel,
            type: 'bar',
            data: dataFerdigstilte,
            barMaxWidth: 8,
          },
          {
            name: mineFerdigeLabel,
            type: 'bar',
            data: dataMineFerdigstilte,
            barMaxWidth: 8,
          },
        ],
        color: ['#0067C5', '#634689', '#FF9100'],
      }}
    />
  );
};

export default injectIntl(NyeOgFerdigstilteOppgaverForIdagEchartGraf);
