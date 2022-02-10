import React, { useMemo, FunctionComponent } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl';

import behandlingType from 'kodeverk/behandlingType';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import Kodeverk from 'kodeverk/kodeverkTsType';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import AlleOppgaver from './alleOppgaverTsType';

import {
  fargerForLegendsFordelingAvBehandlingstype,
  grafHeight,
  gridDef,
  legendStyle,
  maxBarWithFordelingAvBehandlingstype,
  tooltipTextStyle,
  yXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../styles/echartStyle';
import useKodeverk from '../../../../api/rest-api-hooks/src/global-data/useKodeverk';

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.ANKE,
  behandlingType.INNSYN,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD,
];

const fagytelseTypeOrder = [fagsakYtelseType.OMSORGSPENGER, fagsakYtelseType.PLEIEPENGER_SYKT_BARN];

const slåSammen = (oppgaverForAvdeling: AlleOppgaver[], erPunsjValgt: boolean): number[] => {
  const test = oppgaverForAvdeling.reduce((acc, o) => {
    const index = erPunsjValgt
      ? fagytelseTypeOrder.findIndex(bo => bo === o.fagsakYtelseType.kode) + 1
      : behandlingstypeOrder.findIndex(bo => bo === o.behandlingType.kode) + 1;
    if (
      (erPunsjValgt && o.behandlingType.kodeverk === punsjKodeverkNavn) ||
      (!erPunsjValgt && o.behandlingType.kodeverk !== 'PUNSJ_INNSENDING_TYPE')
    ) {
      return {
        ...acc,
        [index]: acc[index] ? acc[index] + o.antall : o.antall,
      };
    }
    return {
      ...acc,
    };
  }, {} as Record<string, number>);

  return erPunsjValgt
    ? fagytelseTypeOrder.map((b, index) => test[index + 1])
    : behandlingstypeOrder.map((b, index) => test[index + 1]);
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
  const fagytelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

  const finnBehandlingTypeNavn = useMemo(() => {
    if (erPunsjValgt) {
      return ['Punsj'];
    }
    return behandlingstypeOrder.map(t => {
      const type = behandlingTyper.find(bt => bt.kode === t);
      return type ? type.navn : '';
    });
  }, [behandlingTyper, erPunsjValgt]);

  const finnFagytelseTypeNavn = fagytelseTypeOrder.map(t => {
    const type = fagytelseTyper.find(ytelse => ytelse.kode === t);
    return type ? type.navn : '';
  });

  const tilBehandlingData = useMemo(
    () =>
      slåSammen(
        alleOppgaver.filter(o => o.tilBehandling),
        erPunsjValgt,
      ),
    [alleOppgaver],
  );
  const tilBeslutterData = useMemo(
    () =>
      slåSammen(
        alleOppgaver.filter(o => !o.tilBehandling),
        erPunsjValgt,
      ),
    [alleOppgaver],
  );

  return (
    <ReactECharts
      height={grafHeight}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              // @ts-ignore
              formatter: params => {
                let total = 0;
                params.seriesData.forEach(s => {
                  if (s.data) {
                    total += parseInt(s.data.toString(), 10);
                  }
                });
                return total > 0 ? `${params.value}: ${total}` : params.value;
              },
            },
          },
          textStyle: tooltipTextStyle,
        },
        legend: {
          ...legendStyle,
          data: [tilBehandlingTekst, tilBeslutterTekst],
          show: !erPunsjValgt,
        },
        grid: gridDef,
        xAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: {
            fontSize: yXAxisFontSizeSaksbehandlerNokkeltall,
          },
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            fontSize: yXAxisFontSizeSaksbehandlerNokkeltall,
            margin: 15,
          },
          data: erPunsjValgt ? finnFagytelseTypeNavn : finnBehandlingTypeNavn,
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
            barMaxWidth: maxBarWithFordelingAvBehandlingstype,
          },
          {
            name: tilBeslutterTekst,
            type: 'bar',
            stack: 'total',
            emphasis: {
              focus: 'series',
            },
            data: tilBeslutterData,
            barMaxWidth: maxBarWithFordelingAvBehandlingstype,
          },
        ],
        color: fargerForLegendsFordelingAvBehandlingstype,
      }}
    />
  );
};

export default injectIntl(FordelingAvBehandlingstypeGraf);
