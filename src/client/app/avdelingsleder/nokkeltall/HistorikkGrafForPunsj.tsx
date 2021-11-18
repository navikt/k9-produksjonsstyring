import React, {
  useMemo, FunctionComponent,
} from 'react';
import dayjs from 'dayjs';
import { ISO_DATE_FORMAT } from 'utils/formats';
import behandlingType from 'kodeverk/behandlingType';

import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Kodeverk from 'kodeverk/kodeverkTsType';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { dateFormat } from 'avdelingsleder/nokkeltall/HistorikkGraf';
import Koordinat from '../../types/Koordinat';
import {
  eChartGrafHeight,
  eChartGridDef,
  eChartLegendStyle, eChartSeriesStyleAvdelningslederNokkeltall,
  eChartTooltipTextStyle,
  eChartXAxisFontSizeAvdelningslederNokkeltall, eChartXAxisTickDefAvdelningslederNokkeltall,
  eChartYAxisFontSizeAvdelningslederNokkeltall,
  eChartYAxisMarginTextBarAvdelningslederNokkeltall, graferOpacity,
} from '../../../styles/echartStyle';
import useKodeverk from '../../api/rest-api-hooks/src/global-data/useKodeverk';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const fagytelseTyperFarger = {
  [fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: '#0067C5',
  [fagsakYtelseType.OMSORGSPENGER]: '#66CBEC',
};

const fagytelseTyperSomSkalVises = [
  fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  fagsakYtelseType.OMSORGSPENGER,
];

const konverterTilKoordinaterGruppertPaFagytelsetype = (oppgaverForAvdeling: HistoriskData[]): Record<string, Koordinat[]> => oppgaverForAvdeling
  .reduce((acc, o) => {
    const nyKoordinat = {
      x: dayjs(o.dato).startOf('day').toDate(),
      y: o.antall,
    };

    const eksisterendeKoordinater = acc[o.fagsakYtelseType.kode];

    return {
      ...acc,
      [o.fagsakYtelseType.kode]: (eksisterendeKoordinater ? eksisterendeKoordinater.concat(nyKoordinat) : [nyKoordinat]),
    };
  }, {} as Record<string, Koordinat[]>);

const fyllInnManglendeDatoerOgSorterEtterDato = (
  data: Record<string, Koordinat[]>,
  periodeStart: dayjs.Dayjs,
  periodeSlutt: dayjs.Dayjs,
): Record<string, Date[][]> => Object.keys(data).reduce((acc, fagytelsetype) => {
  const fagytelsetypeData = data[fagytelsetype];
  const koordinater = [];

  for (let dato = dayjs(periodeStart); dato.isSameOrBefore(periodeSlutt); dato = dato.add(1, 'days')) {
    const funnetDato = fagytelsetypeData.find((d) => dayjs(d.x).startOf('day').isSame(dato.startOf('day')));
    koordinater.push(funnetDato ? [dayjs(funnetDato.x).format(ISO_DATE_FORMAT), funnetDato.y] : [dato.format(ISO_DATE_FORMAT), 0]);
  }

  return {
    ...acc,
    [fagytelsetype]: koordinater,
  };
}, {});

const finnFagytelsetypeNavn = (fagytelseTyper, fagytelsetypeKode: string) => {
  const type = fagytelseTyper.find((bt) => bt.kode === fagytelsetypeKode);
  return type ? type.navn : '';
};

interface OwnProps {
  historiskData: HistoriskData[];
  isFireUkerValgt: boolean;
}

/**
 * TilBehandlingGraf.
 */
const HistorikkGrafForPunsj: FunctionComponent<OwnProps> = ({
  historiskData,
  isFireUkerValgt,
}) => {
  const fagytelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);
  const periodeStart = dayjs().subtract(isFireUkerValgt ? 4 : 2, 'w').add(1, 'd');
  const periodeSlutt = dayjs().subtract(1, 'd');
  const oppgaverInomValgtPeriode: HistoriskData[] = historiskData.filter((oppgave) => oppgave.antall > 0 && dayjs(oppgave.dato).isSameOrBefore(periodeSlutt) && dayjs(oppgave.dato).isSameOrAfter(periodeStart));

  const koordinater = useMemo(() => konverterTilKoordinaterGruppertPaFagytelsetype(oppgaverInomValgtPeriode), [historiskData]);
  const data = useMemo(() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt), [koordinater, periodeStart, periodeSlutt]);

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
      height={eChartGrafHeight}
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
                return dateFormat(params.value as string);
              },
            },
          },
          textStyle: eChartTooltipTextStyle,
        },
        legend: {
          ...eChartLegendStyle,
          data: fagytelseTyperSomSkalVises.map((type) => finnFagytelsetypeNavn(fagytelseTyper, type)),
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
        series: fagytelseTyperSomSkalVises
          .map((type) => ({
            name: finnFagytelsetypeNavn(fagytelseTyper, type),
            type: 'line',
            emphasis: {
              focus: 'series',
            },
            ...eChartSeriesStyleAvdelningslederNokkeltall,
            data: data[type],
            color: fagytelseTyperFarger[type],
            areaStyle: {
              opacity: graferOpacity,
            },
          })),
      }}
    />
  );
};

export default HistorikkGrafForPunsj;
