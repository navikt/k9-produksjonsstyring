import React, { FunctionComponent } from 'react';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LeggTilDriftsmeldingForm from './LeggTilDriftsmeldingForm';
import DriftsmeldingerTabell from './DriftsmeldingerTabell';
import { Driftsmelding } from '../driftsmeldingTsType';

/**
 * DriftsmeldingerPanel
 */

interface OwnProps {
    driftsmeldinger: Driftsmelding[];
    hentAlleDriftsmeldinger: () => void;
}
const DriftsmeldingerPanel: FunctionComponent<OwnProps> = ({
  driftsmeldinger,
  hentAlleDriftsmeldinger,
}) => (
  <>
    <DriftsmeldingerTabell driftsmeldinger={driftsmeldinger} hentAlleDriftsmeldinger={hentAlleDriftsmeldinger} />
    <VerticalSpacer sixteenPx />
    <LeggTilDriftsmeldingForm hentAlleDriftsmeldinger={hentAlleDriftsmeldinger} />
  </>
);

export default DriftsmeldingerPanel;
