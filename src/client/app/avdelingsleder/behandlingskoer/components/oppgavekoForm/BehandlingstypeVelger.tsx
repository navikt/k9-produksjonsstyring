import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';

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
      <Undertekst>
        <FormattedMessage id="BehandlingstypeVelger.Behandlingstype" />
      </Undertekst>
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
