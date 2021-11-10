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
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';

interface OwnProps {
    alleOppgaver: AlleOppgaver[];
    ferdigstiltePerDato: HistoriskData[];
    beholdningPerDato?: HistoriskData[];
    nyePerDato?: HistoriskData[];
}

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent<OwnProps> = ({
  alleOppgaver,
  ferdigstiltePerDato,
  beholdningPerDato,
  nyePerDato,
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
        nyePerDato={nyePerDato}
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
    </div>
  );
};

export default NokkeltallPanel;
