import {
  RestApiConfigBuilder, ReduxRestApi, ReduxRestApiBuilder, ReduxEvents,
} from './rest-api-redux/index';
import errorHandler from './error-api-redux';

const isDevelopment = process.env.NODE_ENV === 'development';

const k9LosApiKeys = {
  KODEVERK: 'KODEVERK',
  NAV_ANSATT: 'NAV_ANSATT',
  SEARCH_FAGSAK: 'SEARCH_FAGSAK',
  BEHANDLEDE_OPPGAVER: 'BEHANDLEDE_OPPGAVER',
  K9SAK_URL: 'K9SAK_URL',
  K9TILBAKE_URL: 'K9TILBAKE_URL',
  SSE_URL: 'SSE_URL',
  FEATURE_TOGGLES: 'FEATURE_TOGGLES',
  OPPGAVEKO: 'OPPGAVEKO',
  HENT_OPPGAVEKO: 'HENT_OPPGAVEKO',
  RESERVER_OPPGAVE: 'RESERVER_OPPGAVE',
  ENDRE_OPPGAVERESERVASJON: 'ENDRE_OPPGAVERESERVASJON',
  HENT_RESERVASJONSSTATUS: 'HENT_RESERVASJONSSTATUS',
  OPPGAVER_TIL_BEHANDLING: 'OPPGAVER_TIL_BEHANDLING',
  RESERVERTE_OPPGAVER: 'RESERVERTE_OPPGAVER',
  OPPHEV_OPPGAVERESERVASJON: 'OPPHEV_OPPGAVERESERVASJON',
  FORLENG_OPPGAVERESERVASJON: 'FORLENG_OPPGAVERESERVASJON',
  OPPGAVEKOER: 'OPPGAVEKOER',
  OPPRETT_NY_OPPGAVEKO: 'OPPRETT_NY_OPPGAVEKO',
  SLETT_OPPGAVEKO: 'SLETT_OPPGAVEKO',
  LAGRE_OPPGAVEKO_NAVN: 'LAGRE_OPPGAVEKO_NAVN',
  LAGRE_OPPGAVEKO_BEHANDLINGSTYPE: 'LAGRE_OPPGAVEKO_BEHANDLINGSTYPE',
  LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE: 'LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE',
  LAGRE_OPPGAVEKO_ANDRE_KRITERIER: 'LAGRE_OPPGAVEKO_ANDRE_KRITERIER',
  LAGRE_OPPGAVEKO_SORTERING: 'LAGRE_OPPGAVEKO_SORTERING',
  LAGRE_OPPGAVEKO_SKJERMET: 'LAGRE_OPPGAVEKO_SKJERMET',
  LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE: 'LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE',
  LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER: 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER',
  LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO: 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO',
  SAKSBEHANDLER_SOK: 'SAKSBEHANDLER_SOK',
  SAKSBEHANDLERE: 'SAKSBEHANDLERE',
  DRIFTSMELDINGER: 'DRIFTSMELDINGER',
  DRIFTSMELDINGER_SOK: 'DRIFTSMELDINGER_SOK',
  LAGRE_DRIFTSMELDING: 'LAGRE_DRIFTSMELDING',
  SLETT_DRIFTSMELDING: 'SLETT_DRIFTSMELDING',
  TOGGLE_DRIFTSMELDING: 'TOGGLE_DRIFTSMELDING',
  OPPRETT_NY_SAKSBEHANDLER: 'OPPRETT_NY_SAKSBEHANDLER',
  SLETT_SAKSBEHANDLER: 'SLETT_SAKSBEHANDLER',
  LAGRE_OPPGAVEKO_SAKSBEHANDLER: 'LAGRE_OPPGAVEKO_SAKSBEHANDLER',
  HENT_OPPGAVER: 'HENT_OPPGAVER',
  HENT_OPPGAVER_PER_DATO: 'HENT_OPPGAVER_PER_DATO',
  HENT_FERDIGSTILTE_OPPGAVER: 'HENT_FERDIGSTILTE_OPPGAVER',
  HENT_OPPGAVER_PER_FORSTE_STONADSDAG: 'HENT_OPPGAVER_PER_FORSTE_STONADSDAG',
  HENT_DAGENS_TALL: 'HENT_DAGENS_TALL',
  HENT_OPPGAVER_MANUELT_PA_VENT: 'HENT_OPPGAVER_MANUELT_PA_VENT',
  OPPGAVE_ANTALL: 'OPPGAVE_ANTALL',
  OPPGAVE_ANTALL_TOTALT: 'OPPGAVE_ANTALL_TOTALT',
  OPPGAVER_FOR_FAGSAKER: 'OPPGAVER_FOR_FAGSAKER',
  FLYTT_RESERVASJON_SAKSBEHANDLER_SOK: 'FLYTT_RESERVASJON_SAKSBEHANDLER_SOK',
  FLYTT_RESERVASJON: 'FLYTT_RESERVASJON',
  OPPGAVEKO_SAKSBEHANDLERE: 'OPPGAVEKO_SAKSBEHANDLERE',
  BEHANDLINGSKO_OPPGAVE_ANTALL: 'BEHANDLINGSKO_OPPGAVE_ANTALL',
  HENT_NYE_OG_FERDIGSTILTE_OPPGAVER: 'HENT_NYE_OG_FERDIGSTILTE_OPPGAVER',
  LEGG_TIL_BEHANDLET_OPPGAVE: 'LEGG_TIL_BEHANDLET_OPPGAVE',
  HENT_ALLE_RESERVASJONER: 'HENT_ALLE_RESERVASJONER',
  AVDELINGSLEDER_OPPHEVER_RESERVASJON: 'AVDELINGSLEDER_OPPHEVER_RESERVASJON',
};

