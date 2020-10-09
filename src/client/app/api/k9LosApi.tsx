import { RestApiConfigBuilder, createRequestApi } from './rest-api';

const isDevelopment = process.env.NODE_ENV === 'development';

export enum RestApiGlobalStatePathsKeys {
  KODEVERK = 'KODEVERK',
  NAV_ANSATT = 'NAV_ANSATT',
  K9SAK_URL = 'K9SAK_URL',
  SSE_URL = 'SSE_URL',
}

export enum K9LosApiKeys {
  KODEVERK = 'KODEVERK',
  NAV_ANSATT = 'NAV_ANSATT',
  SEARCH_FAGSAK = 'SEARCH_FAGSAK',
  BEHANDLEDE_OPPGAVER = 'BEHANDLEDE_OPPGAVER',
  K9SAK_URL = 'K9SAK_URL',
  K9TILBAKE_URL = 'K9TILBAKE_URL',
  FEATURE_TOGGLES = 'FEATURE_TOGGLES',
  OPPGAVEKO = 'OPPGAVEKO',
  HENT_OPPGAVEKO = 'HENT_OPPGAVEKO',
  RESERVER_OPPGAVE = 'RESERVER_OPPGAVE',
  ENDRE_OPPGAVERESERVASJON = 'ENDRE_OPPGAVERESERVASJON',
  HENT_RESERVASJONSSTATUS = 'HENT_RESERVASJONSSTATUS',
  OPPGAVER_TIL_BEHANDLING = 'OPPGAVER_TIL_BEHANDLING',
  RESERVERTE_OPPGAVER = 'RESERVERTE_OPPGAVER',
  OPPHEV_OPPGAVERESERVASJON = 'OPPHEV_OPPGAVERESERVASJON',
  FORLENG_OPPGAVERESERVASJON = 'FORLENG_OPPGAVERESERVASJON',
  OPPGAVEKOER = 'OPPGAVEKOER',
  OPPRETT_NY_OPPGAVEKO = 'OPPRETT_NY_OPPGAVEKO',
  SLETT_OPPGAVEKO = 'SLETT_OPPGAVEKO',
  LAGRE_OPPGAVEKO_NAVN = 'LAGRE_OPPGAVEKO_NAVN',
  LAGRE_OPPGAVEKO_BEHANDLINGSTYPE = 'LAGRE_OPPGAVEKO_BEHANDLINGSTYPE',
  LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE = 'LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE',
  LAGRE_OPPGAVEKO_ANDRE_KRITERIER = 'LAGRE_OPPGAVEKO_ANDRE_KRITERIER',
  LAGRE_OPPGAVEKO_SORTERING = 'LAGRE_OPPGAVEKO_SORTERING',
  LAGRE_OPPGAVEKO_SKJERMET = 'LAGRE_OPPGAVEKO_SKJERMET',
  LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE = 'LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE',
  LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER = 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER',
  LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO = 'LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO',
  SAKSBEHANDLER_SOK = 'SAKSBEHANDLER_SOK',
  SAKSBEHANDLERE = 'SAKSBEHANDLERE',
  DRIFTSMELDINGER = 'DRIFTSMELDINGER',
  LAGRE_DRIFTSMELDING = 'LAGRE_DRIFTSMELDING',
  SLETT_DRIFTSMELDING = 'SLETT_DRIFTSMELDING',
  TOGGLE_DRIFTSMELDING = 'TOGGLE_DRIFTSMELDING',
  OPPRETT_NY_SAKSBEHANDLER = 'OPPRETT_NY_SAKSBEHANDLER',
  SLETT_SAKSBEHANDLER = 'SLETT_SAKSBEHANDLER',
  LAGRE_OPPGAVEKO_SAKSBEHANDLER = 'LAGRE_OPPGAVEKO_SAKSBEHANDLER',
  HENT_OPPGAVER = 'HENT_OPPGAVER',
  HENT_OPPGAVER_PER_DATO = 'HENT_OPPGAVER_PER_DATO',
  HENT_OPPSUMMERING = 'HENT_OPPSUMMERING',
  HENT_FERDIGSTILTE_HISTORIKK = 'HENT_FERDIGSTILTE_HISTORIKK',
  HENT_NYE_HISTORIKK = 'HENT_NYE_HISTORIKK',
  HENT_OPPGAVER_PER_FORSTE_STONADSDAG = 'HENT_OPPGAVER_PER_FORSTE_STONADSDAG',
  HENT_DAGENS_TALL = 'HENT_DAGENS_TALL',
  HENT_OPPGAVER_MANUELT_PA_VENT = 'HENT_OPPGAVER_MANUELT_PA_VENT',
  OPPGAVE_ANTALL = 'OPPGAVE_ANTALL',
  OPPGAVE_ANTALL_TOTALT = 'OPPGAVE_ANTALL_TOTALT',
  OPPGAVER_FOR_FAGSAKER = 'OPPGAVER_FOR_FAGSAKER',
  FLYTT_RESERVASJON_SAKSBEHANDLER_SOK = 'FLYTT_RESERVASJON_SAKSBEHANDLER_SOK',
  FLYTT_RESERVASJON = 'FLYTT_RESERVASJON',
  OPPGAVEKO_SAKSBEHANDLERE = 'OPPGAVEKO_SAKSBEHANDLERE',
  BEHANDLINGSKO_OPPGAVE_ANTALL = 'BEHANDLINGSKO_OPPGAVE_ANTALL',
  HENT_NYE_OG_FERDIGSTILTE_OPPGAVER = 'HENT_NYE_OG_FERDIGSTILTE_OPPGAVER',
  LEGG_TIL_BEHANDLET_OPPGAVE = 'LEGG_TIL_BEHANDLET_OPPGAVE',
  HENT_ALLE_RESERVASJONER = 'HENT_ALLE_RESERVASJONER',
  AVDELINGSLEDER_OPPHEVER_RESERVASJON = 'AVDELINGSLEDER_OPPHEVER_RESERVASJON',
}

