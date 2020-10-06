import React from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';

/**
 * DriftsmeldingerPanel
 */
const DriftsmeldingerPanel = () => (
  <>
    <DriftsmeldingerTabell />
    <VerticalSpacer sixteenPx />
    <LeggTilDriftsmeldingForm />
  </>
);

export default DriftsmeldingerPanel;
