
import { createSelector } from 'reselect';
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

/* Action types */
const SET_OPPGAVEKO_ID = 'SET_OPPGAVEKO_ID';

/* Action creators */
export const setValgtOppgavekoId = (setOppgavekoId: string) => ({
  type: SET_OPPGAVEKO_ID,
  data: setOppgavekoId,
});

export const fetchAlleOppgavekoer = k9LosApi.OPPGAVEKO.makeRestApiRequest();
export const getOppgavekoResult = k9LosApi.OPPGAVEKO.getRestApiData();

export const fetchOppgaverTilBehandling = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
    { id }, { keepData: false },
  ),
);
export const fetchOppgaverTilBehandlingOppgaver = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
     { id }, { keepData: true },
  ),
);
export const getOppgaverTilBehandling = k9LosApi.OPPGAVER_TIL_BEHANDLING.getRestApiData();

export const fetchReserverteOppgaver = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.RESERVERTE_OPPGAVER.makeRestApiRequest()(
    undefined, { keepData: true },
  ),

);
export const getReserverteOppgaver = k9LosApi.RESERVERTE_OPPGAVER.getRestApiData();

export const reserverOppgave = (oppgaveId: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.RESERVER_OPPGAVE.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const hentReservasjonsstatus = (oppgaveId: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_RESERVASJONSSTATUS.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const opphevOppgaveReservasjon = (oppgaveId: string, begrunnelse: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPHEV_OPPGAVERESERVASJON.makeRestApiRequest()(
    { oppgaveId, begrunnelse },
  ),
);

export const forlengOppgaveReservasjon = (oppgaveId: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.FORLENG_OPPGAVERESERVASJON.makeRestApiRequest()(
    { oppgaveId },
  ),
);

export const finnSaksbehandler = (brukerIdent: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.makeRestApiRequest()({ brukerIdent }),
);
export const isSaksbehandlerSokStartet = k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiStarted();
export const isSaksbehandlerSokFerdig = k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiFinished();
export const getSaksbehandler = k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.getRestApiData();
export const resetSaksbehandler = () => (dispatch: Dispatch) => dispatch(k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.resetRestApi()());

export const flyttReservasjon = (oppgaveId: string, brukerIdent: string, begrunnelse: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.FLYTT_RESERVASJON.makeRestApiRequest()(
    { oppgaveId, brukerIdent, begrunnelse },
  ),
);

export const fetchOppgavekoensSaksbehandlere = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVEKO_SAKSBEHANDLERE.makeRestApiRequest()(
    { id }, { keepData: false },
  ),
);
export const getOppgavekoensSaksbehandlere = k9LosApi.OPPGAVEKO_SAKSBEHANDLERE.getRestApiData();

export const fetchAntallOppgaverForBehandlingsko = (id: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.makeRestApiRequest()({ id }),
);
export const getAntallOppgaverForBehandlingskoResultat = k9LosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.getRestApiData();


/* Reducers */
const initialState = {
  valgtOppgavekoId: undefined,
};

interface ActionTsType {
  type: string;
  data?: any;
}
interface StateTsType {
  valgtOppgavekoId?: string;
}

export const behandlingskoerReducer = (state: StateTsType = initialState, action: ActionTsType = { type: '' }) => {
  switch (action.type) {
    case SET_OPPGAVEKO_ID:
      return {
        ...state,
        valgtOppgavekoId: action.data,
      };
    default:
      return state;
  }
};

/* Selectors */
const getBehandlingskoerContext = state => state.default.behandlingskoerContext;
export const getValgtOppgavekoId = createSelector([getBehandlingskoerContext], behandlingskoerContext => behandlingskoerContext.valgtOppgavekoId);
