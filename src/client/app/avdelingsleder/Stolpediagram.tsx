import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import { useIntl } from 'react-intl';

import ReactECharts from 'sharedComponents/echart/ReactEcharts';

import { fargerForLegendsFordelingAvBehandlingstype, grafHeight, legendStyle } from '../../styles/echartStyle';

dayjs.extend(customParseFormat);

const mapAntallTilRiktigDato = (data, datoer) => {
  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  return datoer.map(dato =>
    data
      .filter(v => dato.isSame(dayjs(v.dato, 'YYYY-MM-DD'), 'day'))
      .map(v => v.antall)
      .reduce(reducer, 0),
  );
};

const Stolpediagram = ({ series, legendData, uker = '2' }) => {
  const intl = useIntl();
  if (!series.length) {
    // eslint-disable-next-line react/jsx-one-expression-per-line
    return <p className="typo-normal">{intl.formatMessage({ id: 'InngangOgFerdigstiltePanel.IngenTall' })} </p>;
  }
  const antallDager = Number(uker) * 7;
  const datoer = Array(antallDager)
    .fill(dayjs())
    .map((daysObject, index, array) => daysObject.subtract(array.length - index, 'days'));

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          type: 'solid',
        },
        label: {
          formatter: ({ value }) => `${value}.${dayjs().format('YYYY')}`,
        },
      },
    },
    legend: {
      data: legendData,
      color: ['#634689', '#ff9100'],
      ...legendStyle,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        data: datoer.map(dato => dato.format('DD.MM')),
      },
    ],
    yAxis: { interval: 1 },
    series: series.map((serie, index) => ({
      ...serie,
      data: mapAntallTilRiktigDato(serie.data, datoer),
      itemStyle: { color: fargerForLegendsFordelingAvBehandlingstype[index] },
    })),
  };
  return <ReactECharts height={grafHeight} option={option} />;
};

export default Stolpediagram;
