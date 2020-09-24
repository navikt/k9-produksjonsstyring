import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import styles from './utvalgskriterierForOppgavekoForm.less';

const behandlingstypeOrder = Object.values(behandlingType);

interface OwnProps {
    valgtOppgavekoId: string;
    lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean) => void;
    alleKodeverk: {[key: string]: Kodeverk[]};
}

/**
 * BehandlingstypeVelger
 */
const BehandlingstypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  lagreOppgavekoBehandlingstype,
  alleKodeverk,
}) => {
  const behandlingTyper = useMemo(() => behandlingstypeOrder.map((kode) => alleKodeverk[kodeverkTyper.BEHANDLING_TYPE].find((bt) => bt.kode === kode)),
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
            onChange={(isChecked) => lagreOppgavekoBehandlingstype(valgtOppgavekoId, bt, isChecked)}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default BehandlingstypeVelger;
