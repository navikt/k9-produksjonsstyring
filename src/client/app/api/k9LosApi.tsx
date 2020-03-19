import {
  RestApiConfigBuilder, ReduxRestApi, ReduxRestApiBuilder, ReduxEvents,
} from './rest-api-redux/index';
import errorHandler from './error-api-redux';

const k9LosApiKeys = {
  KODEVERK: 'KODEVERK',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  BEHANDLEDE_OPPGAVER: 'BEHANDLEDE_OPPGAVER',
  K9SAK_URL: 'K9SAK_URL',
  K9TILBAKE_URL: 'K9TILBAKE_URL',
  FEATURE_TOGGLES: 'FEATURE_TOGGLES',
  SAKSLISTE: 'SAKSLISTE',
  RESERVER_OPPGAVE: 'RESERVER_OPPGAVE',
  HENT_RESERVASJONSSTATUS: 'HENT_RESERVASJONSSTATUS',
  OPPGAVER_TIL_BEHANDLING: 'OPPGAVER_TIL_BEHANDLING',
  RESERVERTE_OPPGAVER: 'RESERVERTE_OPPGAVER',
  OPPHEV_OPPGAVERESERVASJON: 'OPPHEV_OPPGAVERESERVASJON',
  FORLENG_OPPGAVERESERVASJON: 'FORLENG_OPPGAVERESERVASJON',
  SAKSLISTER_FOR_AVDELING: 'SAKSLISTER_FOR_AVDELING',
  OPPRETT_NY_SAKSLISTE: 'OPPRETT_NY_SAKSLISTE',
  SLETT_SAKSLISTE: 'SLETT_SAKSLISTE',
  LAGRE_SAKSLISTE_NAVN: 'LAGRE_SAKSLISTE_NAVN',
  LAGRE_SAKSLISTE_BEHANDLINGSTYPE: 'LAGRE_SAKSLISTE_BEHANDLINGSTYPE',
  LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE: 'LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE',
  LAGRE_SAKSLISTE_ANDRE_KRITERIER: 'LAGRE_SAKSLISTE_ANDRE_KRITERIER',
  LAGRE_SAKSLISTE_SORTERING: 'LAGRE_SAKSLISTE_SORTERING',
  LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE: 'LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE',
  LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER: 'LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER',
  LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO: 'LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO',
  SAKSBEHANDLER_SOK: 'SAKSBEHANDLER_SOK',
  SAKSBEHANDLERE_FOR_AVDELING: 'SAKSBEHANDLERE_FOR_AVDELING',
  OPPRETT_NY_SAKSBEHANDLER: 'OPPRETT_NY_SAKSBEHANDLER',
  SLETT_SAKSBEHANDLER: 'SLETT_SAKSBEHANDLER',
  LAGRE_SAKSLISTE_SAKSBEHANDLER: 'LAGRE_SAKSLISTE_SAKSBEHANDLER',
  HENT_OPPGAVER_FOR_AVDELING: 'HENT_OPPGAVER_FOR_AVDELING',
  HENT_OPPGAVER_PER_DATO: 'HENT_OPPGAVER_PER_DATO',
  HENT_OPPGAVER_PER_FORSTE_STONADSDAG: 'HENT_OPPGAVER_PER_FORSTE_STONADSDAG',
  HENT_OPPGAVER_MANUELT_PA_VENT: 'HENT_OPPGAVER_MANUELT_PA_VENT',
  AVDELINGER: 'AVDELINGER',
  OPPGAVE_ANTALL: 'OPPGAVE_ANTALL',
  OPPGAVE_AVDELING_ANTALL: 'OPPGAVE_AVDELING_ANTALL',
  OPPGAVER_FOR_FAGSAKER: 'OPPGAVER_FOR_FAGSAKER',
  FLYTT_RESERVASJON_SAKSBEHANDLER_SOK: 'FLYTT_RESERVASJON_SAKSBEHANDLER_SOK',
  FLYTT_RESERVASJON: 'FLYTT_RESERVASJON',
  SAKSLISTE_SAKSBEHANDLERE: 'SAKSLISTE_SAKSBEHANDLERE',
  BEHANDLINGSKO_OPPGAVE_ANTALL: 'BEHANDLINGSKO_OPPGAVE_ANTALL',
  HENT_NYE_OG_FERDIGSTILTE_OPPGAVER: 'HENT_NYE_OG_FERDIGSTILTE_OPPGAVER',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/fagsak */
  .withPost('/api/fagsak/api/sok', k9LosApiKeys.SEARCH_FAGSAK)

  /* /api/saksbehandler */
  .withGet('/api/saksbehandler', k9LosApiKeys.NAV_ANSATT)

  /* /api/saksbehandler/saksliste */
  .withGet('/api/saksbehandler/saksliste', k9LosApiKeys.SAKSLISTE)
  .withGet('/api/saksbehandler/saksliste/saksbehandlere', k9LosApiKeys.SAKSLISTE_SAKSBEHANDLERE)

  /* /api/saksbehandler/oppgave */
  .withAsyncGet('/api/saksbehandler/oppgaver', k9LosApiKeys.OPPGAVER_TIL_BEHANDLING, { maxPollingLimit: 1800 })
  .withGet('/api/saksbehandler/oppgaver/reserverte', k9LosApiKeys.RESERVERTE_OPPGAVER)
  .withPost('/api/saksbehandler/oppgaver/reserver', k9LosApiKeys.RESERVER_OPPGAVE)
  .withGet('/api/saksbehandler/oppgaver/reservasjon-status', k9LosApiKeys.HENT_RESERVASJONSSTATUS)
  .withPost('/api/saksbehandler/oppgaver/opphev', k9LosApiKeys.OPPHEV_OPPGAVERESERVASJON)
  .withPost('/api/saksbehandler/oppgaver/forleng', k9LosApiKeys.FORLENG_OPPGAVERESERVASJON)
  .withGet('/api/saksbehandler/oppgaver/behandlede', k9LosApiKeys.BEHANDLEDE_OPPGAVER)
  .withPost('/api/saksbehandler/oppgaver/flytt/sok', k9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK)
  .withPost('/api/saksbehandler/oppgaver/flytt', k9LosApiKeys.FLYTT_RESERVASJON)
  .withGet('/api/saksbehandler/oppgaver/antall', k9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL)
  .withGet('/api/saksbehandler/oppgaver/oppgaver-for-fagsaker', k9LosApiKeys.OPPGAVER_FOR_FAGSAKER)

  /* /api/saksbehandler/nokkeltall */
  .withGet('/api/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', k9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER)

  /* /api/avdelingsleder/avdelinger */
  .withGet('/api/avdelingsleder/avdelinger', k9LosApiKeys.AVDELINGER)

  /* /api/avdelingsleder/sakslister */
  .withGet('/api/avdelingsleder/sakslister', k9LosApiKeys.SAKSLISTER_FOR_AVDELING)
  .withPost('/api/avdelingsleder/sakslister', k9LosApiKeys.OPPRETT_NY_SAKSLISTE)
  .withPost('/api/avdelingsleder/sakslister/slett', k9LosApiKeys.SLETT_SAKSLISTE)
  .withPost('/api/avdelingsleder/sakslister/navn', k9LosApiKeys.LAGRE_SAKSLISTE_NAVN)
  .withPost('/api/avdelingsleder/sakslister/behandlingstype', k9LosApiKeys.LAGRE_SAKSLISTE_BEHANDLINGSTYPE)
  .withPost('/api/avdelingsleder/sakslister/ytelsetype', k9LosApiKeys.LAGRE_SAKSLISTE_FAGSAK_YTELSE_TYPE)
  .withPost('/api/avdelingsleder/sakslister/andre-kriterier', k9LosApiKeys.LAGRE_SAKSLISTE_ANDRE_KRITERIER)
  .withPost('/api/avdelingsleder/sakslister/sortering', k9LosApiKeys.LAGRE_SAKSLISTE_SORTERING)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-type', k9LosApiKeys.LAGRE_SAKSLISTE_SORTERING_DYNAMISK_PERIDE)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-dager', k9LosApiKeys.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DAGER)
  .withPost('/api/avdelingsleder/sakslister/sortering-tidsintervall-dato', k9LosApiKeys.LAGRE_SAKSLISTE_SORTERING_TIDSINTERVALL_DATO)
  .withPost('/api/avdelingsleder/sakslister/saksbehandler', k9LosApiKeys.LAGRE_SAKSLISTE_SAKSBEHANDLER)

  /* /api/avdelingsleder/saksbehandlere */
  .withPost('/api/avdelingsleder/saksbehandlere/sok', k9LosApiKeys.SAKSBEHANDLER_SOK)
  .withGet('/api/avdelingsleder/saksbehandlere', k9LosApiKeys.SAKSBEHANDLERE_FOR_AVDELING)
  .withPost('/api/avdelingsleder/saksbehandlere', k9LosApiKeys.OPPRETT_NY_SAKSBEHANDLER)
  .withPost('/api/avdelingsleder/saksbehandlere/slett', k9LosApiKeys.SLETT_SAKSBEHANDLER)

  /* /api/avdelingsleder/oppgaver */
  .withGet('/api/avdelingsleder/oppgaver/antall', k9LosApiKeys.OPPGAVE_ANTALL)
  .withGet('/api/avdelingsleder/oppgaver/avdelingantall', k9LosApiKeys.OPPGAVE_AVDELING_ANTALL)

  /* /api/avdelingsleder/nokkeltall */
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid', k9LosApiKeys.HENT_OPPGAVER_FOR_AVDELING)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid-historikk', k9LosApiKeys.HENT_OPPGAVER_PER_DATO)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-manuelt-vent-historikk', k9LosApiKeys.HENT_OPPGAVER_MANUELT_PA_VENT)
  .withGet('/api/avdelingsleder/nokkeltall/behandlinger-forste-stonadsdag', k9LosApiKeys.HENT_OPPGAVER_PER_FORSTE_STONADSDAG)

  /* /api/konfig */
    .withGet('/api/konfig/k9-sak-url', k9LosApiKeys.K9SAK_URL)
    .withGet('/api/konfig/k9tilbake-url', k9LosApiKeys.K9TILBAKE_URL)
    .withGet('/api/konfig/feature-toggles', k9LosApiKeys.FEATURE_TOGGLES)

  /* /api/kodeverk */
  .withGet('/api/kodeverk', k9LosApiKeys.KODEVERK)

  .build();

export const reduxRestApi: ReduxRestApi = new ReduxRestApiBuilder(endpoints, 'dataContext')
  .withContextPath('k9los/web')
  .withReduxEvents(new ReduxEvents()
    .withErrorActionCreator(errorHandler.getErrorActionCreator()))
  .build();

const k9LosApi = reduxRestApi.getEndpointApi();
export default k9LosApi;
