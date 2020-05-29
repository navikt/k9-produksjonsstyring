import { createSelector } from 'reselect';

import k9LosApi from 'api/k9LosApi';

/* Selectors */
const getAppContext = (state) => state.default.appContext;

type NavAnsatt = Readonly<{
  navn: string;
  kanSaksbehandle: boolean;
  kanOppgavestyre: boolean;
  kanBehandleKode6: boolean;
  funksjonellTid: string;
}>;
const NavAnsattDefault = {
  navn: undefined,
  kanSaksbehandle: undefined,
  kanOppgavestyre: undefined,
  kanBehandleKode6: undefined,
  funksjonellTid: undefined,
};

export const getNavAnsattName = createSelector([k9LosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt.navn);
export const getNavAnsattKanSaksbehandle = createSelector([k9LosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanSaksbehandle);
export const getNavAnsattKanOppgavestyre = createSelector([k9LosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanOppgavestyre);
export const getNavAnsattKanBehandleKode6 = createSelector([k9LosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt
  .kanBehandleKode6);
export const getFunksjonellTid = createSelector([k9LosApi.NAV_ANSATT.getRestApiData()], (navAnsatt: NavAnsatt = NavAnsattDefault) => navAnsatt.funksjonellTid);
export const getK9sakUrl = createSelector([k9LosApi.K9SAK_URL.getRestApiData()], (k9sakUrl: {verdi: undefined }) => k9sakUrl.verdi);
export const getK9tilbakeUrl = createSelector([k9LosApi.K9SAK_URL.getRestApiData()], (k9tilbakeUrl: {verdi: undefined }) => k9tilbakeUrl.verdi);
