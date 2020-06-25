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

export const getOppgaverPerDato = k9LosApi.HENT_OPPGAVER_PER_DATO.getRestApiData();

export const fetchFerdigstilteOppgaver = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_FERDIGSTILTE_OPPGAVER.makeRestApiRequest()(
    { }, { keepData: true },
  ),
);

export const getFerdigstilteOppgaver = k9LosApi.HENT_FERDIGSTILTE_OPPGAVER.getRestApiData();

export const fetchOppgaverManueltPaVent = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_MANUELT_PA_VENT.makeRestApiRequest(),
);
export const getOppgaverManueltPaVent = k9LosApi.HENT_OPPGAVER_MANUELT_PA_VENT.getRestApiData();

export const fetchOppgaverPerForsteStonadsdag = () => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_PER_FORSTE_STONADSDAG.makeRestApiRequest(),
);
export const getOppgaverPerForsteStonadsdag = k9LosApi.HENT_OPPGAVER_PER_FORSTE_STONADSDAG.getRestApiData();
