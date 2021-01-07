import React, { FunctionComponent, useEffect } from 'react';
import { useParams } from 'react-router';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { K9LosApiKeys } from 'api/k9LosApi';
import { RestApiState } from 'api/rest-api-hooks';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { Undertittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import useTrackRouteParam from 'app/data/trackRouteParam';
import useRestApiRunner from '../api/rest-api-hooks/src/local-data/useRestApiRunner';
import AktoerGrid from './AktoerGrid';

import styles from './aktoerIndex.less';

/**
 * AktoerIndex
 */
export const AktoerIndex: FunctionComponent = () => {
  const { selected: selectedAktoerId } = useTrackRouteParam<string>({
    paramName: 'aktoerId',
    parse: (aktoerIdFromUrl) => Number.parseInt(aktoerIdFromUrl, 10),
  });

  const {
    startRequest: sokAktoerId, state, resetRequestData: resetFagsakSok, data: resultat, error: fagsakError,
  } = useRestApiRunner<SokeResultat>(K9LosApiKeys.SEARCH_AKTOERID);

  useEffect(() => {
    sokAktoerId({ aktoerId: selectedAktoerId });
  }, []);

  if (state === RestApiState.LOADING) {
    return <LoadingPanel />;
  }

  if (state === RestApiState.SUCCESS && resultat.ikkeTilgang) {
    return (
      <Panel className={styles.container}>
        <Undertittel>
          <FormattedMessage id="FagsakSearch.IkkeTilgang" />
        </Undertittel>
      </Panel>
    );
  }

  if (state === RestApiState.SUCCESS && !resultat.ikkeTilgang) {
    return (
      <AktoerGrid
        resultat={resultat}
      />
    );
  }

  return (
    <p>{`Ugyldig aktørId: ${selectedAktoerId}`}</p>
  );
};

export default AktoerIndex;
