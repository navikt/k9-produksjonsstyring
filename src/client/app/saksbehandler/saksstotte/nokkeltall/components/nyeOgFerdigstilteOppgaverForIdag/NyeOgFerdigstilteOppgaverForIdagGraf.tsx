import React, {
  useState, useMemo, useCallback, FunctionComponent,
} from 'react';
import {
  XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalRectSeries, Hint, DiscreteColorLegend,
} from 'react-vis';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import Kodeverk from 'kodeverk/kodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';

import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

import 'react-vis/dist/style.css';
import styles from './nyeOgFerdigstilteOppgaverForIdagGraf.less';

const behandlingstypeOrder = [
  behandlingType.INNSYN,
  behandlingType.ANKE,
  behandlingType.KLAGE,
  behandlingType.REVURDERING,
  behandlingType.FORSTEGANGSSOKNAD];

const cssText = {
  fontFamily: 'Source Sans Pro, Arial, sans-serif',
  fontSize: '1rem',
  lineHeight: '1.375rem',
  fontWeight: 400,
};

interface Koordinat {
  x: number;
  y: number;
}

const settCustomHoydePaSoylene = (data, over) => {
  const transformert = data.map((el) => ({
    ...el,
    y0: el.y + (over ? 0.15 : -0.13),
    y: el.y + (over ? -0.07 : -0.35),
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

const settCustomHoydePaSoylene2 = (data) => {
  const transformert = data.map((el) => ({
    ...el,
    y0: el.y + 0.41,
    y: el.y + 0.21,
  }));
  transformert.unshift({ x: 0, y: 0.5 });
  transformert.push({ x: 0, y: 4.5 });
  return transformert;
};

export const lagDatastrukturForFerdigstilte = (nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[]): Koordinat[] => settCustomHoydePaSoylene(
  nyeOgFerdigstilteOppgaver.map((value) => ({
    x: value.antallFerdigstilte,
    y: behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), true,
);

export const lagDatastrukturForNye = (nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[]): Koordinat[] => settCustomHoydePaSoylene2(
  nyeOgFerdigstilteOppgaver.map((value) => ({
    x: value.antallNye,
    y: behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })),
);

export const lagDatastrukturForFerdigstilteMine = (
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[],
): Koordinat[] => settCustomHoydePaSoylene(nyeOgFerdigstilteOppgaver
  .map((value) => ({
    x: value.antallFerdigstilteMine,
    y: behandlingstypeOrder.indexOf(value.behandlingType.kode) + 1,
  })), false);

interface OwnProps {
  width: number;
  height: number;
  behandlingTyper: Kodeverk[];
  nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
export const NyeOgFerdigstilteOppgaverForIdagGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  width,
  height,
  nyeOgFerdigstilteOppgaver,
  behandlingTyper,
}) => {
  const [hintVerdi, setHintVerdi] = useState<Koordinat>();

  const leggTilHintVerdi = useCallback((nyHintVerdi: {x: number; x0: number; y: number}) => {
    setHintVerdi(nyHintVerdi);
  }, []);

  const fjernHintVerdi = useCallback(() => {
    setHintVerdi(undefined);
  }, []);

  const ferdigstilteOppgaver = useMemo(() => lagDatastrukturForFerdigstilte(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);
  const ferdigstilteOppgaverMine = useMemo(() => lagDatastrukturForFerdigstilteMine(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);
  const nyeOppgaver = useMemo(() => lagDatastrukturForNye(nyeOgFerdigstilteOppgaver), [nyeOgFerdigstilteOppgaver]);

  const isEmpty = nyeOgFerdigstilteOppgaver.length === 0;

  const hintAntall = useMemo(() => {
    if (!hintVerdi) {
      return undefined;
    }

    const isFerdigstiltVerdi = ferdigstilteOppgaver.find((b) => b.y === hintVerdi.y);
    const isMineVerdi = ferdigstilteOppgaverMine.find((b) => b.y === hintVerdi.y);
    if (isFerdigstiltVerdi) {
      return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.FerdigstiltAntall' }, { antall: hintVerdi.x });
    } if (isMineVerdi) {
      return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.MineAntall' }, { antall: hintVerdi.x });
    }
    return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.NyeAntall' }, { antall: hintVerdi.x });
  }, [hintVerdi]);

  const finnBehandlingTypeNavn = useCallback((_v, i) => {
    if (behandlingstypeOrder[i] === behandlingType.FORSTEGANGSSOKNAD) {
      return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Førstegangsbehandling' });
    }

    const type = behandlingTyper.find((bt) => bt.kode === behandlingstypeOrder[i]);
    return type ? type.navn : '';
  }, []);

  const maxXValue = useMemo(() => Math.max(...ferdigstilteOppgaver.map((b) => b.x)
    .concat(nyeOppgaver.map((b) => b.x))
    .concat(ferdigstilteOppgaverMine.map((b) => b.x))) + 2,
  [ferdigstilteOppgaver, nyeOppgaver, ferdigstilteOppgaverMine]);

  return (
    <Panel>
      <XYPlot
        dontCheckIfEmpty={isEmpty}
        margin={{
          left: 127, right: 30, top: 0, bottom: 30,
        }}
        width={width}
        height={height}
        yDomain={[0, 7]}
        xDomain={[0, isEmpty ? 10 : maxXValue]}
      >
        <VerticalGridLines />
        <XAxis style={{ text: cssText }} />
        <YAxis
          style={{ text: cssText }}
          tickFormat={finnBehandlingTypeNavn}
          tickValues={[1, 2, 3, 4, 5]}
        />
        <HorizontalRectSeries
          data={nyeOppgaver}
          onValueMouseOver={leggTilHintVerdi}
          onValueMouseOut={fjernHintVerdi}
          fill="#0067C5"
          stroke="#0067C5"
          opacity={0.5}
        />
        <HorizontalRectSeries
          data={ferdigstilteOppgaver}
          onValueMouseOver={leggTilHintVerdi}
          onValueMouseOut={fjernHintVerdi}
          fill="#634689"
          stroke="#634689"
          opacity={0.5}
        />
        <HorizontalRectSeries
          data={ferdigstilteOppgaverMine}
          onValueMouseOver={leggTilHintVerdi}
          onValueMouseOut={fjernHintVerdi}
          fill="#FF9100"
          stroke="#FF9100"
          opacity={0.5}
        />
        {hintVerdi && (
          <Hint value={hintVerdi}>
            <div className={styles.hint}>
              {hintAntall}
            </div>
          </Hint>
        )}
      </XYPlot>
      <div className={styles.center}>
        <DiscreteColorLegend
          orientation="horizontal"
          colors={['#0067C5', '#634689', '#FF9100']}
          items={[
            <Normaltekst className={styles.displayInline}>
              <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagGraf.Nye" />
            </Normaltekst>,
            <Normaltekst className={styles.displayInline}>
              <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagGraf.Ferdigstilte" />
            </Normaltekst>,
            <Normaltekst className={styles.displayInline}>
              <FormattedMessage id="NyeOgFerdigstilteOppgaverForIdagGraf.FerdigstilteMine" />
            </Normaltekst>,
          ]}
        />
      </div>
    </Panel>
  );
};

export default injectIntl(NyeOgFerdigstilteOppgaverForIdagGraf);
