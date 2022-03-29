// Fil som har felles styles eller definitioner som brukes som option til ReactECharts komponenten.

export const grafHeight = 300;

// Bar charts
export const maxBarWith = 8;
export const maxBarWithFordelingAvBehandlingstype = 25;
export const yXAxisFontSizeSaksbehandlerNokkeltall = 15;

// Font size
export const defaultFontSize = 15;
export const xAxisFontSizeAvdelningslederNokkeltall = 15;
export const yAxisFontSizeAvdelningslederNokkeltall = 15;
export const yAxisMarginTextBarAvdelningslederNokkeltall = 15;

// Farger
const fargeForUkjent = '#747982'
export const fargeForTotalt = '#0a8c15'
export const fargerForLegendsForMineNyeFerdigstilte = ['#0067C5', '#634689', '#FF9100'];
export const fargerForLegendsFordelingAvBehandlingstype = ['#634689', '#FF9100'];
export const fargerForLegendsForBehandlingerPåVent = '#FF9100';
export const fargerForLegendsForBehandlingerPåVentÅrsaker = {
  'AVV_DOK': '#FF9100',
  'VENT_MANGL_FUNKSJ_SAKSBEHANDLER': '#0067C5',
  'ANNET_MANUELT_SATT_PA_VENT': '#66CBEC',
  'AUTOMATISK_SATT_PA_VENT': '#BA3A26',
  'UKJENT': fargeForUkjent
}
export const fargerForLegendsForAksjonspunkterPerEnhet = {
  '4410 NAV ARBEID OG YTELSER SØRLANDET': '#634689',
  '4403 NAV ARBEID OG YTELSER OSLO': '#ff9100',
  '4415 NAV ARBEID OG YTELSER MOLDE': '#66CBEC',
  'UKJENT': fargeForUkjent
};

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
