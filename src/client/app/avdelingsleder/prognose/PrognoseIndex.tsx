import React, {
  useState, useRef, FunctionComponent, useEffect, useCallback,
} from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import IBehandlingerSomGarAvVentType
  from './behandlingerGårAvVent/behandlingerSomGårAvVentType';
import BehandlingerGårAvVent from './behandlingerGårAvVent/BehandlingerGårAvVent';
import useRestApi from '../../api/rest-api-hooks/src/local-data/useRestApi';

const PrognoseIndex: FunctionComponent = () => {
  const [width, setWidth] = useState(0);
  const {
    data: behandlingerSomGårAvVent = [],
  } = useRestApi<IBehandlingerSomGarAvVentType[]>(K9LosApiKeys.HENT_BEHANDLINGER_SOM_GÅR_AV_VENT);

  const height = 200;
  const ref = useRef(null);

  const oppdaterGrafStorrelse = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [ref.current]);

  useEffect(() => {
    oppdaterGrafStorrelse();
    window.addEventListener('resize', oppdaterGrafStorrelse);

    return () => {
      window.removeEventListener('resize', oppdaterGrafStorrelse);
    };
  }, []);

  return (
    <div ref={ref}>
      <BehandlingerGårAvVent
        width={width}
        height={height}
        behandlingerSomGårAvVent={behandlingerSomGårAvVent}
      />
    </div>
  );
};

export default PrognoseIndex;
