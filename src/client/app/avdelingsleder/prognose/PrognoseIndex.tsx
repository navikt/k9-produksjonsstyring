import React, {
  FunctionComponent,
} from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import IBehandlingerSomGarAvVentType
  from './behandlingerGårAvVent/behandlingerSomGårAvVentType';
import BehandlingerGårAvVent from './behandlingerGårAvVent/BehandlingerGårAvVent';
import useRestApi from '../../api/rest-api-hooks/src/local-data/useRestApi';

const PrognoseIndex: FunctionComponent = () => {
  const {
    data: behandlingerSomGårAvVent = [],
  } = useRestApi<IBehandlingerSomGarAvVentType[]>(K9LosApiKeys.HENT_BEHANDLINGER_SOM_GÅR_AV_VENT);

  return (
    <div>
      <BehandlingerGårAvVent
        behandlingerSomGårAvVent={behandlingerSomGårAvVent}
      />
    </div>
  );
};

export default PrognoseIndex;
