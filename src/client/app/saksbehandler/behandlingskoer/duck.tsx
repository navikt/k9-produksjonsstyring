
import { createSelector } from 'reselect';
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

/* Action types */
const SET_SAKSLISTE_ID = 'SET_SAKSLISTE_ID';

/* Action creators */
export const setValgtSakslisteId = (setSakslisteId: number) => ({
  type: SET_SAKSLISTE_ID,
  data: setSakslisteId,
});

export const fetchAlleSakslister = k9LosApi.SAKSLISTE.makeRestApiRequest();
export const getSakslisteResult = k9LosApi.SAKSLISTE.getRestApiData();

export const fetchOppgaverTilBehandling = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
    { sakslisteId }, { keepData: false },
  ),
);
export const fetchOppgaverTilBehandlingOppgaver = (sakslisteId: number, oppgaveIder?: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVER_TIL_BEHANDLING.makeRestApiRequest()(
    oppgaveIder ? { sakslisteId, oppgaveIder } : { sakslisteId }, { keepData: true },
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
  k9LosApi.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK.makeRestApiRequest()(brukerIdent),
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

export const fetchSakslistensSaksbehandlere = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  k9LosApi.SAKSLISTE_SAKSBEHANDLERE.makeRestApiRequest()(
    { sakslisteId }, { keepData: false },
  ),
);
export const getSakslistensSaksbehandlere = k9LosApi.SAKSLISTE_SAKSBEHANDLERE.getRestApiData();

export const fetchAntallOppgaverForBehandlingsko = (sakslisteId: number) => (dispatch: Dispatch) => dispatch(
  k9LosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.makeRestApiRequest()({ sakslisteId }),
);
export const getAntallOppgaverForBehandlingskoResultat = k9LosApi.BEHANDLINGSKO_OPPGAVE_ANTALL.getRestApiData();


/* Reducers */
const initialState = {
  valgtSakslisteId: undefined,
};

interface ActionTsType {
  type: string;
  data?: any;
}
interface StateTsType {
  valgtSakslisteId?: number;
}

export const behandlingskoerReducer = (state: StateTsType = initialState, action: ActionTsType = { type: '' }) => {
  switch (action.type) {
    case SET_SAKSLISTE_ID:
      return {
        ...state,
        valgtSakslisteId: action.data,
      };
    default:
      return state;
  }
};

/* Selectors */
const getBehandlingskoerContext = state => state.default.behandlingskoerContext;
export const getValgtSakslisteId = createSelector([getBehandlingskoerContext], behandlingskoerContext => behandlingskoerContext.valgtSakslisteId);
