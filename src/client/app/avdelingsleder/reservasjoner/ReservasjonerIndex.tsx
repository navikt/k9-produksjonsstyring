import React, { FunctionComponent, useCallback, useEffect } from 'react';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import ReservasjonerTabell from './components/ReservasjonerTabell';

const EMPTY_ARRAY = [];

export const ReservasjonerIndex: FunctionComponent = () => {
  const { data: reservasjoner = EMPTY_ARRAY, state, startRequest: hentAlleReservasjoner } = useRestApiRunner<Reservasjon[]>(
    K9LosApiKeys.HENT_ALLE_RESERVASJONER,
  );
  const requestFinished = state === RestApiState.SUCCESS;

  useEffect(() => {
    hentAlleReservasjoner();
  }, []);

  return (
    <ReservasjonerTabell
      reservasjoner={reservasjoner}
      hentAlleReservasjoner={hentAlleReservasjoner}
      requestFinished={requestFinished}
    />
  );
};

export default ReservasjonerIndex;
