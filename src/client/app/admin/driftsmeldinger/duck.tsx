import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAlleDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.makeRestApiRequest();
export const getDriftsmeldinger = k9LosApi.DRIFTSMELDINGER.getRestApiData();

export const finnDriftsmelding = (melding: string) => (dispatch: Dispatch) => dispatch(k9LosApi.DRIFTSMELDINGER_SOK.makeRestApiRequest()(
  { melding },
));
export const resetDriftsmeldingerSok = () => (dispatch: Dispatch) => dispatch(k9LosApi.DRIFTSMELDINGER_SOK.resetRestApi()());

export const addDriftsmelding = (driftsmelding: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LAGRE_DRIFTSMELDING.makeRestApiRequest()(
    { driftsmelding },
  ),
).then(() => fetchAlleDriftsmeldinger()(dispatch));

export const removeDriftsmelding = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_DRIFTSMELDING.makeRestApiRequest()(
    { id },
  ),
).then(() => fetchAlleDriftsmeldinger()(dispatch));

export const switchDriftsmelding = (id: string, isChecked: boolean) => (dispatch: Dispatch) => dispatch(
  k9LosApi.TOGGLE_DRIFTSMELDING.makeRestApiRequest()(
    {
      id,
      aktiv: isChecked,
    },
  ),
).then(() => fetchAlleDriftsmeldinger()(dispatch));
