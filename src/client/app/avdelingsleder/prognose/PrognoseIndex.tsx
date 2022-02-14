import React, { FunctionComponent } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import BehandlingerGårAvVent from './behandlingerGårAvVent/BehandlingerGårAvVent';
import useRestApi from '../../api/rest-api-hooks/src/local-data/useRestApi';
import BehandlingerSomGaarAvVentAarsakerPanel from './behandlingerGårAvVentÅrsaker/BehandlingerGårAvVentÅrsakerPanel';
import { RestApiState } from 'api/rest-api-hooks';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

const PrognoseIndex: FunctionComponent = () => {
  const { data, state } = useRestApi<any>(K9LosApiKeys.HENT_BEHANDLINGER_SOM_GÅR_AV_VENT);

  return (
    <div>
      {state === RestApiState.SUCCESS && <BehandlingerGårAvVent behandlingerSomGårAvVent={data.påVent || []} />}
      <VerticalSpacer twentyPx />
      <BehandlingerSomGaarAvVentAarsakerPanel />
    </div>
  );
};

export default PrognoseIndex;
