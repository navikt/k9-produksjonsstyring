import React, {
  FunctionComponent, useCallback, useMemo, useState,
} from 'react';

import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Panel from 'nav-frontend-paneler';

import 'react-vis/dist/style.css';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { dateFormat } from 'avdelingsleder/nokkeltall/HistorikkGrafEcharts';
import dayjs from 'dayjs';
import { eChartGridDef, eChartLegendStyle, eChartYaxisDef } from '../../../../../../styles/echartStyle';

interface OwnProps {
  width: number;
  height: number;
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

interface CrosshairValue {
  x: Date;
  y: number;
}

interface StateProps {
  crosshairValues: CrosshairValue[];
}

export const slaSammenBehandlingstyperOgFyllInnTomme = (nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[]):
  { antallNye: number; antallFerdigstilte: number; antallFerdigstilteMine: number; dato: Date}[] => {
  const oppgaver = [];
  if (nyeOgFerdigstilteOppgaver.length > 0) {
    const iDag = dayjs().startOf('day');
    const atteDagerSiden = dayjs().subtract(7, 'days').startOf('day');

    for (let dato = atteDagerSiden; dato.isBefore(iDag); dato = dato.add(1, 'days')) {
      const dataForDato = nyeOgFerdigstilteOppgaver.filter((o) => dayjs(o.dato).startOf('day').isSame(dato));
      if (dataForDato.length === 0) {
        oppgaver.push({
          antallNye: 0,
          antallFerdigstilte: 0,
          antallFerdigstilteMine: 0,
          dato: dato.toDate(),
        });
      } else {
        oppgaver.push({
          antallNye: dataForDato.reduce((acc, d) => acc + d.antallNye, 0),
          antallFerdigstilte: dataForDato.reduce((acc, d) => acc + d.antallFerdigstilte, 0),
          antallFerdigstilteMine: dataForDato.reduce((acc, d) => acc + d.antallFerdigstilteMine, 0),
          dato: dato.toDate(),
        });
      }
    }
  }

  return oppgaver;
};

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvGraf
 */
const NyeOgFerdigstilteOppgaverForSisteSyvEchartGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  nyeOgFerdigstilteOppgaver,
}) => {
  const ferdigLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForSisteSyvGraf.Ferdigstilte' });
  const mineFerdigeLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForSisteSyvGraf.FerdigstilteMine' });
  const nyLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForSisteSyvGraf.Nye' });

  const sammenslatteOppgaver = useMemo(() => slaSammenBehandlingstyperOgFyllInnTomme(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);
  const ferdigstilteOppgaver = useMemo(() => sammenslatteOppgaver.map((o) => [o.dato.getTime(), o.antallFerdigstilte]), [sammenslatteOppgaver]);
  const nyeOppgaver = useMemo(() => sammenslatteOppgaver.map((o) => [o.dato.getTime(), o.antallNye]), [sammenslatteOppgaver]);
  const ferdigstilteOppgaverMine = useMemo(() => sammenslatteOppgaver.map((o) => [o.dato.getTime(), o.antallFerdigstilteMine]), [sammenslatteOppgaver]);

  return (
    <Panel>
      <ReactECharts
        height={height}
        option={{
          tooltip: {
            trigger: 'axis',
            textStyle: {
              fontSize: 16,
            },
            axisPointer: {
              type: 'cross',
              label: {
                formatter: (params) => {
                  if (params.axisDimension === 'y') {
                    return parseInt(params.value as string, 10).toString();
                  }
                  return dateFormat(params.value as string);
                },
              },
            },
          },
          legend: {
            ...eChartLegendStyle,
            data: [ferdigLabel, nyLabel, mineFerdigeLabel],
          },
          grid: eChartGridDef,
          xAxis: [
            {
              type: 'time',
              axisLabel: {
                formatter: '{dd}.{MM}',
                fontSize: 15,
                margin: 10,
              },
              minInterval: 1,
            },
          ],
          // @ts-ignore
          yAxis: eChartYaxisDef,
          series: [
            {
              name: ferdigLabel,
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series',
              },
              data: ferdigstilteOppgaver,
            },
            {
              name: nyLabel,
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series',
              },
              data: nyeOppgaver,
            },
            {
              name: mineFerdigeLabel,
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series',
              },
              data: ferdigstilteOppgaverMine,
            },
          ],
          color: ['#634689', '#0067C5', '#FF9100'],
        }}
      />
    </Panel>
  );
};

export default injectIntl(NyeOgFerdigstilteOppgaverForSisteSyvEchartGraf);
