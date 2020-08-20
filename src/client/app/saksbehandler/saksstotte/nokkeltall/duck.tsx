
import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchNyeOgFerdigstilteOppgaverNokkeltall = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.makeRestApiRequest()(
    { },
  ),
);
export const getNyeOgFerdigstilteOppgaverNokkeltall = k9LosApi.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER.getRestApiData();
