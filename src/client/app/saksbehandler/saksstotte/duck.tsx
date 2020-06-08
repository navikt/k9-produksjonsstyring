
import k9LosApi from 'api/k9LosApi';
import { Dispatch } from 'redux';
import Oppgave from 'saksbehandler/oppgaveTsType';

/* Action creators */
export const fetchBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.makeRestApiRequest();
export const getBehandledeOppgaver = k9LosApi.BEHANDLEDE_OPPGAVER.getRestApiData();

export const leggTilBehandletOppgave = (behandletOppgave: Oppgave) => (dispatch: Dispatch) => dispatch(
  k9LosApi.LEGG_TIL_BEHANDLET_OPPGAVE.makeRestApiRequest()(
    { behandletOppgave },
  ).then(() => dispatch(fetchBehandledeOppgaver())),
);
