import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Driftsmelding } from './driftsmeldingTsType';

import DriftsmeldingePanel from './components/DriftsmeldingerPanel';

interface OwnProps {
    alleDriftsmeldinger: Driftsmelding[];
}

/**
 * EndreDriftsmeldingeIndex
 */
const EndreDriftsmeldingerIndex: FunctionComponent = () => (
  <DriftsmeldingePanel />
);

export default injectIntl(EndreDriftsmeldingerIndex);
