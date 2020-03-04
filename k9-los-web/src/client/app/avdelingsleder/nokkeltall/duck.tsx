import { Dispatch } from 'redux';

import k9LosApi from 'api/k9LosApi';

export const fetchOppgaverForAvdeling = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_FOR_AVDELING.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);
export const getOppgaverForAvdeling = k9LosApi.HENT_OPPGAVER_FOR_AVDELING.getRestApiData();

export const fetchOppgaverPerDato = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_PER_DATO.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);
export const getOppgaverPerDato = k9LosApi.HENT_OPPGAVER_PER_DATO.getRestApiData();

export const fetchOppgaverAvdelingManueltPaVent = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_MANUELT_PA_VENT.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);
export const getOppgaverAvdelingManueltPaVent = k9LosApi.HENT_OPPGAVER_MANUELT_PA_VENT.getRestApiData();

export const fetchOppgaverPerForsteStonadsdag = (avdelingEnhet: string) => (dispatch: Dispatch) => dispatch(
  k9LosApi.HENT_OPPGAVER_PER_FORSTE_STONADSDAG.makeRestApiRequest()(
    { avdelingEnhet }, { keepData: true },
  ),
);
export const getOppgaverPerForsteStonadsdag = k9LosApi.HENT_OPPGAVER_PER_FORSTE_STONADSDAG.getRestApiData();
