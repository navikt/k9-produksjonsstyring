import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';

import ReactECharts from 'sharedComponents/echart/ReactEcharts';

import { eChartGrafHeight, eChartLegendStyle } from '../../styles/echartStyle';

dayjs.extend(customParseFormat);

const tooltip = {
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
};

const mapAntallTilRiktigDato = (data, datoer) => {
  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  return datoer.map(dato =>
    data
      .filter(v => dato.isSame(dayjs(v.dato, 'YYYY-MM-DD'), 'day'))
      .map(v => v.antall)
      .reduce(reducer, 0),
  );
};

const Stolpediagram = ({ series, legendData, uker = 2 }) => {
  const antallDager = uker * 7;
  const datoer = Array(antallDager)
    .fill(dayjs())
    .map((daysObject, index, array) => daysObject.subtract(array.length - index, 'days'));

  const option = {
    tooltip,
    legend: {
      data: legendData,
      ...eChartLegendStyle,
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
    series: series.map(serie => ({ ...serie, data: mapAntallTilRiktigDato(serie.data, datoer) })),
  };
  return <ReactECharts height={eChartGrafHeight} option={option} />;
};

export default Stolpediagram;
