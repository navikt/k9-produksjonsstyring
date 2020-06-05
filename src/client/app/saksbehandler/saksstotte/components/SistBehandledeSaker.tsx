
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lenke from 'nav-frontend-lenker';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { getK9sakHref } from 'app/paths';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getBehandledeOppgaver } from 'saksbehandler/saksstotte/duck';
import BehandletOppgave from 'saksbehandler/saksstotte/behandletOppgaveTsType';


interface OwnProps {
  k9sakUrl: string;
  sistBehandledeSaker: BehandletOppgave[];
}

/**
 * SistBehandledeSaker
 *
 * Denne komponenten viser de tre siste fagsakene en nav-ansatt har behandlet.
 */
// eslint-disable-next-line react/prefer-stateless-function
export class SistBehandledeSaker extends Component<OwnProps> {
    render = () => {
      const {
        sistBehandledeSaker, k9sakUrl,
      } = this.props;
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
                      href={getK9sakHref(k9sakUrl, sbs.saksnummer, sbs.behandlingId)}
                    >
                      {`${sbs.navn} ${sbs.personnummer}`}
                    </Lenke>
                  )
                  : (
                    <Lenke href={getK9sakHref(k9sakUrl, sbs.saksnummer, sbs.behandlingId)}>
                      <FormattedMessage id="SistBehandledeSaker.Behandling" values={{ index: index + 1 }} />
                    </Lenke>
                  )}
              </Normaltekst>
              <VerticalSpacer eightPx />
            </Fragment>
          ))}
        </>
      );
    }
}

const mapStateToProps = (state) => ({
  sistBehandledeSaker: getBehandledeOppgaver(state) || [],
});


export default connect(mapStateToProps)(SistBehandledeSaker);