const CONTEXT_PATH = isDevelopment ? 'api' : '';

export const endpoints = new RestApiConfigBuilder(CONTEXT_PATH)
  /* /api/fagsak */
  .withPost('/fagsak/sok', K9LosApiKeys.SEARCH_FAGSAK)

  /* /api/saksbehandler */
  .withGet('/saksbehandler', K9LosApiKeys.NAV_ANSATT)

  /* /api/driftsmeldinger */
  .withGet('/driftsmeldinger', K9LosApiKeys.DRIFTSMELDINGER)
  .withPost('/driftsmeldinger/slett', K9LosApiKeys.SLETT_DRIFTSMELDING)
  .withPost('/driftsmeldinger', K9LosApiKeys.LAGRE_DRIFTSMELDING)
  .withPost('/driftsmeldinger/toggle', K9LosApiKeys.TOGGLE_DRIFTSMELDING)

  /* /api/saksbehandler/saksliste */
  .withGet('/saksbehandler/oppgaveko', K9LosApiKeys.OPPGAVEKO)
  .withGet('/saksbehandler/oppgaveko/saksbehandlere', K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE)

  /* /api/saksbehandler/oppgave */
  .withGet('/saksbehandler/oppgaver', K9LosApiKeys.OPPGAVER_TIL_BEHANDLING)
  .withGet('/saksbehandler/oppgaver/reserverte', K9LosApiKeys.RESERVERTE_OPPGAVER)
  .withPost('/saksbehandler/oppgaver/reserver', K9LosApiKeys.RESERVER_OPPGAVE)
  .withGet('/saksbehandler/oppgaver/reservasjon-status', K9LosApiKeys.HENT_RESERVASJONSSTATUS)
  .withPost('/saksbehandler/oppgaver/opphev', K9LosApiKeys.OPPHEV_OPPGAVERESERVASJON)
  .withPost('/saksbehandler/oppgaver/forleng', K9LosApiKeys.FORLENG_OPPGAVERESERVASJON)
  .withGet('/saksbehandler/oppgaver/behandlede', K9LosApiKeys.BEHANDLEDE_OPPGAVER)
  .withPost('/saksbehandler/oppgaver/flytt/sok', K9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK)
  .withPost('/saksbehandler/oppgaver/flytt', K9LosApiKeys.FLYTT_RESERVASJON)
  .withGet('/saksbehandler/oppgaver/antall', K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL)
  .withGet('/saksbehandler/oppgaver/oppgaver-for-fagsaker', K9LosApiKeys.OPPGAVER_FOR_FAGSAKER)
  .withPost('/saksbehandler/oppgaver/reservasjon/endre', K9LosApiKeys.ENDRE_OPPGAVERESERVASJON)
  .withPost('/saksbehandler/oppgaver/legg-til-behandlet-sak', K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE)

  /* /api/saksbehandler/nokkeltall */
  .withGet('/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', K9LosApiKeys.HENT_NYE_OG_FERDIGSTILTE_OPPGAVER)

  /* /api/avdelingsleder/sakslister */
  .withGet('/avdelingsleder/oppgavekoer', K9LosApiKeys.OPPGAVEKOER)
  .withPost('/avdelingsleder/oppgavekoer', K9LosApiKeys.OPPRETT_NY_OPPGAVEKO)
  .withGet('/avdelingsleder/oppgavekoer/hent', K9LosApiKeys.HENT_OPPGAVEKO)
  .withPost('/avdelingsleder/oppgavekoer/slett', K9LosApiKeys.SLETT_OPPGAVEKO)
  .withPost('/avdelingsleder/oppgavekoer/navn', K9LosApiKeys.LAGRE_OPPGAVEKO_NAVN)
  .withPost('/avdelingsleder/oppgavekoer/behandlingstype', K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE)
  .withPost('/avdelingsleder/oppgavekoer/ytelsetype', K9LosApiKeys.LAGRE_OPPGAVEKO_FAGSAK_YTELSE_TYPE)
  .withPost('/avdelingsleder/oppgavekoer/andre-kriterier', K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER)
  .withPost('/avdelingsleder/oppgavekoer/sortering', K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING)
  .withPost('/avdelingsleder/oppgavekoer/skjermet', K9LosApiKeys.LAGRE_OPPGAVEKO_SKJERMET)
  .withPost('/avdelingsleder/oppgavekoer/sortering-tidsintervall-type', K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_DYNAMISK_PERIDE)
  .withPost('/avdelingsleder/oppgavekoer/sortering-tidsintervall-dager', K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DAGER)
  .withPost('/avdelingsleder/oppgavekoer/sortering-tidsintervall-dato', K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO)
  .withPost('/avdelingsleder/oppgavekoer/saksbehandler', K9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER)
  .withPost('/avdelingsleder/reservasjoner/opphev', K9LosApiKeys.AVDELINGSLEDER_OPPHEVER_RESERVASJON)

  /* /api/avdelingsleder/saksbehandlere */
  .withPost('/avdelingsleder/saksbehandlere/sok', K9LosApiKeys.SAKSBEHANDLER_SOK)
  .withGet('/avdelingsleder/saksbehandlere', K9LosApiKeys.SAKSBEHANDLERE)
  .withPost('/avdelingsleder/saksbehandlere', K9LosApiKeys.OPPRETT_NY_SAKSBEHANDLER)
  .withPost('/avdelingsleder/saksbehandlere/slett', K9LosApiKeys.SLETT_SAKSBEHANDLER)

  /* /api/avdelingsleder/oppgaver */
  .withGet('/avdelingsleder/oppgaver/antall', K9LosApiKeys.OPPGAVE_ANTALL)
  .withGet('/avdelingsleder/oppgaver/antall-totalt', K9LosApiKeys.OPPGAVE_ANTALL_TOTALT)

  /* /api/avdelingsleder/nokkeltall */
  .withGet('/avdelingsleder/nokkeltall/behandlinger-under-arbeid', K9LosApiKeys.HENT_OPPGAVER)
  .withGet('/avdelingsleder/nokkeltall/beholdning-historikk', K9LosApiKeys.HENT_OPPGAVER_PER_DATO)
  .withGet('/avdelingsleder/nokkeltall/nye-ferdigstilte-oppsummering', K9LosApiKeys.HENT_OPPSUMMERING)
  .withGet('/avdelingsleder/nokkeltall/ferdigstilte-historikk', K9LosApiKeys.HENT_FERDIGSTILTE_HISTORIKK)
  .withGet('/avdelingsleder/nokkeltall/nye-historikk', K9LosApiKeys.HENT_NYE_HISTORIKK)
  .withGet('/avdelingsleder/nokkeltall/behandlinger-manuelt-vent-historikk', K9LosApiKeys.HENT_OPPGAVER_MANUELT_PA_VENT)
  .withGet('/avdelingsleder/nokkeltall/behandlinger-forste-stonadsdag', K9LosApiKeys.HENT_OPPGAVER_PER_FORSTE_STONADSDAG)
  .withGet('/avdelingsleder/nokkeltall//dagens-tall', K9LosApiKeys.HENT_DAGENS_TALL)

  .withGet('/avdelingsleder/reservasjoner', K9LosApiKeys.HENT_ALLE_RESERVASJONER)

  /* /api/konfig */
  .withGet('/konfig/k9-sak-url', RestApiGlobalStatePathsKeys.K9SAK_URL)
  .withGet('/konfig/sse-url', RestApiGlobalStatePathsKeys.SSE_URL)

  /* /api/kodeverk */
  .withGet('/kodeverk', RestApiGlobalStatePathsKeys.KODEVERK)

  .build();

export const k9LosApi = createRequestApi(endpoints);
