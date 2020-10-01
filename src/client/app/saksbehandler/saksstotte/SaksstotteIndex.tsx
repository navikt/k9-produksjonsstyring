import React, { FunctionComponent } from 'react';
import SaksstottePaneler from './components/SaksstottePaneler';

interface OwnProps {
  valgtOppgavekoId?: string;
}

/**
 * SaksstotteIndex
 */
const SaksstotteIndex: FunctionComponent<OwnProps> = ({ valgtOppgavekoId }) => (
  <SaksstottePaneler valgtOppgavekoId={valgtOppgavekoId} />
);

export default SaksstotteIndex;
