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

export const endreOppgaveReservasjon = (oppgaveId: string, reserverTil: string) => (dispatch: Dispatch<any>) => dispatch(
  k9LosApi.ENDRE_OPPGAVERESERVASJON.makeRestApiRequest()(
    { oppgaveId, reserverTil },
  ),
).then(() => dispatch(fetchAlleReservasjoner()));


export const finnSaksbehandler = (brukerIdent: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.makeRestApiRequest()({ brukerIdent }),
);
export const resetSaksbehandler = () => (dispatch: Dispatch) => dispatch(k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.resetRestApi()());
