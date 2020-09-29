import React, {
  useState, useRef, FunctionComponent, useEffect, useCallback,
} from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import BeholdningHistorikkPanel
  from 'avdelingsleder/nokkeltall/components/beholdningHistorikk/BeholdningHistorikkPanel';
import FerdigstilteHistorikkPanel from 'avdelingsleder/nokkeltall/components/ferdigstilteHistorikk/FerdigstilteHistorikkPanel';
import NyeHistorikkPanel from 'avdelingsleder/nokkeltall/components/nyeHistorikk/NyeHistorikkPanel';
import FordelingAvBehandlingstypePanel from './fordelingAvBehandlingstype/FordelingAvBehandlingstypePanel';

/**
 * NokkeltallPanel.
 */
const NokkeltallPanel: FunctionComponent = () => {
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
      />
      <VerticalSpacer twentyPx />
      <NyeHistorikkPanel
        width={width}
        height={height}
      />
      <VerticalSpacer twentyPx />
      <FerdigstilteHistorikkPanel
        width={width}
        height={height}
      />
      <VerticalSpacer twentyPx />
      <BeholdningHistorikkPanel
        width={width}
        height={height}
      />
      <VerticalSpacer twentyPx />
      <FordelingAvBehandlingstypePanel
        width={width}
        height={height}
      />
    </div>
  );
};

export default NokkeltallPanel;
