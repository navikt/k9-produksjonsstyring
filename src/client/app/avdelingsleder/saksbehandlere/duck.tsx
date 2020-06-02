import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAlleSaksbehandlere = k9LosApi.SAKSBEHANDLERE.makeRestApiRequest();
export const getSaksbehandlere = k9LosApi.SAKSBEHANDLERE.getRestApiData();

export const findSaksbehandler = (epost: string) => (dispatch: Dispatch) => dispatch(k9LosApi.SAKSBEHANDLER_SOK.makeRestApiRequest()(
  { epost },
));
export const getSaksbehandler = k9LosApi.SAKSBEHANDLER_SOK.getRestApiData();
export const getSaksbehandlerSokFinished = k9LosApi.SAKSBEHANDLER_SOK.getRestApiFinished();
export const resetSaksbehandlerSok = () => (dispatch: Dispatch) => dispatch(k9LosApi.SAKSBEHANDLER_SOK.resetRestApi()());

export const addSaksbehandler = (epost: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SAKSBEHANDLER_SOK.makeRestApiRequest()(
    { epost },
  ),
).then(() => fetchAlleSaksbehandlere()(dispatch));

export const removeSaksbehandler = (epost: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_SAKSBEHANDLER.makeRestApiRequest()(
    { epost },
  ),
).then(() => fetchAlleSaksbehandlere()(dispatch));
