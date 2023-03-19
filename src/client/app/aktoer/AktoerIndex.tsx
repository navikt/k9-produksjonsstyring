import React, { FunctionComponent, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import useTrackRouteParam from 'app/data/trackRouteParam';
import { K9LosApiKeys } from 'api/k9LosApi';
import { RestApiState } from 'api/rest-api-hooks';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import useRestApiRunner from '../api/rest-api-hooks/src/local-data/useRestApiRunner';
import AktoerGrid from './AktoerGrid';
import styles from './aktoerIndex.css';

/**
 * AktoerIndex
 */
export const AktoerIndex: FunctionComponent = () => {
  const { selected: selectedAktoerId } = useTrackRouteParam<string>({
    paramName: 'aktoerId',
    parse: aktoerIdFromUrl => Number.parseInt(aktoerIdFromUrl, 10),
  });

  const {
    startRequest: sokAktoerId,
    state,
    data: resultat,
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
    return <AktoerGrid resultat={resultat} />;
  }

  return <p className={styles.ugyldig}>{`Ugyldig aktørId: ${selectedAktoerId}`}</p>;
};

export default AktoerIndex;
