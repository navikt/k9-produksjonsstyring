import React, {
  useMemo, useState, FunctionComponent, useCallback,
} from 'react';
import moment from 'moment';
import {
  XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, DiscreteColorLegend, Crosshair, MarkSeries, VerticalBarSeries,
} from 'react-vis';
import Panel from 'nav-frontend-paneler';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { DD_MM_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import behandlingType from 'kodeverk/behandlingType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';

import 'react-vis/dist/style.css';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { background } from '@storybook/theming';
import styles from './beholdningHistorikkGraf.less';

const LEGEND_WIDTH = 260;

const behandlingstypeOrder = [
  behandlingType.ANKE,
  behandlingType.INNSYN,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD];

const behandlingstypeFarger = {
  [behandlingType.ANKE]: '#ff842f',
  [behandlingType.INNSYN]: '#ffd23b',
  [behandlingType.KLAGE]: '#826ba1',
  [behandlingType.REVURDERING]: '#0067C5',
  [behandlingType.FORSTEGANGSSOKNAD]: '#85d5f0',
};

const smallScreen = window.innerWidth < 1600;

const monthNames = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
  'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
];

const weekdays = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

const cssText = {
  fontFamily: 'Source Sans Pro',
  fontSize: '18px',
  lineHeight: '1.375rem',
  fontWeight: 400,
  color: '#3E3832',

};

const sorterBehandlingtyper = (b1, b2) => {
  const index1 = behandlingstypeOrder.indexOf(b1);
  const index2 = behandlingstypeOrder.indexOf(b2);
  if (index1 === index2) {
    return 0;
  }
  return index1 > index2 ? -1 : 1;
};

const getMonthNameAndYear = () => {
  const today = moment();
  if (today.day() > 28) {
    return `${monthNames[today.month()]} ${today.year()}`;
  }

  return today.month() === 1 ? `${monthNames[11]} ${today.year() - 1} - ${monthNames[today.month()]} ${today.year()}`
    : `${monthNames[today.month() - 1]} - ${monthNames[today.month()]} ${today.year()}`;
};


const konverterTilKoordinaterGruppertPaBehandlingstype = (oppgaverForAvdeling) => oppgaverForAvdeling.reduce((acc, o) => {
  const nyKoordinat = {
    x: moment(o.dato).startOf('day').toDate(),
    y: o.antall,
  };

  const eksisterendeKoordinater = acc[o.behandlingType.kode];
  return {
    ...acc,
    [o.behandlingType.kode]: (eksisterendeKoordinater ? eksisterendeKoordinater.concat(nyKoordinat) : [nyKoordinat]),
  };
}, {});

const fyllInnManglendeDatoerOgSorterEtterDato = (data, periodeStart, periodeSlutt) => Object.keys(data).reduce((acc, behandlingstype) => {
  const behandlingstypeData = data[behandlingstype];
  const koordinater = [];

  for (let dato = moment(periodeStart); dato.isSameOrBefore(periodeSlutt); dato = dato.add(1, 'days')) {
    const funnetDato = behandlingstypeData.find((d) => moment(d.x).startOf('day').isSame(dato.startOf('day')));
    koordinater.push(funnetDato || {
      x: dato.toDate(),
      y: 0,
    });
  }

  return {
    ...acc,
    [behandlingstype]: koordinater,
  };
}, {});

const finnAntallForBehandlingstypeOgDato = (data, behandlingstype, dato) => {
  const koordinat = data[behandlingstype].find((d) => d.x.getTime() === dato.getTime());
  return koordinat.y;
};

const finnBehandlingTypeNavn = (behandlingTyper, behandlingTypeKode: string) => {
  const type = behandlingTyper.find((bt) => bt.kode === behandlingTypeKode);
  return type ? type.navn : '';
};

export interface BeholdningPerDato {
  behandlingType: Kodeverk;
  dato: string;
  antall: number;
}

interface OwnProps {
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  beholdningPerDato: BeholdningPerDato[];
  isToUkerValgt: boolean;
}

interface CrosshairValue {
  x: Date;
  y: number;
}

/**
 * TilBehandlingGraf.
 */
