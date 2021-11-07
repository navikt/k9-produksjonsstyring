import React, {
  useMemo, useState, FunctionComponent, useCallback, useReducer, useEffect,
} from 'react';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import dayjs from 'dayjs';
import { ISO_DATE_FORMAT } from 'utils/formats';
import behandlingType from 'kodeverk/behandlingType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';

import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Koordinat from '../../types/Koordinat';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const behandlingstypeFarger = {
  [behandlingType.ANKE]: '#BA3A26',
  [behandlingType.INNSYN]: '#FF9100',
  [behandlingType.KLAGE]: '#634689',
  [behandlingType.REVURDERING]: '#66CBEC',
  [behandlingType.FORSTEGANGSSOKNAD]: '#0067C5',
  [behandlingType.TILBAKEBETALING]: '#06893A',
  PUNSJ: '#06893A',
};

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
    console.log('eksisterendeKoordinater', eksisterendeKoordinater);

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
const HistorikkGrafEcharts: FunctionComponent<OwnProps> = ({
  historiskData,
  isFireUkerValgt,
  behandlingTyper,
  erPunsjValgt,
}) => {
  const periodeStart = dayjs().subtract(isFireUkerValgt ? 4 : 8, 'w').add(1, 'd');
  const periodeSlutt = dayjs().subtract(1, 'd');

  const koordinater = useMemo(() => konverterTilKoordinaterGruppertPaBehandlingstype(historiskData), [historiskData]);
  const data = useMemo(() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt), [koordinater, periodeStart, periodeSlutt]);

  const alleBehandlingstyperSortert = erPunsjValgt ? ['PUNSJ'] : behandlingTyper.map((bt) => bt.kode).sort(sorterBehandlingtyper);
  const sorterteBehandlingstyper = Object.keys(data).sort(sorterBehandlingtyper);
  const reversertSorterteBehandlingstyper = erPunsjValgt ? [] : sorterteBehandlingstyper.slice().reverse();
  const farger = alleBehandlingstyperSortert.map((bt) => behandlingstypeFarger[bt]);

  console.log('koordinater', koordinater);
  console.log('data', data);
  console.log('alleBehandlingstyperSortert', alleBehandlingstyperSortert);
  console.log('sorterteBehandlingstyper', sorterteBehandlingstyper);
  console.log('reversertSorterteBehandlingstyper', reversertSorterteBehandlingstyper);

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
                return dateFormat(params.value as string);
              },
            },
          },
          textStyle: {
            fontSize: 16,
          },
        },
        legend: {
          bottom: 0,
          left: 30,
          icon: 'circle',
          itemGap: 30,
          textStyle: {
            padding: 0,
            fontSize: 15,
          },
          data: reversertSorterteBehandlingstyper.map((type) => finnBehandlingTypeNavn(behandlingTyper, type)),
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: [
          {
            // bruker category istedet for time for att vise alle dato og ikke bara hvert femte.
            type: 'category',
            // boundaryGap ser till att dato hamnar på en linje istället for mellom.
            // @ts-ignore
            boundaryGap: false,
            minInterval: 1,
            axisTick: {
              show: true,
              alignWithLabel: true,
            },
            axisLabel: {
              // viser månad og dato dersom det er valgt fire uker og dato dersom åtte uker er valgt.
              formatter(value) {
                const oppstykketDato = value.split('-');
                if (oppstykketDato[1] && oppstykketDato[2]) {
                  return isFireUkerValgt ? `${oppstykketDato[2]}.${oppstykketDato[1]}` : oppstykketDato[2];
                }
                return value;
              },
              fontSize: 12,
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
              fontSize: 15,
              margin: 15,
            },
          },
        ],
        series: alleBehandlingstyperSortert
          .map((type) => ({
            name: finnBehandlingTypeNavn(behandlingTyper, type),
            type: 'line',
            symbolSize: 10,
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: data[type],
          })),
        color: farger,
      }}
    />
  );
};

export default HistorikkGrafEcharts;
