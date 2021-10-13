import React, {
  useMemo, useState, FunctionComponent, useCallback,
} from 'react';
import moment from 'moment';
import {
  XYPlot, XAxis, YAxis, HorizontalGridLines, DiscreteColorLegend, Crosshair, MarkSeries, AreaSeries,
} from 'react-vis';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { DD_MM_DATE_FORMAT } from 'utils/formats';
import behandlingType from 'kodeverk/behandlingType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';

import 'react-vis/dist/style.css';
import { Row } from 'nav-frontend-grid';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import styles from './historikkGraf.less';

const LEGEND_WIDTH = 260;

const behandlingstypeFarger = {
  [behandlingType.ANKE]: '#C86151',
  [behandlingType.INNSYN]: '#FF9100',
  [behandlingType.KLAGE]: '#634689',
  [behandlingType.REVURDERING]: '#66CBEC',
  [behandlingType.FORSTEGANGSSOKNAD]: '#0067C5',
  [behandlingType.TILBAKEBETALING]: '#69CA20',
};

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

interface OwnProps {
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  historiskData: HistoriskData[];
  isFireUkerValgt: boolean;
  erPunsjValgt: boolean;
}

interface CrosshairValue {
  x: Date;
  y: number;
}

/**
 * TilBehandlingGraf.
 */
const HistorikkGraf: FunctionComponent<OwnProps> = ({
  width,
  height,
  historiskData,
  isFireUkerValgt,
  behandlingTyper,
  erPunsjValgt,
}) => {
  const [crosshairValues, setCrosshairValues] = useState<CrosshairValue[]>([]);
  const onMouseLeave = useCallback(() => setCrosshairValues([]), []);
  const onNearestX = useCallback((value: {x: Date; y: number}) => {
    setCrosshairValues([value]);
  }, []);

  const periodeStart = moment().subtract(isFireUkerValgt ? 4 : 8, 'w').add(1, 'd');
  const periodeSlutt = moment().subtract(1, 'd');

  const koordinater = useMemo(() => konverterTilKoordinaterGruppertPaBehandlingstype(historiskData), [historiskData]);

  const data = useMemo(() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt), [koordinater, periodeStart, periodeSlutt]);

  const sorterteBehandlingstyper = Object.keys(data).sort(sorterBehandlingtyper);
  const reversertSorterteBehandlingstyper = sorterteBehandlingstyper.slice().reverse();

  const isEmpty = sorterteBehandlingstyper.length === 0;
  const plotPropsWhenEmpty = isEmpty ? {
    yDomain: [0, 5],
    xDomain: [periodeStart.toDate(), periodeSlutt.toDate()],
  } : {};

  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <XYPlot
            dontCheckIfEmpty={isEmpty}
            width={width - LEGEND_WIDTH > 0 ? width - LEGEND_WIDTH : 100 + LEGEND_WIDTH}
            height={height}
            margin={{
              left: 70, right: 40, top: 20, bottom: 40,
            }}
            stackBy="y"
            xType="time"
            onMouseLeave={onMouseLeave}
            {...plotPropsWhenEmpty}
          >
            <MarkSeries data={[{ x: moment().subtract(1, 'd'), y: 0 }]} style={{ display: 'none' }} />
            <HorizontalGridLines />
            <XAxis
              tickTotal={9}
              tickFormat={(t) => moment(t).format(DD_MM_DATE_FORMAT)}
              style={{ text: cssText }}
            />
            <YAxis style={{ text: cssText }} />
            {sorterteBehandlingstyper.map((k, index) => (
              <AreaSeries
                key={k}
                data={data[k]}
                onNearestX={index === 0 ? onNearestX : () => undefined}
                fill={erPunsjValgt ? '#9A1788' : behandlingstypeFarger[k]}
                stroke={erPunsjValgt ? '#9A1788' : behandlingstypeFarger[k]}
              />
            ))}
            {crosshairValues.length > 0 && (
              <Crosshair
                values={crosshairValues}
                style={{
                  line: {
                    background: '#3e3832',
                  },
                }}
              >
                <div className={styles.crosshair}>
                  <Normaltekst>{`${moment(crosshairValues[0].x).format(DD_MM_DATE_FORMAT)}`}</Normaltekst>
                  {!erPunsjValgt && reversertSorterteBehandlingstyper.map((key) => (
                    <Undertekst key={key}>
                      {`${finnBehandlingTypeNavn(behandlingTyper, key)}: ${finnAntallForBehandlingstypeOgDato(data, key, crosshairValues[0].x)}`}
                    </Undertekst>
                  ))}
                  {erPunsjValgt && <Undertekst>{`Punsj: ${finnAntallForBehandlingstypeOgDato(data, 'PUNSJ', crosshairValues[0].x)}`}</Undertekst>}
                </div>
              </Crosshair>
            )}
          </XYPlot>
        </FlexColumn>
      </FlexRow>
      <Row className={styles.legends}>
        <DiscreteColorLegend
          orientation="horizontal"
          colors={erPunsjValgt
            ? []
            : behandlingstypeOrder.map((bt) => behandlingstypeFarger[bt])}
          items={erPunsjValgt ? []
            : behandlingstypeOrder.map((bt) => (
              <Normaltekst className={styles.displayInline}>{finnBehandlingTypeNavn(behandlingTyper, bt)}</Normaltekst>
            ))}
        />
      </Row>
    </FlexContainer>
  );
};

export default HistorikkGraf;
