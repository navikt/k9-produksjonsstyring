import React from 'react';
import PropTypes from 'prop-types';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Driftsmelding } from '../driftsmeldingTsType';
import driftsmeldingPropType from '../driftsmeldingPropType';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';

interface TsProps {
    driftsmeldinger: Driftsmelding[];
    leggTilDriftsmelding: (id: string) => Promise<string>;
    fjernDriftsmelding: (id: string) => Promise<string>;
    switchDriftsmelding : (id: string, isChecked: boolean) => Promise<string>;

}

/**
 * DriftsmeldingerPanel
 */
const DriftsmeldingerPanel = ({
  driftsmeldinger,
  leggTilDriftsmelding,
  fjernDriftsmelding,
  switchDriftsmelding,
}: TsProps) => (
  <>
    <DriftsmeldingerTabell driftsmeldinger={driftsmeldinger} fjernDriftsmelding={fjernDriftsmelding} switchDriftsmelding={switchDriftsmelding} />
    <VerticalSpacer sixteenPx />
    <LeggTilDriftsmeldingForm
      leggTilDriftsmelding={leggTilDriftsmelding}
    />
  </>
);

DriftsmeldingerPanel.propTypes = {
  driftsmeldinger: PropTypes.arrayOf(driftsmeldingPropType).isRequired,
  leggTilDriftsmelding: PropTypes.func.isRequired,
  fjernDriftsmelding: PropTypes.func.isRequired,
  switchDriftsmelding: PropTypes.func.isRequired,
};

export default DriftsmeldingerPanel;
