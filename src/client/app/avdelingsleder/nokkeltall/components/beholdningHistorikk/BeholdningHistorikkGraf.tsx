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
import { DD_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import behandlingType from 'kodeverk/behandlingType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';

import 'react-vis/dist/style.css';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
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


const monthNames = ['JANUAR', 'FEBRUAR', 'MARS', 'APRIL', 'MAI', 'JUNI',
  'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
];

const cssText = {
  fontFamily: 'Source Sans Pro',
  fontSize: '18px',
  lineHeight: '1.375rem',
  fontWeight: 400,
  color: '#3E3832',

};

const gridStyle = {
  stroke: 'black',
  'stroke-width': '20px',
};

const sorterBehandlingtyper = (b1, b2) => {
  const index1 = behandlingstypeOrder.indexOf(b1);
  const index2 = behandlingstypeOrder.indexOf(b2);
  if (index1 === index2) {
    return 0;
  }
  return index1 > index2 ? -1 : 1;
};

const getMonthNameAndYear = () => `${monthNames[moment().month()]} ${moment().year()}`;

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

  const [valgtDag, setValgtDag] = useState<BeholdningPerDato>(data[sorterteBehandlingstyper[1]]);
  const isEmpty = sorterteBehandlingstyper.length === 0;
  const plotPropsWhenEmpty = isEmpty ? {
    yDomain: [0, 5],
    xDomain: [periodeStart.toDate(), periodeSlutt.toDate()],
  } : {};

  return (
    <Panel className={styles.panel}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Normaltekst className={styles.month}>
              {' '}
              {isToUkerValgt ? 'Siste to uker' : getMonthNameAndYear()}
            </Normaltekst>
            <XYPlot
              width={isToUkerValgt ? 1000 : 1450}
              margin={{
                left: 60, right: 60, top: 60, bottom: 60,
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
                tickFormat={(t) => moment(t).format(DD_DATE_FORMAT)}
                style={{ text: cssText, stroke: 'none' }}
              />
              <YAxis style={{ text: cssText, stroke: '#78706A', height: 150 }} />
              {sorterteBehandlingstyper.map((k, index) => (
                <VerticalBarSeries
                  key={k}
                  data={data[k]}
                  fill={behandlingstypeFarger[k]}
                  stroke={behandlingstypeFarger[k]}
                  onSeriesClick={() => {
                    setValgtDag(data[k]);
                  }}
                />
              ))}
            </XYPlot>
          </FlexColumn>
          <FlexColumn>
            <DiscreteColorLegend
              colors={reversertSorterteBehandlingstyper.map((key) => behandlingstypeFarger[key])}
              items={reversertSorterteBehandlingstyper.map((key) => (
                <Normaltekst className={styles.displayInline}>
                  {finnBehandlingTypeNavn(behandlingTyper, key)}
                </Normaltekst>
              ))}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </Panel>
  );
};

export default BeholdningHistorikkGraf;
