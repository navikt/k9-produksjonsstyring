import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { SaksbehandlerNokkeltallIndex } from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNokkeltallIndex';

import SistBehandledeSaker from './SistBehandledeSaker';

interface OwnProps {
  valgtOppgavekoId?: string;
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
}) => (
  <>
    <SistBehandledeSaker />
    <VerticalSpacer twentyPx />
    {valgtOppgavekoId
      && (
      <SaksbehandlerNokkeltallIndex
        valgtOppgavekoId={valgtOppgavekoId}
      />
      )}
  </>
);

export default SaksstottePaneler;
