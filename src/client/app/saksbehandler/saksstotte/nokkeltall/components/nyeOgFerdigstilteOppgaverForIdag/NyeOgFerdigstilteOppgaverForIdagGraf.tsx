import React, { useMemo, FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import Kodeverk from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';

import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

import {
  eChartFargerForLegendsForMineNyeFerdigstilte,
  eChartGridDef,
  eChartLegendStyle,
  eChartMaxBarWith,
  eChartTooltipTextStyle, eChartYXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../../styles/echartStyle';

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.INNSYN,
  behandlingType.ANKE,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD];

interface OwnProps {
  height: number;
  behandlingTyper: Kodeverk[];
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
  skalPunsjbehandlingerVises: boolean;
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
const NyeOgFerdigstilteOppgaverForIdagGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
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
        if (oppgave.behandlingType.kodeverk === punsjKodeverkNavn) {
          punsjAntallFerdigstilte = +oppgave[valgtProperty];
        }
      });
      return [punsjAntallFerdigstilte];
    }

    return behandlingstypeOrder.map((type) => {
      const oppgave = nyeOgFerdigstilteOppgaver.find((o) => o.behandlingType.kode === type && o.behandlingType.kodeverk !== punsjKodeverkNavn);
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
          textStyle: eChartTooltipTextStyle,
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
            fontSize: eChartYXAxisFontSizeSaksbehandlerNokkeltall,
          },
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: eChartYXAxisFontSizeSaksbehandlerNokkeltall,
            margin: 15,
          },
          data: behandlingTypeNavnForYAkse,
        },
        series: [
          {
            name: nyLabel,
            type: 'bar',
            data: dataNye,
            barMaxWidth: eChartMaxBarWith,
          },
          {
            name: ferdigLabel,
            type: 'bar',
            data: dataFerdigstilte,
            barMaxWidth: eChartMaxBarWith,
          },
          {
            name: mineFerdigeLabel,
            type: 'bar',
            data: dataMineFerdigstilte,
            barMaxWidth: eChartMaxBarWith,
          },
        ],
        color: eChartFargerForLegendsForMineNyeFerdigstilte,
      }}
    />
  );
};

export default injectIntl(NyeOgFerdigstilteOppgaverForIdagGraf);
