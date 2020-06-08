import React, { useState, useCallback } from 'react';
import { Form } from 'react-final-form';

import FagsakYtelseTypeVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/FagsakYtelseTypeVelger';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';

import withIntl from '../../../decorators/withIntl.js';
import alleKodeverk from '../../../mocks/alleKodeverk.json';

export default {
  title: 'avdelingsleder/behandlingskoer/FagsakYtelseTypeVelger',
  component: FagsakYtelseTypeVelger,
  decorators: [withIntl],
};

export const skalViseVelgerForFagsakYtelseTyper = () => {
  const [verdier, leggTilVerdi] = useState({
    fagsakYtelseType: fagsakYtelseType.FORELDREPRENGER,
  });
  const lagre = useCallback((_oppgavekoId, fyt) => {
    leggTilVerdi((oldState) => ({
      ...oldState,
      fagsakYtelseType: fyt,
    }));
  }, []);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={verdier}
      render={() => (
        <FagsakYtelseTypeVelger
          alleKodeverk={alleKodeverk}
          valgtOppgavekoId={1}
          lagreOppgavekoFagsakYtelseType={lagre}
        />
      )}
    />
  );
};
