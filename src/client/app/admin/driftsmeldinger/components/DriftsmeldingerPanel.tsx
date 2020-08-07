import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Driftsmelding } from '../driftsmeldingTsType';
import driftsmeldingPropType from '../driftsmeldingPropType';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';

interface TsProps {
    driftsmeldinger: Driftsmelding[];
    finnDriftsmelding: (brukerIdent: string) => Promise<string>;
    resetDriftsmeldingSok: () => void;
    leggTilDriftsmelding: (epost: string) => Promise<string>;
    fjernDriftsmelding: (epost: string) => Promise<string>;
}

/**
 * DriftsmeldingerPanel
 */
const DriftsmeldingerPanel = ({
  driftsmeldinger,
  finnDriftsmelding,
  resetDriftsmeldingSok,
  leggTilDriftsmelding,
  fjernDriftsmelding,
}: TsProps) => (
  <>
    <DriftsmeldingerTabell driftsmeldinger={driftsmeldinger} fjernDriftsmelding={fjernDriftsmelding} />
    <VerticalSpacer sixteenPx />
    <LeggTilDriftsmeldingForm
      finnDriftsmelding={finnDriftsmelding}
      leggTilDriftsmelding={leggTilDriftsmelding}
      resetDriftsmeldingSok={resetDriftsmeldingSok}
      driftsmeldinger={driftsmeldinger}
    />
  </>
);

DriftsmeldingerPanel.propTypes = {
  driftsmeldinger: PropTypes.arrayOf(driftsmeldingPropType).isRequired,
  finnDriftsmelding: PropTypes.func.isRequired,
  resetDriftsmeldingSok: PropTypes.func.isRequired,
  leggTilDriftsmelding: PropTypes.func.isRequired,
  fjernDriftsmelding: PropTypes.func.isRequired,
};

export default DriftsmeldingerPanel;
