import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { SaksbehandlerNokkeltallIndex } from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNokkeltallIndex';

import BehandletOppgave from 'saksbehandler/saksstotte/behandletOppgaveTsType';
import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from 'saksbehandler/saksstotte/nokkeltall/duck';
import SistBehandledeSaker from './SistBehandledeSaker';

interface OwnProps {
  k9sakUrl: string;
  sistBehandledeSaker: BehandletOppgave[];
  valgtOppgavekoId?: string;
}

/**
 * SaksstottePaneler
 */
const SaksstottePaneler: FunctionComponent<OwnProps> = ({
  k9sakUrl,
  sistBehandledeSaker,
  valgtOppgavekoId,
}) => (
  <>
    <SistBehandledeSaker k9sakUrl={k9sakUrl} sistBehandledeSaker={sistBehandledeSaker} />
    <VerticalSpacer twentyPx />
    {valgtOppgavekoId
      && (
      <SaksbehandlerNokkeltallIndex
        valgtOppgavekoId={valgtOppgavekoId}
        fetchNyeOgFerdigstilteOppgaverNokkeltall={fetchNyeOgFerdigstilteOppgaverNokkeltall}
      />
      )}
  </>
);

export default SaksstottePaneler;
