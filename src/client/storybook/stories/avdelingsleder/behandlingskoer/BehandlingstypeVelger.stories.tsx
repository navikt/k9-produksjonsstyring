import React, { useState, useCallback } from 'react';
import { Form } from 'react-final-form';

import BehandlingstypeVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/BehandlingstypeVelger';
import behandlingType from 'kodeverk/behandlingType';

import withIntl from '../../../decorators/withIntl.js';
import alleKodeverk from '../../../mocks/alleKodeverk.json';

export default {
  title: 'avdelingsleder/behandlingskoer/BehandlingstypeVelger',
  component: BehandlingstypeVelger,
  decorators: [withIntl],
};

export const skalViseVelgerForBehandlingstyper = () => {
  const [verdier, leggTilVerdi] = useState({
    [behandlingType.FORSTEGANGSSOKNAD]: true,
  });
  const lagre = useCallback((_oppgavekoId, bt, isChecked) => {
    leggTilVerdi((oldState) => ({
      ...oldState,
      [bt.kode]: isChecked,
    }));
  }, []);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={verdier}
      render={() => (
        <BehandlingstypeVelger
          alleKodeverk={alleKodeverk}
          valgtOppgavekoId={1}
          lagreOppgavekoBehandlingstype={lagre}
        />
      )}
    />
  );
};