const endpoints = new RestApiConfigBuilder()
  /* /api/fagsak */
  .withPost('fagsak/sok', k9LosApiKeys.SEARCH_FAGSAK)

  /* /api/saksbehandler */
  .withGet('saksbehandler', k9LosApiKeys.NAV_ANSATT)

  /* /api/driftsmeldinger */
  .withGet('driftsmeldinger', k9LosApiKeys.DRIFTSMELDINGER)
  .withPost('driftsmeldinger/slett', k9LosApiKeys.SLETT_DRIFTSMELDING)
  .withPost('driftsmeldinger', k9LosApiKeys.LAGRE_DRIFTSMELDING)
  .withPost('driftsmeldinger/toggle', k9LosApiKeys.TOGGLE_DRIFTSMELDING)

  /* /api/saksbehandler/saksliste */
  .withGet('saksbehandler/oppgaveko', k9LosApiKeys.OPPGAVEKO)
  .withGet('saksbehandler/oppgaveko/saksbehandlere', k9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE)

  /* /api/saksbehandler/oppgave */
  .withGet('saksbehandler/oppgaver', k9LosApiKeys.OPPGAVER_TIL_BEHANDLING)
  .withGet('saksbehandler/oppgaver/reserverte', k9LosApiKeys.RESERVERTE_OPPGAVER)
  .withPost('saksbehandler/oppgaver/reserver', k9LosApiKeys.RESERVER_OPPGAVE)
  .withGet('saksbehandler/oppgaver/reservasjon-status', k9LosApiKeys.HENT_RESERVASJONSSTATUS)
  .withPost('saksbehandler/oppgaver/opphev', k9LosApiKeys.OPPHEV_OPPGAVERESERVASJON)
  .withPost('saksbehandler/oppgaver/forleng', k9LosApiKeys.FORLENG_OPPGAVERESERVASJON)
  .withGet('saksbehandler/oppgaver/behandlede', k9LosApiKeys.BEHANDLEDE_OPPGAVER)
  .withPost('saksbehandler/oppgaver/flytt/sok', k9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK)
  .withPost('saksbehandler/oppgaver/flytt', k9LosApiKeys.FLYTT_RESERVASJON)
  .withGet('saksbehandler/oppgaver/antall', k9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL)
  .withGet('saksbehandler/oppgaver/oppgaver-for-fagsaker', k9LosApiKeys.OPPGAVER_FOR_FAGSAKER)
  .withPost('saksbehandler/oppgaver/reservasjon/endre', k9LosApiKeys.ENDRE_OPPGAVERESERVASJON)
  .withPost('saksbehandler/oppgaver/legg-til-behandlet-sak', k9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE)

  /* /api/saksbehandler/nokkeltall */
  .withGet('saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', k9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER)

  /* /api/avdelingsleder/sakslister */
  .withGet('avdelingsleder/oppgavekoer', k9LosApiKeys.OPPGAVEKOER)
  .withPost('avdelingsleder/oppgavekoer', k9LosApiKeys.OPPRETT_NY_OPPGAVEKO)
  .withGet('avdelingsleder/oppgavekoer/hent', k9LosApiKeys.HENT_OPPGAVEKO)
  .withPost('avdelingsleder/oppgavekoer/slett', k9LosApiKeys.SLETT_OPPGAVEKO)
  .withPost('avdelingsleder/oppgavekoer/navn', k9LosApiKeys.LAGRE_OPPGAVEKO_NAVN)
  .withPost('avdelingsleder/oppgavekoer/behandlingstype', k9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE)
  .withPost('avdelingsleder/oppgavekoer/ytelsetype', k9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE)
  .withPost('avdelingsleder/oppgavekoer/andre-kriterier', k9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER)
  .withPost('avdelingsleder/oppgavekoer/sortering', k9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING)
  .withPost('avdelingsleder/oppgavekoer/skjermet', k9LosApiKeys.LAGRE_OPPGAVEKO_SKJERMET)
  .withPost('avdelingsleder/oppgavekoer/sortering-tidsintervall-type', k9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE)
  .withPost('avdelingsleder/oppgavekoer/sortering-tidsintervall-dager', k9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER)
  .withPost('avdelingsleder/oppgavekoer/sortering-tidsintervall-dato', k9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO)
  .withPost('avdelingsleder/oppgavekoer/saksbehandler', k9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER)
  .withPost('avdelingsleder/reservasjoner/opphev', k9LosApiKeys.AVDELINGSLEDER_OPPHEVER_RESERVASJON)

  /* /api/avdelingsleder/saksbehandlere */
  .withPost('avdelingsleder/saksbehandlere/sok', k9LosApiKeys.SAKSBEHANDLER_SOK)
  .withGet('avdelingsleder/saksbehandlere', k9LosApiKeys.SAKSBEHANDLERE)
  .withPost('avdelingsleder/saksbehandlere', k9LosApiKeys.OPPRETT_NY_SAKSBEHANDLER)
  .withPost('avdelingsleder/saksbehandlere/slett', k9LosApiKeys.SLETT_SAKSBEHANDLER)

  /* /api/avdelingsleder/oppgaver */
  .withGet('avdelingsleder/oppgaver/antall', k9LosApiKeys.OPPGAVE_ANTALL)
  .withGet('avdelingsleder/oppgaver/antall-totalt', k9LosApiKeys.OPPGAVE_ANTALL_TOTALT)

  /* /api/avdelingsleder/nokkeltall */
  .withGet('avdelingsleder/nokkeltall/behandlinger-under-arbeid', k9LosApiKeys.HENT_OPPGAVER)
  .withGet('avdelingsleder/nokkeltall/beholdning-historikk', k9LosApiKeys.HENT_OPPGAVER_PER_DATO)
  .withGet('avdelingsleder/nokkeltall/ferdigstilte-behandlinger-historikk', k9LosApiKeys.HENT_FERDIGSTILTE_OPPGAVER)
  .withGet('avdelingsleder/nokkeltall/behandlinger-manuelt-vent-historikk', k9LosApiKeys.HENT_OPPGAVER_MANUELT_PA_VENT)
  .withGet('avdelingsleder/nokkeltall/behandlinger-forste-stonadsdag', k9LosApiKeys.HENT_OPPGAVER_PER_FORSTE_STONADSDAG)
  .withGet('avdelingsleder/nokkeltall//dagens-tall', k9LosApiKeys.HENT_DAGENS_TALL)

  .withGet('avdelingsleder/reservasjoner', k9LosApiKeys.HENT_ALLE_RESERVASJONER)

  /* /api/konfig */
  .withGet('konfig/k9-sak-url', k9LosApiKeys.K9SAK_URL)
  .withGet('konfig/sse-url', k9LosApiKeys.SSE_URL)
  .withGet('konfig/k9tilbake-url', k9LosApiKeys.K9TILBAKE_URL)
  .withGet('konfig/feature-toggles', k9LosApiKeys.FEATURE_TOGGLES)

  /* /api/kodeverk */
  .withGet('kodeverk', k9LosApiKeys.KODEVERK)

  .build();

export const reduxRestApi: ReduxRestApi = isDevelopment
  ? new ReduxRestApiBuilder(endpoints, 'dataContext')
    .withContextPath('api/')
    .withReduxEvents(new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator()))
    .build()
  : new ReduxRestApiBuilder(endpoints, 'dataContext')
    .withReduxEvents(new ReduxEvents()
      .withErrorActionCreator(errorHandler.getErrorActionCreator()))
    .build();

const k9LosApi = reduxRestApi.getEndpointApi();
export default k9LosApi;
