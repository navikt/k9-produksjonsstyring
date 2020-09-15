import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';
import { Fagsak } from './fagsakTsType';

/* Action creators */
export const searchFagsaker = k9LosApi.SEARCH_FAGSAK.makeRestApiRequest();

export const resetFagsakSearch = () => (dispatch: Dispatch) => {
  dispatch(k9LosApi.SEARCH_FAGSAK.resetRestApi()());
  dispatch(k9LosApi.OPPGAVER_FOR_FAGSAKER.resetRestApi()());
};

export const hentOppgaverForFagsaker = (fagsaker: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.OPPGAVER_FOR_FAGSAKER.makeRestApiRequest()(
    { saksnummerListe: fagsaker },
  ),
);
