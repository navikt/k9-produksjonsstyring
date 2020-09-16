import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Saksbehandler } from '../saksbehandlerTsType';
import saksbehandlerPropType from '../saksbehandlerPropType';
import LeggTilSaksbehandlerForm from './LeggTilSaksbehandlerForm';
import SaksbehandlereTabell from './SaksbehandlereTabell';

interface TsProps {
  saksbehandlere: Saksbehandler[];
  resetSaksbehandlerSok: () => void;
  leggTilSaksbehandler: (epost: string) => Promise<string>;
  fjernSaksbehandler: (epost: string) => Promise<string>;
}

/**
 * SaksbehandlerePanel
 */
const SaksbehandlerePanel = ({
  saksbehandlere,
  resetSaksbehandlerSok,
  leggTilSaksbehandler,
  fjernSaksbehandler,
}: TsProps) => (
  <>
    <SaksbehandlereTabell saksbehandlere={saksbehandlere} fjernSaksbehandler={fjernSaksbehandler} />
    <VerticalSpacer sixteenPx />
    <LeggTilSaksbehandlerForm
      leggTilSaksbehandler={leggTilSaksbehandler}
      resetSaksbehandlerSok={resetSaksbehandlerSok}
    />
  </>
);

SaksbehandlerePanel.propTypes = {
  saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType).isRequired,
  resetSaksbehandlerSok: PropTypes.func.isRequired,
  leggTilSaksbehandler: PropTypes.func.isRequired,
  fjernSaksbehandler: PropTypes.func.isRequired,
};

export default SaksbehandlerePanel;
