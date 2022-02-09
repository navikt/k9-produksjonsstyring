import React, {
  FunctionComponent, useMemo,
} from 'react';

import { ISO_DATE_FORMAT } from 'utils/formats';
import dayjs from 'dayjs';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { momentDateFormat } from 'utils/dateUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import IBehandlingerSomGarAvVentType
  from './behandlingerSomGårAvVentType';
import {
  eChartFargerForLegendsForBehandlingerPåVent,
  eChartGridDef, eChartSeriesStyleAvdelningslederNokkeltall,
  eChartTooltipTextStyle,
  eChartXAxisFontSizeAvdelningslederNokkeltall,
  eChartXAxisTickDefAvdelningslederNokkeltall,
  eChartYAxisFontSizeAvdelningslederNokkeltall,
  eChartYAxisMarginTextBarAvdelningslederNokkeltall,
} from '../../../../styles/echartStyle';

const slaSammenBehandlingstyperOgFyllInnTomme = (behandlingerPåVent: IBehandlingerSomGarAvVentType[], antallUkerFremITid: number):
  [string, number][] => {
  const behandlingerSomGårAvVentPerDag = [];
  const antallDagerFremITid: number = antallUkerFremITid * 7;

  if (behandlingerPåVent.length > 0) {
    const iDag = dayjs().startOf('day');
    const dagerFremITid = dayjs().add(antallDagerFremITid, 'days').startOf('day');

    for (let dato = iDag; dato.isBefore(dagerFremITid); dato = dato.add(1, 'days')) {
      const behandlingerSomGårAvVentPåDenneDagen = behandlingerPåVent.filter((o) => dayjs(o.dato).startOf('day').isSame(dato));
      if (behandlingerSomGårAvVentPåDenneDagen.length === 0) {
        behandlingerSomGårAvVentPerDag.push([
          dayjs(dato).format(ISO_DATE_FORMAT),
          0,
        ]);
      } else {
        behandlingerSomGårAvVentPerDag.push(
          [
            dayjs(dato).format(ISO_DATE_FORMAT),
            behandlingerSomGårAvVentPåDenneDagen.reduce((acc, d) => acc + d.antall, 0),
          ],
        );
      }
    }
  }
  return behandlingerSomGårAvVentPerDag;
};

interface OwnProps{
  behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
  antallUkerSomSkalVises: string;
}

const BehandlingerGårAvVentGraf: FunctionComponent<OwnProps> = ({
  behandlingerSomGårAvVent,
  antallUkerSomSkalVises,
}) => {
  const periodeStart = dayjs();
  const periodeSlutt = dayjs().add(antallUkerSomSkalVises === '4' ? 4 : 2, 'w');
  const oppgaverInomValgtPeriode: IBehandlingerSomGarAvVentType[] = behandlingerSomGårAvVent.filter((oppgave) => oppgave.antall > 0 && dayjs(oppgave.dato).isSameOrBefore(periodeSlutt, 'day') && dayjs(oppgave.dato).isSameOrAfter(periodeStart, 'day'));

  const behandlingerSomGårAvVentToUkerFremITid: [string, number][] = useMemo(
    () => slaSammenBehandlingstyperOgFyllInnTomme(oppgaverInomValgtPeriode, 2),
    [oppgaverInomValgtPeriode],
  );

  const behandlingerSomGårAvVentFireUkerFremITid: [string, number][] = useMemo(
    () => slaSammenBehandlingstyperOgFyllInnTomme(oppgaverInomValgtPeriode, 4),
    [oppgaverInomValgtPeriode],
  );

  if (oppgaverInomValgtPeriode.length === 0) {
    return (
      <div>
        <Normaltekst>
          <FormattedMessage id="InngangOgFerdigstiltePanel.IngenTall" />
        </Normaltekst>
      </div>
    );
  }

  return (
    <ReactECharts
      height={300}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'solid',
            },
            label: {
              formatter: (params) => {
                if (params.axisDimension === 'y') {
                  return parseInt(params.value as string, 10).toString();
                }
                return momentDateFormat(params.value as string);
              },
            },
          },
          textStyle: eChartTooltipTextStyle,
        },
        grid: eChartGridDef,
        xAxis: [
          {
            // bruker category istedet for time for att vise alle dato og ikke bara hvert femte.
            type: 'category',
            // boundaryGap ser till att dato hamnar på en linje istället for mellom.
            // @ts-ignore
            boundaryGap: false,
            minInterval: 1,
            axisTick: eChartXAxisTickDefAvdelningslederNokkeltall,
            axisLabel: {
              // viser månad og dato dersom det er valgt fire uker og dato dersom åtte uker er valgt.
              formatter(value) {
                const oppstykketDato = value.split('-');
                if (oppstykketDato[1] && oppstykketDato[2]) {
                  return `${oppstykketDato[2]}.${oppstykketDato[1]}`;
                }
                return value;
              },
              fontSize: eChartXAxisFontSizeAvdelningslederNokkeltall,
              margin: eChartYAxisMarginTextBarAvdelningslederNokkeltall,
              interval: 0,
            },
            // Denne setter de horisontala linjerna sammen med axisTick.
            splitLine: {
              show: true,
            },
          },

        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisLabel: {
              fontSize: eChartYAxisFontSizeAvdelningslederNokkeltall,
              margin: eChartYAxisMarginTextBarAvdelningslederNokkeltall,
            },
          },
        ],
        series: {
          name: 'Antall',
          type: 'line',
          ...eChartSeriesStyleAvdelningslederNokkeltall,
          emphasis: {
            focus: 'series',
          },
          data: antallUkerSomSkalVises === '4' ? behandlingerSomGårAvVentFireUkerFremITid : behandlingerSomGårAvVentToUkerFremITid,
        },
        color: eChartFargerForLegendsForBehandlingerPåVent,
      }}
    />
  );
};

export default BehandlingerGårAvVentGraf;
