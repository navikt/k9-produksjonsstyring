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
import Koordinat from '../../types/Koordinat';
import {
  eChartGrafHeight,
  eChartGridDef,
  eChartLegendStyle, eChartSeriesStyleAvdelningslederNokkeltall,
  eChartTooltipTextStyle,
  eChartXAxisFontSizeAvdelningslederNokkeltall, eChartXAxisTickDefAvdelningslederNokkeltall,
  eChartYAxisFontSizeAvdelningslederNokkeltall,
  eChartYAxisMarginTextBarAvdelningslederNokkeltall,
} from '../../../styles/echartStyle';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const behandlingstypeFarger = {
  [behandlingType.FORSTEGANGSSOKNAD]: '#0067C5',
  [behandlingType.REVURDERING]: '#66CBEC',
  // [behandlingType.ANKE]: '#BA3A26',
  [behandlingType.INNSYN]: '#FF9100',
  // [behandlingType.KLAGE]: '#634689',
  [behandlingType.TILBAKEBETALING]: '#06893A',
  PUNSJ: '#06893A',
};

// Denne bestemmer rekkeföljd på graferna. Alltså forstegangssoknad skal lengst bak etc. Klage og anke er utkommentert då det ikke skal vises nå.
const behandlingstyperSomSkalVises = [
  behandlingType.FORSTEGANGSSOKNAD,
  behandlingType.REVURDERING,
  behandlingType.TILBAKEBETALING,
  behandlingType.INNSYN,
  // [behandlingType.ANKE]: '#BA3A26',
  // [behandlingType.KLAGE]: '#634689',
];

export const DDMMYYYY_DATE_FORMAT = 'DD.MM.YYYY';

export const dateFormat = (date: Date | string): string => dayjs(date).format(DDMMYYYY_DATE_FORMAT);

const sorterBehandlingtyper = (b1, b2) => {
  const index1 = behandlingstypeOrder.indexOf(b1);
  const index2 = behandlingstypeOrder.indexOf(b2);
  if (index1 === index2) {
    return 0;
  }
  return index1 > index2 ? -1 : 1;
};

const konverterTilKoordinaterGruppertPaBehandlingstype = (oppgaverForAvdeling: HistoriskData[]): Record<string, Koordinat[]> => oppgaverForAvdeling
  .reduce((acc, o) => {
    const nyKoordinat = {
      x: dayjs(o.dato).startOf('day').toDate(),
      y: o.antall,
    };

    const eksisterendeKoordinater = acc[o.behandlingType.kode];

    return {
      ...acc,
      [o.behandlingType.kode]: (eksisterendeKoordinater ? eksisterendeKoordinater.concat(nyKoordinat) : [nyKoordinat]),
    };
  }, {} as Record<string, Koordinat[]>);

const fyllInnManglendeDatoerOgSorterEtterDato = (
  data: Record<string, Koordinat[]>,
  periodeStart: dayjs.Dayjs,
  periodeSlutt: dayjs.Dayjs,
): Record<string, Date[][]> => Object.keys(data).reduce((acc, behandlingstype) => {
  const behandlingstypeData = data[behandlingstype];
  const koordinater = [];

  for (let dato = dayjs(periodeStart); dato.isSameOrBefore(periodeSlutt); dato = dato.add(1, 'days')) {
    const funnetDato = behandlingstypeData.find((d) => dayjs(d.x).startOf('day').isSame(dato.startOf('day')));
    koordinater.push(funnetDato ? [dayjs(funnetDato.x).format(ISO_DATE_FORMAT), funnetDato.y] : [dato.format(ISO_DATE_FORMAT), 0]);
  }

  return {
    ...acc,
    [behandlingstype]: koordinater,
  };
}, {});

const finnBehandlingTypeNavn = (behandlingTyper, behandlingTypeKode: string) => {
  if (behandlingTypeKode === 'PUNSJ') return 'Punsj';
  const type = behandlingTyper.find((bt) => bt.kode === behandlingTypeKode);
  return type ? type.navn : '';
};

interface OwnProps {
  behandlingTyper: Kodeverk[];
  historiskData: HistoriskData[];
  isFireUkerValgt: boolean;
  erPunsjValgt: boolean;
}

export const lagKoordinater = (oppgaverPerForsteStonadsdag): Koordinat[] => oppgaverPerForsteStonadsdag
  .map((o) => ({
    x: dayjs(o.dato).startOf('day').toDate().getTime(),
    y: o.antall,
  }));
/**
 * TilBehandlingGraf.
 */
const HistorikkGraf: FunctionComponent<OwnProps> = ({
  historiskData,
  isFireUkerValgt,
  behandlingTyper,
  erPunsjValgt,
}) => {
  const periodeStart = dayjs().subtract(isFireUkerValgt ? 4 : 2, 'w').add(1, 'd');
  const periodeSlutt = dayjs().subtract(1, 'd');
  const oppgaverInomValgtPeriode: HistoriskData[] = historiskData.filter((oppgave) => oppgave.antall && dayjs(oppgave.dato).isSameOrBefore(periodeSlutt) && dayjs(oppgave.dato).isSameOrAfter(periodeStart));

  const koordinater = useMemo(() => konverterTilKoordinaterGruppertPaBehandlingstype(oppgaverInomValgtPeriode), [historiskData]);
  const data = useMemo(() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt), [koordinater, periodeStart, periodeSlutt]);

  const alleBehandlingstyperSortert = erPunsjValgt ? ['PUNSJ'] : behandlingstyperSomSkalVises;
  const sorterteBehandlingstyper = Object.keys(data).sort(sorterBehandlingtyper);
  const reversertSorterteBehandlingstyper = erPunsjValgt ? [] : sorterteBehandlingstyper.slice().reverse();

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
          data: reversertSorterteBehandlingstyper.map((type) => finnBehandlingTypeNavn(behandlingTyper, type)),
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
        series: alleBehandlingstyperSortert
          .map((type) => ({
            name: finnBehandlingTypeNavn(behandlingTyper, type),
            type: 'line',
            emphasis: {
              focus: 'series',
            },
            ...eChartSeriesStyleAvdelningslederNokkeltall,
            data: data[type],
            color: behandlingstypeFarger[type],
            areaStyle: {
              opacity: 0.6,
            },
          })),
      }}
    />
  );
};

export default HistorikkGraf;