const BeholdningHistorikkGraf: FunctionComponent<OwnProps> = ({
  width,
  height,
  beholdningPerDato,
  isToUkerValgt,
  behandlingTyper,
}) => {
  const [crosshairValues, setCrosshairValues] = useState<CrosshairValue[]>([]);
  const [valgtValues, setValgtValues] = useState<CrosshairValue[]>([]);

  const onMouseLeave = useCallback(() => setCrosshairValues([]), []);
  const onNearestX = useCallback((value: {x: Date; y: number}) => {
    setCrosshairValues([value]);
  }, []);


  const periodeStart = moment().subtract(isToUkerValgt ? 2 : 4, 'w').add(1, 'd');
  const periodeSlutt = moment();

  const koordinater = useMemo(() => konverterTilKoordinaterGruppertPaBehandlingstype(beholdningPerDato), [beholdningPerDato]);
  const data = useMemo(() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt), [koordinater, periodeStart, periodeSlutt]);

  const sorterteBehandlingstyper = Object.keys(data).sort(sorterBehandlingtyper);
  const reversertSorterteBehandlingstyper = sorterteBehandlingstyper.slice().reverse();

  const isEmpty = sorterteBehandlingstyper.length === 0;
  const plotPropsWhenEmpty = isEmpty ? {
    yDomain: [0, 5],
    xDomain: [periodeStart.toDate(), periodeSlutt.toDate()],
  } : {};

  const getPlotWidth = () => {
    if (isToUkerValgt) {
      return 1000;
    }
    return smallScreen ? 1150 : 1450;
  };

  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <Normaltekst className={styles.month}>
            {' '}
            {isToUkerValgt ? '2 siste uker' : getMonthNameAndYear()}
          </Normaltekst>
          <div className={styles.container}>
            <XYPlot
              width={getPlotWidth()}
              margin={{
                left: 60, right: 60, top: 60, bottom: 20,
              }}
              height={350}
              stackBy="y"
              xType="ordinal"
              dontCheckIfEmpty={isEmpty}
              {...plotPropsWhenEmpty}
            >
              <HorizontalGridLines />
              <XAxis
                orientation="top"
                tickFormat={(t) => moment(t).format(DD_MM_DATE_FORMAT)}
                style={{ text: cssText, stroke: 'none' }}
              />
              <YAxis style={{ text: cssText, stroke: '#78706A' }} />
              {sorterteBehandlingstyper.map((k, index) => (
                <VerticalBarSeries
                  className={styles.bar}
                  key={k}
                  data={data[k]}
                  fill={behandlingstypeFarger[k]}
                  stroke={behandlingstypeFarger[k]}
                  onNearestX={index === 0 ? onNearestX : () => undefined}
                  onSeriesClick={() => {
                    setValgtValues(crosshairValues);
                  }}
                />
              ))}
              {crosshairValues.length > 0 && (
              <Crosshair
                values={crosshairValues}
                style={{
                  line: {
                    background: 'none',
                  },
                }}
              >
                <div className={styles.crosshair}>
                  <Normaltekst>{`${moment(crosshairValues[0].x).format(DD_MM_DATE_FORMAT)}`}</Normaltekst>
                  { reversertSorterteBehandlingstyper.map((key) => (
                    <Undertekst key={key}>
                      {`${finnBehandlingTypeNavn(behandlingTyper, key)}: ${finnAntallForBehandlingstypeOgDato(data, key, crosshairValues[0].x)}`}
                    </Undertekst>
                  ))}
                </div>
              </Crosshair>
              )}
            </XYPlot>
            <div className={styles.legendContainer}>
              { valgtValues.length > 0
                ? <Normaltekst className={styles.date}>{`${moment(valgtValues[0].x).format(DDMMYYYY_DATE_FORMAT)}`}</Normaltekst>
                : <Normaltekst className={styles.date}>{`${moment().format(DDMMYYYY_DATE_FORMAT)}`}</Normaltekst>}
              {valgtValues.length > 0 ? <Normaltekst className={styles.weekday}>{`${weekdays[moment(valgtValues[0].x).day()]}`}</Normaltekst>
                : <Normaltekst className={styles.weekday}>{`${weekdays[moment().day()]}`}</Normaltekst>}
              {valgtValues.length > 0 && reversertSorterteBehandlingstyper.map((key) => (
                <div className={styles.legend}>
                  <span key={key} className={styles.dot} style={{ backgroundColor: behandlingstypeFarger[key] }} />
                  <Undertekst key={key} className={styles.valgtValues}>
                    {`${finnBehandlingTypeNavn(behandlingTyper, key)} (${finnAntallForBehandlingstypeOgDato(data, key, valgtValues[0].x)})`}
                  </Undertekst>
                </div>
              ))}
            </div>
          </div>
        </FlexColumn>
        <FlexColumn className={styles.legendContainer} />
      </FlexRow>
    </FlexContainer>
  );
};

export default BeholdningHistorikkGraf;
