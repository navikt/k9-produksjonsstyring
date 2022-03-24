import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { getK9punsjRef, getK9sakHref, getOmsorgspengerRef } from 'app/paths';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BehandletOppgave from 'saksbehandler/saksstotte/behandletOppgaveTsType';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { captureMessage } from '@sentry/browser';

const EMPTY_ARRAY = [];

/**
 * SistBehandledeSaker
 *
 * Denne komponenten viser de tre siste fagsakene en nav-ansatt har behandlet.
 */
const SistBehandledeSaker: FunctionComponent = () => {
  const { data: sistBehandledeSaker = EMPTY_ARRAY } = useRestApi<BehandletOppgave[]>(K9LosApiKeys.BEHANDLEDE_OPPGAVER);
  const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
  const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);
  const omsorgspengerUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.OMSORGSPENGER_URL);

  const getUrl = (oppgave: BehandletOppgave) => {
    switch (oppgave.system) {
      case 'K9SAK':
        return getK9sakHref(k9sakUrl.verdi, oppgave.saksnummer, oppgave.behandlingId);
      case 'PUNSJ':
        return getK9punsjRef(k9punsjUrl.verdi, oppgave.journalpostId);
      case 'OMSORGSPENGER':
        return getOmsorgspengerRef(omsorgspengerUrl.verdi, oppgave.saksnummer);
      default:
        return getK9sakHref(k9sakUrl.verdi, oppgave.saksnummer, oppgave.behandlingId);
    }
  };

  const sendVidereTilFagsak = (sbs: BehandletOppgave) => {
    captureMessage(`Send til: ${sbs.saksnummer || sbs.journalpostId} - Tidspunkt: ${new Date().toLocaleString('no-NO', { timeZone: 'Europe/Oslo' })}`);
    window.location.assign(getUrl(sbs));
  };

  return (
    <>
      <Undertittel><FormattedMessage id="SistBehandledeSaker.SistBehandledeSaker" /></Undertittel>
      <VerticalSpacer eightPx />
      {sistBehandledeSaker.length === 0
                && <Normaltekst><FormattedMessage id="SistBehandledeSaker.IngenBehandlinger" /></Normaltekst>}
      {sistBehandledeSaker.map((sbs, index) => (
        <Fragment key={sbs.behandlingId}>
          <Normaltekst>
            {sbs.navn
              ? (
                <Lenke
                  onClick={() => sendVidereTilFagsak(sbs)}
                >
                  {`${sbs.navn} ${sbs.personnummer}`}
                </Lenke>
              )
              : (
                <Lenke onClick={() => sendVidereTilFagsak(sbs)}>
                  <FormattedMessage id="SistBehandledeSaker.Behandling" values={{ index: index + 1 }} />
                </Lenke>
              )}
          </Normaltekst>
          <VerticalSpacer eightPx />
        </Fragment>
      ))}
    </>
  );
};

export default SistBehandledeSaker;
