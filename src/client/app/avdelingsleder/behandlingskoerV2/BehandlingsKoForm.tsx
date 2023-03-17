import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';

import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { Saksbehandler } from 'saksbehandler/behandlingskoer/saksbehandlerTsType';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';
import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';
import FilterIndex from 'filter/FilterIndex';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';

const BehandlingsKoForm = () => {
  const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(
    K9LosApiKeys.SAKSBEHANDLERE,
  );
  useEffect(() => {
    hentAlleSaksbehandlere();
  }, []);

  const formMethods = useForm({
    defaultValues: { saksbehandlere: [], oppgaveQuery: new OppgaveQueryModel().toOppgaveQuery() },
  });
  const [visModal, setVisModal] = useState(false);
  const manglerGruppering = 'Mangler gruppering';
  const formaterteSaksbehandlere = alleSaksbehandlere.map(saksbehandler => ({
    value: saksbehandler.epost,
    label: saksbehandler.navn || saksbehandler.epost,
    group: saksbehandler.enhet || manglerGruppering,
  }));
  const lagreOppgaveQuery = oppgaveQuery => formMethods.setValue('oppgaveQuery', oppgaveQuery);
  const onSubmit = data => console.log(data);

  const grupper = [...new Set(formaterteSaksbehandlere.map(oppgavekode => oppgavekode.group))].sort();

  const saksbehandlere = formMethods.watch('saksbehandlere');
  const antallOppgaver = 0;
  return (
    <Form
      formMethods={formMethods}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField label="Navn" name="navn" validate={[required, minLength(3)]} />
          <TextAreaField
            name="beskrivelse"
            label="Beskrivelse"
            description="Her kan du legge inn en valgfri beskrivelse av hva denne køen inneholder."
            className="my-8"
            validate={[required]}
          />
        </div>
        <div className="w-full">
          {alleSaksbehandlere.length === 0 && (
            <FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
          )}
          {alleSaksbehandlere.length > 0 && (
            <SearchWithDropdown
              label="Velg saksbehandlere"
              suggestions={formaterteSaksbehandlere}
              groups={grupper}
              addButtonText="Legg til saksbehandlere"
              heading="Velg saksbehandlere"
              updateSelection={valgteSaksbehandlere => formMethods.setValue('saksbehandlere', valgteSaksbehandlere)}
              selectedValues={saksbehandlere}
            />
          )}
        </div>
      </div>
      <div>
        <BodyShort className="inline-block">{`${antallOppgaver} oppgaver i køen.`}</BodyShort>
      </div>
      <div className="mt-8 flex gap-4">
        <Button type="submit">Lagre</Button>
        <Button variant="secondary" type="button" onClick={() => setVisModal(true)}>
          Endre filter
        </Button>
      </div>
      <Modal className="h-5/6 w-4/6" open={visModal} onClose={() => setVisModal(false)}>
        <Modal.Content>
          <Heading size="medium">Filter</Heading>
          <FilterIndex lagre={lagreOppgaveQuery} />
        </Modal.Content>
      </Modal>
    </Form>
  );
};

export default BehandlingsKoForm;
