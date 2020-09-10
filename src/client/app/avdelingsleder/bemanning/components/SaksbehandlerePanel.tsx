import React, { FunctionComponent } from 'react';

import { Saksbehandler } from '../saksbehandlerTsType';
import SaksbehandlereTabell from './SaksbehandlereTabell';

interface OwnProps {
  saksbehandlere: Saksbehandler[];
  resetSaksbehandlerSok: () => void;
  leggTilSaksbehandler: (epost: string) => Promise<string>;
  fjernSaksbehandler: (epost: string) => Promise<string>;
}

/**
 * SaksbehandlerePanel
 */
const SaksbehandlerePanel: FunctionComponent<OwnProps> = ({
  saksbehandlere,
  resetSaksbehandlerSok,
  leggTilSaksbehandler,
  fjernSaksbehandler,
}) => (
  <SaksbehandlereTabell
    saksbehandlere={saksbehandlere}
    fjernSaksbehandler={fjernSaksbehandler}
    leggTilSaksbehandler={leggTilSaksbehandler}
    resetSaksbehandlerSok={resetSaksbehandlerSok}
  />
);

export default SaksbehandlerePanel;
