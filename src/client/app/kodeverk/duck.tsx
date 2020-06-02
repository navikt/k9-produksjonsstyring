import { createSelector } from 'reselect';
import k9LosApi from 'api/k9LosApi';

/* Selectors */
export const getKodeverk = createSelector(
  [k9LosApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk,
);

export const getKodeverkReceived = k9LosApi.KODEVERK.getRestApiFinished();
