import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAlleReservasjoner = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_ALLE_RESERVASJONER.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const opphevReservasjon = (oppgaveId: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.AVDELINGSLEDER_OPPHEVER_RESERVASJON.makeRestApiRequest()(
    { oppgaveId },
  ),
);
export const getAlleReservasjoner = k9LosApi.HENT_ALLE_RESERVASJONER.getRestApiData();
