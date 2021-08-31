import React, {
  useMemo, useState, FunctionComponent, useCallback, useRef,
} from 'react';
import {
  XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalRectSeries, Hint, DiscreteColorLegend,
} from 'react-vis';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import { punsjYKoordinat } from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagGraf';
import AlleOppgaver from './alleOppgaverTsType';

import 'react-vis/dist/style.css';
import styles from './fordelingAvBehandlingstypeGraf.less';

const LEGEND_WIDTH = 210;

const behandlingstypeOrder = [
  behandlingType.TILBAKEBETALING,
  behandlingType.ANKE,
  behandlingType.INNSYN,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD,
];

const settCustomHoydePaSoylene = (data) => {
  const transformert = data.map((el) => ({
    ...el,
    y0: el.y + 0.30,
    y: el.y - 0.30,
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

const formatData = (alleOppgaver, skalPunsjVises: boolean) => {
  const sammenslatteBehandlingstyper = alleOppgaver
    .reduce((acc, o) => {
      const index = skalPunsjVises ? punsjYKoordinat : behandlingstypeOrder.indexOf(o.behandlingType.kode) + 1;
      return {
        ...acc,
        [index]: (acc[index] ? acc[index] + o.antall : o.antall),
      };
    }, {});

  return Object.keys(sammenslatteBehandlingstyper)
    .map((k) => ({ x: sammenslatteBehandlingstyper[k], y: parseInt(k, 10) }));
};

const cssText = {
  fontFamily: 'Source Sans Pro, Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
};

const getHintAntall = (verdi, intl) => intl.formatMessage({ id: 'FordelingAvBehandlingstypeGraf.Antall' }, {
  antall: verdi.x0 ? verdi.x - verdi.x0 : verdi.x,
});
const getHintTotalAntall = (verdi, tilBeslutter, tilSaksbehandling, intl) => {
  const y = Math.ceil(verdi.y);
  const beslutterAntall = tilBeslutter.find((b) => b.y === y);
  const sum1 = beslutterAntall ? beslutterAntall.x : 0;
  const saksbehandlingAntall = tilSaksbehandling.find((b) => b.y === y);
  const sum2 = saksbehandlingAntall ? saksbehandlingAntall.x : 0;
  return intl.formatMessage({ id: 'FordelingAvBehandlingstypeGraf.TotaltAntall' }, { antall: sum1 + sum2 });
};

interface OwnProps {
  intl: any;
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  alleOppgaver: AlleOppgaver[];
  erPunsjValgt: boolean;
}

interface Koordinat {
  x: number;
  x0: number;
  y: number;
}

/**
 * FordelingAvBehandlingstypeGraf.
 */
const FordelingAvBehandlingstypeGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  alleOppgaver,
  behandlingTyper,
  erPunsjValgt,
}) => {
  const [hintVerdi, setHintVerdi] = useState<Koordinat>();

  const leggTilHintVerdi = useCallback((verdi: Koordinat) => {
    setHintVerdi(verdi);
  }, []);
  const fjernHintVerdi = useCallback(() => {
    setHintVerdi(undefined);
  }, []);

  const stateRef = useRef({ skalPunsjbehandlingerVises: erPunsjValgt });
  stateRef.current.skalPunsjbehandlingerVises = erPunsjValgt;

  const finnBehandlingTypeNavn = useCallback((_v, i) => {
    const type = behandlingTyper.find((bt) => bt.kode === behandlingstypeOrder[i]);
    if (stateRef.current.skalPunsjbehandlingerVises) return 'Punsj';
    return type ? type.navn : '';
  }, []);
  const tilSaksbehandling = useMemo(() => formatData(alleOppgaver.filter((o) => o.tilBehandling), stateRef.current.skalPunsjbehandlingerVises), [alleOppgaver]);
  const tilBeslutter = useMemo(() => formatData(alleOppgaver.filter((o) => !o.tilBehandling), stateRef.current.skalPunsjbehandlingerVises), [alleOppgaver]);
  const isEmpty = tilSaksbehandling.length === 0 && tilBeslutter.length === 0;

  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <XYPlot
            dontCheckIfEmpty={isEmpty}
            margin={{
              left: stateRef.current.skalPunsjbehandlingerVises ? 150 : 170, right: 40, top: 40, bottom: 0,
            }}
            width={width - LEGEND_WIDTH > 0 ? width - LEGEND_WIDTH : 100 + LEGEND_WIDTH}
            height={height}
            stackBy="x"
            yDomain={stateRef.current.skalPunsjbehandlingerVises ? [0, 6] : [0, 7]}
            {...(isEmpty ? { xDomain: [0, 100] } : {})}
          >
            <VerticalGridLines />
            <XAxis orientation="top" style={{ text: cssText }} />
            <YAxis
              style={{ text: cssText }}
              tickFormat={finnBehandlingTypeNavn}
              tickValues={stateRef.current.skalPunsjbehandlingerVises ? [punsjYKoordinat] : [1, 2, 3, 4, 5, 6]}
            />
            <HorizontalRectSeries
              data={settCustomHoydePaSoylene(tilSaksbehandling)}
              onValueMouseOver={leggTilHintVerdi}
              onValueMouseOut={fjernHintVerdi}
              fill="#634689"
              stroke="#634689"
            />
            <HorizontalRectSeries
              data={settCustomHoydePaSoylene(tilBeslutter)}
              onValueMouseOver={leggTilHintVerdi}
              onValueMouseOut={fjernHintVerdi}
              fill="#FF9100"
              stroke="#FF9100"
            />
            {hintVerdi && (
            <Hint value={hintVerdi}>
              <div className={styles.hint}>
                {getHintAntall(hintVerdi, intl)}
                <br />
                {getHintTotalAntall(hintVerdi, tilBeslutter, tilSaksbehandling, intl)}
              </div>
            </Hint>
            )}
          </XYPlot>
        </FlexColumn>
        {!stateRef.current.skalPunsjbehandlingerVises && (
        <FlexColumn>
          <DiscreteColorLegend
            colors={['#634689', '#FF9100']}
            items={[
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="FordelingAvBehandlingstypeGraf.TilBehandling" />
              </Normaltekst>,
              <Normaltekst className={styles.displayInline}>
                <FormattedMessage id="FordelingAvBehandlingstypeGraf.TilBeslutter" />
              </Normaltekst>,
            ]}
          />
        </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
  );
};

export default injectIntl(FordelingAvBehandlingstypeGraf);
