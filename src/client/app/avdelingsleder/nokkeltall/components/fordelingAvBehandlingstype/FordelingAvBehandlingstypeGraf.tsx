import React, {
  useMemo, FunctionComponent,
} from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl';

import behandlingType from 'kodeverk/behandlingType';
import { cssText } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import Kodeverk from 'kodeverk/kodeverkTsType';
import { dateFormat } from 'avdelingsleder/nokkeltall/HistorikkGraf';
import { punsjYKoordinat } from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagGraf';
import AlleOppgaver from './alleOppgaverTsType';

import {
  eChartFargerForLegendsFordelingAvBehandlingstype, eChartGrafHeight,
  eChartGridDef,
  eChartLegendStyle, eChartMaxBarWith, eChartMaxBarWithFordelingAvBehandlingstype,
  eChartTooltipTextStyle,
  eChartYXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../styles/echartStyle';

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.ANKE,
  behandlingType.INNSYN,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD,
];

const slåSammen = (oppgaverForAvdeling: AlleOppgaver[], erPunsjValgt: boolean): number[] => {
  const test = oppgaverForAvdeling
    .reduce((acc, o) => {
      const index = erPunsjValgt ? 1 : behandlingstypeOrder.findIndex((bo) => bo === o.behandlingType.kode) + 1;
      if ((erPunsjValgt && o.behandlingType.kodeverk === 'PUNSJ_INNSENDING_TYPE') || (!erPunsjValgt && o.behandlingType.kodeverk !== 'PUNSJ_INNSENDING_TYPE')) {
        return {
          ...acc,
          [index]: (acc[index] ? acc[index] + o.antall : o.antall),
        };
      }
      return {
        ...acc,
      };
    }, {} as Record<string, number>);

  return behandlingstypeOrder.map((b, index) => test[index + 1]);
};

interface OwnProps {
  intl: any;
  behandlingTyper: Kodeverk[];
  alleOppgaver: AlleOppgaver[];
  erPunsjValgt: boolean;
}

/**
 * FordelingAvBehandlingstypeGraf.
 */
const FordelingAvBehandlingstypeGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  alleOppgaver,
  behandlingTyper,
  erPunsjValgt,
}) => {
  const tilBehandlingTekst = intl.formatMessage({ id: 'FordelingAvBehandlingstypeGraf.TilBehandling' });
  const tilBeslutterTekst = intl.formatMessage({ id: 'FordelingAvBehandlingstypeGraf.TilBeslutter' });

  const finnBehandlingTypeNavn = useMemo(() => {
    if (erPunsjValgt) {
      return ['Punsj'];
    }
    return behandlingstypeOrder.map((t) => {
      const type = behandlingTyper.find((bt) => bt.kode === t);
      return type ? type.navn : '';
    });
  }, [behandlingTyper, erPunsjValgt]);

  const tilBehandlingData = useMemo(() => slåSammen(alleOppgaver.filter((o) => o.tilBehandling), erPunsjValgt), [alleOppgaver]);
  const tilBeslutterData = useMemo(() => slåSammen(alleOppgaver.filter((o) => !o.tilBehandling), erPunsjValgt), [alleOppgaver]);

  return (
    <ReactECharts
      height={eChartGrafHeight}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              formatter: (params) => {
                let total = 0;
                params.seriesData.forEach((s) => {
                  if (s.data) {
                    total += parseInt(s.data.toString(), 10);
                  }
                });
                return total > 0 ? `${params.value}: ${total}` : params.value;
              },
            },
          },
          textStyle: eChartTooltipTextStyle,
        },
        legend: {
          ...eChartLegendStyle,
          data: [tilBehandlingTekst, tilBeslutterTekst],
          show: !erPunsjValgt,
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
          data: finnBehandlingTypeNavn,
        },
        series: [
          {
            name: tilBehandlingTekst,
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series',
            },
            data: tilBehandlingData,
            barMaxWidth: eChartMaxBarWithFordelingAvBehandlingstype,
          },
          {
            name: tilBeslutterTekst,
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series',
            },
            data: tilBeslutterData,
            barMaxWidth: eChartMaxBarWithFordelingAvBehandlingstype,
          },
        ],
        color: eChartFargerForLegendsFordelingAvBehandlingstype,
      }}
    />
  );
};

export default injectIntl(FordelingAvBehandlingstypeGraf);
