import React, { useEffect } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import DriftsmeldingerPanel from './components/DriftsmeldingerPanel';
import { Driftsmelding } from './driftsmeldingTsType';

/**
 * EndreDriftsmeldingeIndex
 */

const EndreDriftsmeldingerIndex = () => {
  const { startRequest: hentAlleDriftsmeldinger, data: driftsmeldinger = [] } = useRestApiRunner<Driftsmelding[]>(
    K9LosApiKeys.DRIFTSMELDINGER,
  );

  useEffect(() => {
    hentAlleDriftsmeldinger();
  }, []);

  return <DriftsmeldingerPanel driftsmeldinger={driftsmeldinger} hentAlleDriftsmeldinger={hentAlleDriftsmeldinger} />;
};

export default EndreDriftsmeldingerIndex;
