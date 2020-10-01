import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/global-data/useKodeverk';
import styles from './utvalgskriterierForOppgavekoForm.less';

const behandlingstypeOrder = Object.values(behandlingType);

interface OwnProps {
    valgtOppgavekoId: string;
}

/**
 * BehandlingstypeVelger
 */
const BehandlingstypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
}) => {
  const { startRequest: lagreOppgavekoBehandlingstype } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);
  const alleBehandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const behandlingTyper = useMemo(() => behandlingstypeOrder.map((kode) => alleBehandlingTyper.find((bt) => bt.kode === kode)),
    []);
  return (
    <>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="BehandlingstypeVelger.Behandlingstype" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      {behandlingTyper.map((bt) => (
        <React.Fragment key={bt.kode}>
          <VerticalSpacer fourPx />
          <CheckboxField
            name={bt.kode}
            label={bt.navn}
            onChange={(isChecked) => lagreOppgavekoBehandlingstype({ id: valgtOppgavekoId, behandlingType: bt, checked: isChecked }).then(() => {
              hentOppgaveko({ id: valgtOppgavekoId });
            })}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default BehandlingstypeVelger;
