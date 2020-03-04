
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAvdelingensSaksbehandlere = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SAKSBEHANDLERE_FOR_AVDELING.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);
export const getAvdelingensSaksbehandlere = k9LosApi.SAKSBEHANDLERE_FOR_AVDELING.getRestApiData();

export const findSaksbehandler = (brukerIdent: string) => (dispatch: Dispatch) => dispatch(k9LosApi.SAKSBEHANDLER_SOK.makeRestApiRequest()(
  brukerIdent,
));
export const getSaksbehandler = k9LosApi.SAKSBEHANDLER_SOK.getRestApiData();
export const getSaksbehandlerSokFinished = k9LosApi.SAKSBEHANDLER_SOK.getRestApiFinished();
export const resetSaksbehandlerSok = () => (dispatch: Dispatch) => dispatch(k9LosApi.SAKSBEHANDLER_SOK.resetRestApi()());

export const addSaksbehandler = (brukerIdent: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPRETT_NY_SAKSBEHANDLER.makeRestApiRequest()(
    { brukerIdent, avdelingEnhet },
  ),
).then(() => fetchAvdelingensSaksbehandlere(avdelingEnhet)(dispatch));

export const removeSaksbehandler = (brukerIdent: string, avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SLETT_SAKSBEHANDLER.makeRestApiRequest()(
    { brukerIdent, avdelingEnhet },
  ),
).then(() => fetchAvdelingensSaksbehandlere(avdelingEnhet)(dispatch));
