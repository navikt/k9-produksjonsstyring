import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { getK9sakHref } from 'app/paths';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BehandletOppgave from 'saksbehandler/saksstotte/behandletOppgaveTsType';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/global-data/useGlobalStateRestApiData';
import useRestApi from 'api/rest-api-hooks/local-data/useRestApi';

const EMPTY_ARRAY = [];

/**
 * SistBehandledeSaker
 *
 * Denne komponenten viser de tre siste fagsakene en nav-ansatt har behandlet.
 */
const SistBehandledeSaker: FunctionComponent = () => {
  const { data: sistBehandledeSaker = EMPTY_ARRAY } = useRestApi<BehandletOppgave[]>(K9LosApiKeys.BEHANDLEDE_OPPGAVER);
  const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
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
                  href={getK9sakHref(k9sakUrl.verdi, sbs.saksnummer, sbs.behandlingId)}
                >
                  {`${sbs.navn} ${sbs.personnummer}`}
                </Lenke>
              )
              : (
                <Lenke href={getK9sakHref(k9sakUrl.verdi, sbs.saksnummer, sbs.behandlingId)}>
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
