import React, {
  FunctionComponent, useCallback, useMemo, useState,
} from 'react';
import IBehandlingerSomGarAvVentType
  from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/behandlingerSomGårAvVentType';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';

import Panel from 'nav-frontend-paneler';
import {
  XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, Crosshair,
} from 'react-vis';
import { cssText } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import dayjs from 'dayjs';
import styles
  from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverForSisteSyv/nyeOgFerdigstilteOppgaverForSisteSyvGraf.less';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Koordinat from '../../../../types/Koordinat';

const slaSammenBehandlingstyperOgFyllInnTomme = (behandlingerPåVent: IBehandlingerSomGarAvVentType[], antallUkerFremITid: number):
  { antall: number; dato: Date }[] => {
  const behandlingerSomGårAvVentPerDag = [];
  const antallDagerFremITid: number = antallUkerFremITid * 7;

  if (behandlingerPåVent.length > 0) {
    const iDag = dayjs().startOf('day');
    const dagerFremITid = dayjs().add(antallDagerFremITid, 'days').startOf('day');

    for (let dato = iDag; dato.isBefore(dagerFremITid); dato = dato.add(1, 'days')) {
      const behandlingerSomGårAvVentPåDenneDagen = behandlingerPåVent.filter((o) => dayjs(o.dato).startOf('day').isSame(dato));
      if (behandlingerSomGårAvVentPåDenneDagen.length === 0) {
        behandlingerSomGårAvVentPerDag.push({
          antall: 0,
          dato: dato.toDate(),
        });
      } else {
        behandlingerSomGårAvVentPerDag.push({
          antall: behandlingerSomGårAvVentPåDenneDagen.reduce((acc, d) => acc + d.antall, 0),
          dato: dato.toDate(),
        });
      }
    }
  }
  return behandlingerSomGårAvVentPerDag;
};

interface OwnProps{
  behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
  width: number;
  height: number;
  antallUkerSomSkalVises: string;
}

const BehandlingerGårAvVentGraf: FunctionComponent<OwnProps> = ({
  behandlingerSomGårAvVent,
  width,
  height,
  antallUkerSomSkalVises,
}) => {
  const [onHoverPåDatoVerdier, setOnHoverPåDatoVerdier] = useState([]);

  const finnesBehandlinger = behandlingerSomGårAvVent.length === 0;

  const onNearestX = useCallback((value: {x: Date; y: number}) => {
    setOnHoverPåDatoVerdier([value]);
  }, []);

  const plotPropsWhenEmpty = finnesBehandlinger ? {
    yDomain: [0, 50],
    xDomain: [dayjs().startOf('day'), dayjs().startOf('day')],
  } : {};

  const behandlingerSomGårAvVentToUkerFremITid = useMemo(
    () => slaSammenBehandlingstyperOgFyllInnTomme(behandlingerSomGårAvVent, 2),
    [behandlingerSomGårAvVent],
  );

  const behandlingerSomGårAvVentFireUkerFremITid = useMemo(
    () => slaSammenBehandlingstyperOgFyllInnTomme(behandlingerSomGårAvVent, 4),
    [behandlingerSomGårAvVent],
  );

  const behandlingerSomGårAvVentToUkerFremITidKoordinater = useMemo(() => behandlingerSomGårAvVentToUkerFremITid.map((o) => ({
    x: o.dato,
    y: o.antall,
  })), [behandlingerSomGårAvVent]);

  const behandlingerSomGårAvVentFireUkerFremITidKoordinater = useMemo(() => behandlingerSomGårAvVentFireUkerFremITid.map((o) => ({
    x: o.dato,
    y: o.antall,
  })), [behandlingerSomGårAvVent]);

  const getAntallBehandlingerPerDagTilPopup = (behandlinger: Koordinat[]) => {
    const behandling = behandlinger.find((o) => o.x.getTime() === onHoverPåDatoVerdier[0].x.getTime());
    return behandling ? behandling.y : '';
  };

  return (
    <Panel>
      <XYPlot
        dontCheckIfEmpty={finnesBehandlinger}
        margin={{
          left: 40, right: 60, top: 10, bottom: 30,
        }}
        width={width - 50}
        height={height}
        xType="time"
        {...plotPropsWhenEmpty}
      >
        <HorizontalGridLines />
        <XAxis
          tickTotal={3}
          tickFormat={(t) => dayjs(t).format(DDMMYYYY_DATE_FORMAT)}
          style={{ text: cssText }}
        />
        <YAxis style={{ text: cssText }} />
        <LineSeries
          data={antallUkerSomSkalVises === '4' ? behandlingerSomGårAvVentFireUkerFremITidKoordinater : behandlingerSomGårAvVentToUkerFremITidKoordinater}
          fill="#FF9100"
          stroke="#FF9100"
          opacity={0.5}
          onNearestX={onNearestX}
        />
        {onHoverPåDatoVerdier.length > 0 && (
          <Crosshair
            values={onHoverPåDatoVerdier}
            style={{
              line: {
                background: '#3e3832',
              },
            }}
          >
            <div className={styles.crosshair}>
              <Normaltekst>{`${dayjs(onHoverPåDatoVerdier[0].x).format(DDMMYYYY_DATE_FORMAT)}`}</Normaltekst>
              <Undertekst>
                <FormattedMessage
                  id="FordelingAvBehandlingstypeGraf.Antall"
                  values={{
                    antall: getAntallBehandlingerPerDagTilPopup(
                      antallUkerSomSkalVises === '4' ? behandlingerSomGårAvVentFireUkerFremITidKoordinater : behandlingerSomGårAvVentToUkerFremITidKoordinater,
                    ),
                  }}
                />
              </Undertekst>
            </div>
          </Crosshair>
        )}
      </XYPlot>

    </Panel>
  );
};
export default BehandlingerGårAvVentGraf;
