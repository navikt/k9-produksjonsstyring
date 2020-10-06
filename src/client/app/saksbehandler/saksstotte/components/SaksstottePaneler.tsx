import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import SaksbehandlerNokkeltallIndex from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNokkeltallIndex';

import SistBehandledeSaker from './SistBehandledeSaker';

/**
 * SaksstottePaneler
 */
const SaksstottePaneler: FunctionComponent = () => (
  <>
    <SistBehandledeSaker />
    <VerticalSpacer twentyPx />
    <SaksbehandlerNokkeltallIndex />
  </>
);

export default SaksstottePaneler;
