import { dateFormat } from 'avdelingsleder/nokkeltall/HistorikkGrafEcharts';

export const eChartGridDef = {
  left: '3%',
  right: '4%',
  bottom: '15%',
  containLabel: true,
};

export const eChartYaxisDef = [{
  type: 'value',
  minInterval: 1,
  axisLabel: {
    fontSize: 15,
    margin: 15,
  },
}];

export const eChartLegendStyle = {
  bottom: 0,
  left: 30,
  icon: 'circle',
  itemGap: 30,
  textStyle: {
    padding: 0,
    fontSize: 15,
  },
};
