
import { createSelector } from 'reselect';

import { errorOfType, ErrorTypes, getErrorResponseData } from 'app/ErrorTypes';
import k9LosApi from 'api/k9LosApi';

export const getFagsaker = k9LosApi.SEARCH_FAGSAK.getRestApiData();
export const getFagsakOppgaver = k9LosApi.OPPGAVER_FOR_FAGSAKER.getRestApiData();

export const getSearchFagsakerAccessDenied = createSelector(
  [k9LosApi.SEARCH_FAGSAK.getRestApiError()],
  (error) => {
    if (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)) {
      return getErrorResponseData(error);
    }
    return undefined;
  },
);
