import React, {
  useState, useRef, FunctionComponent, useEffect, useCallback,
} from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import BeholdningHistorikkPanel
  from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import BehandlingerGårAvVent from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/BehandlingerGårAvVent';
import IBehandlingerSomGarAvVentType
  from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/behandlingerSomGårAvVentType';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';
import ferdigstilteHistorikk from '../../../../mocks/ferdigstilteHistorikk';

interface OwnProps {
    alleOppgaver: AlleOppgaver[];
    ferdigstiltePerDato: HistoriskData[];
    behandlingerSomGårAvVent: IBehandlingerSomGarAvVentType[];
    beholdningPerDato?: HistoriskData[];
}

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDato,
  behandlingerSomGårAvVent,
  beholdningPerDato,
}) => {
  const [width, setWidth] = useState(0);
  const height = 200;

  const ref = useRef(null);

  const oppdaterGrafStorrelse = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [ref.current]);

  useEffect(() => {
    oppdaterGrafStorrelse();
    window.addEventListener('resize', oppdaterGrafStorrelse);

    return () => {
      window.removeEventListener('resize', oppdaterGrafStorrelse);
    };
  }, []);

  return (
    <div ref={ref}>
      <InngangOgFerdigstiltePanel
        width={width}
        height={height}
        getValueFromLocalStorage={getValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <NyeHistorikkPanel
        width={width}
        height={height}
        nyePerDato={ferdigstilteHistorikk}
        getValueFromLocalStorage={getValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <FerdigstilteHistorikkPanel
        width={width}
        height={height}
        ferdigstiltePerDato={ferdigstiltePerDato}
        getValueFromLocalStorage={getValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <BeholdningHistorikkPanel
        width={width}
        height={height}
        beholdningPerDato={beholdningPerDato}
        getValueFromLocalStorage={getValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <FordelingAvBehandlingstypePanel
        width={width}
        height={height}
        alleOppgaver={alleOppgaver}
        getValueFromLocalStorage={getValueFromLocalStorage}
      />
      <VerticalSpacer twentyPx />
      <BehandlingerGårAvVent
        width={width}
        height={height}
        behandlingerSomGårAvVent={behandlingerSomGårAvVent}
      />
    </div>
  );
};

export default NokkeltallPanel;
