import dayjs from 'dayjs';
import React from 'react';

import ReactECharts from 'sharedComponents/echart/ReactEcharts';

import { eChartGrafHeight, eChartLegendStyle } from '../../styles/echartStyle';

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

const Stolpediagram = ({ series, legendData, uker = 2 }) => {
  const antallDager = uker * 7;
  const datoer = Array(antallDager)
    .fill(dayjs())
    .map((daysObject, index, array) => daysObject.subtract(array.length - index, 'days'))
    .map(daysObject => daysObject.format('DD.MM'));

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
        data: datoer,
      },
    ],
    yAxis: { interval: 1 },
    series,
  };
  return <ReactECharts height={eChartGrafHeight} option={option} />;
};

export default Stolpediagram;
