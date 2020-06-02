import { Dispatch } from 'redux';
import k9LosApi from 'api/k9LosApi';

export const fetchNyeOgFerdigstilteOppgaverNokkeltall = (oppgavekoId: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.makeRestApiRequest()(
    { id: oppgavekoId },
  ),
);
export const getNyeOgFerdigstilteOppgaverNokkeltall = k9LosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.getRestApiData();
