import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import styles from './dagensTallPanel.less';

const DagensTallPanel: FunctionComponent<WrappedComponentProps> = () => {
  const { startRequest: hentAntallIdag, data: totaltIdag } = useRestApiRunner<number>(K9LosApiKeys.OPPGAVE_ANTALL_TOTALT);
  const { startRequest: hentDagensTall, data: dagensTall = [] } = useRestApiRunner<ApneBehandlinger[]>(K9LosApiKeys.HENT_DAGENS_TALL);

  return (
    <>
      <Normaltekst className={styles.header}>Status</Normaltekst>
      <VerticalSpacer twentyPx />
      <div className={styles.container}>
        <EnkelTeller antall={totaltIdag} tekst="Åpne behandlinger" />

        {dagensTall && dagensTall.map((dt) => (
          <EnkelTeller antall={dt.antall} tekst={dt.behandlingType.navn} />
        ))}
      </div>
    </>

  );
};

export default injectIntl(DagensTallPanel);
