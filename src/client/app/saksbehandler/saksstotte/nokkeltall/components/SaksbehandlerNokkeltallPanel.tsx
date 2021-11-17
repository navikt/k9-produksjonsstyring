import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import NyeOgFerdigstilteOppgaverForIdagPanel from './nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvPanel from './nyeOgFerdigstilteOppgaverForSisteSyv/NyeOgFerdigstilteOppgaverForSisteSyvPanel';
import nyeOgFerdigstilteOppgaver from '../../../../../mocks/nyeOgFerdigstilteOppgaver';

interface OwnProps {
    nyeOgFerdigstilteOppgaverr: NyeOgFerdigstilteOppgaver[]
}

/**
 * SaksbehandlerNokkeltallPanel.
 */
const SaksbehandlerNokkeltallPanel: FunctionComponent<OwnProps> = ({ nyeOgFerdigstilteOppgaverr }) => {
  const height = 300;

  return (
    <div>
      <NyeOgFerdigstilteOppgaverForIdagPanel
        nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
      />
      <VerticalSpacer sixteenPx />
      <NyeOgFerdigstilteOppgaverForSisteSyvPanel
        height={height}
        nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
      />
    </div>
  );
};

export default SaksbehandlerNokkeltallPanel;
