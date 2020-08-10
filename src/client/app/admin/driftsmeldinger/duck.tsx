import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';
import { fetchAlleSaksbehandlere } from 'avdelingsleder/saksbehandlere/duck';

export const fetchAlleDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.makeRestApiRequest();
export const getDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.getRestApiData();

export const addDriftsmelding = (melding: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_DRIFTSMELDING.makeRestApiRequest()(
    { melding },
  ),
).then(() => fetchAlleSaksbehandlere()(dispatch));
