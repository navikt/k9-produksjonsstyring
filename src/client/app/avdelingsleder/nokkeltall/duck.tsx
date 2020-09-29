import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchAlleOppgaver = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);
export const getAlleOppgaver = k9LosApi.HENT_OPPGAVER.getRestApiData();

export const fetchOppgaverPerDato = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_PER_DATO.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const fetchFerdigstiltePerDato = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_FERDIGSTILTE_HISTORIKK.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const fetchNyePerDato = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_NYE_HISTORIKK.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const getOppgaverPerDato = k9LosApi.HENT_OPPGAVER_PER_DATO.getRestApiData();

export const getFerdigstiltePerDato = k9LosApi.HENT_FERDIGSTILTE_HISTORIKK.getRestApiData();
export const getNyePerDato = k9LosApi.HENT_NYE_HISTORIKK.getRestApiData();

export const fetchNyeOgFerdigstilteOppgaverMedStonadstype = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPSUMMERING.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const getNyeOgFerdigstilteOppgaverMedStonadstype = k9LosApi.HENT_OPPSUMMERING.getRestApiData();
