// Fil som har felles styles eller definitioner som brukes som option til ReactECharts komponenten.

export const grafHeight = 300;

// Bar charts
export const maxBarWith = 8;
export const maxBarWithFordelingAvBehandlingstype = 25;
export const yXAxisFontSizeSaksbehandlerNokkeltall = 15;

// Font size
export const xAxisFontSizeAvdelningslederNokkeltall = 15;
export const yAxisFontSizeAvdelningslederNokkeltall = 15;
export const yAxisMarginTextBarAvdelningslederNokkeltall = 15;

// Farger
export const fargerForLegendsForMineNyeFerdigstilte = ['#0067C5', '#634689', '#FF9100'];
export const fargerForLegendsFordelingAvBehandlingstype = ['#634689', '#FF9100'];
export const fargerForLegendsForBehandlingerPåVent = '#FF9100';
export const fargerForLegendsForBehandlingerPåVentÅrsaker = ['#ff9100', '#0067c5', '#66cbec', '#ba3a26', '#634689'];
export const fargerForLegendsForAksjonspunkterPerEnhet = ['#634689', '#ff9100'];

export const graferOpacity = 0.6;

export const gridDef = {
  top: '10%',
  left: '3%',
  right: '4%',
  bottom: '15%',
  containLabel: true,
};

export const yAxisDef = [
  {
    type: 'value',
    minInterval: 1,
    axisLabel: {
      fontSize: 15,
      margin: 15,
    },
  },
];

export const legendStyle = {
  bottom: 0,
  left: 30,
  icon: 'circle',
  itemGap: 30,
  textStyle: {
    padding: 0,
    fontSize: 15,
  },
};

export const tooltipTextStyle = {
  fontSize: 16,
};

export const seriesStyleAvdelningslederNokkeltall = {
  areaStyle: {},
  // Bestemmer storleken på cirklarna som är i grafen.
  symbolSize: 10,
};

export const eChartXAxisTickDefAvdelningslederNokkeltall = {
  show: true,
  alignWithLabel: true,
};
