
import { createSelector } from 'reselect';
import k9LosApi from 'api/k9LosApi';

/* Selectors */
export const getKodeverk = (kodeverkType: string) => createSelector(
  [k9LosApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getKodeverkReceived = k9LosApi.KODEVERK.getRestApiFinished();
