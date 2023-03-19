import React, { useCallback, useState } from 'react';
import { Form } from 'react-final-form';
import AndreKriterierVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/AndreKriterierVelger';
import andreKriterierType from 'kodeverk/andreKriterierType';
import withIntl from '../../../decorators/withIntl.js';
import alleKodeverk from '../../../mocks/alleKodeverk.json';

export default {
  title: 'avdelingsleder/behandlingskoer/AndreKriterierVelger',
  component: AndreKriterierVelger,
  decorators: [withIntl],
};

export const skalViseVelgerAvAndreKriterier = () => {
  const [verdier, leggTilVerdi] = useState({
    [andreKriterierType.TIL_BESLUTTER]: true,
    [`${andreKriterierType.TIL_BESLUTTER}_inkluder`]: true,
  });
  const lagre = useCallback((_oppgavekoId, akType, isChecked, skalInkludere) => {
    leggTilVerdi(oldState => ({
      ...oldState,
      [akType.kode]: isChecked,
      [`${akType.kode}_inkluder`]: skalInkludere,
    }));
  }, []);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={verdier}
      render={({ values }) => (
        <AndreKriterierVelger
          alleKodeverk={alleKodeverk}
          valgtOppgavekoId={1}
          lagreOppgavekoAndreKriterier={lagre}
          values={values}
        />
      )}
    />
  );
};
