import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';

import { Textarea } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { Saksbehandler } from 'saksbehandler/behandlingskoer/saksbehandlerTsType';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';

const BehandlingsKoForm = () => {
  const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(
    K9LosApiKeys.SAKSBEHANDLERE,
  );
  useEffect(() => {
    hentAlleSaksbehandlere();
  }, []);

  const formMethods = useForm({ defaultValues: { saksbehandlere: [] } });

  const manglerGruppering = 'Mangler gruppering';
  const formaterteSaksbehandlere = alleSaksbehandlere.map(saksbehandler => ({
    value: saksbehandler.epost,
    label: saksbehandler.navn || saksbehandler.epost,
    group: saksbehandler.enhet || manglerGruppering,
  }));
  const onSubmit = data => console.log(data);

  const grupper = [...new Set(formaterteSaksbehandlere.map(oppgavekode => oppgavekode.group))].sort();

  const saksbehandlere = formMethods.watch('saksbehandlere');
  const handleSaksbehandlerChange =
    (setValue: any) =>
    (nyeValgteSaksbehandlereposter: string[] = []) => {
      const nyeValgteSaksbehandlere = nyeValgteSaksbehandlereposter
        .filter(saksbehandlerEpost => !saksbehandlere.includes(saksbehandlerEpost))
        .map(saksbehandlerEpost => ({
          id: saksbehandlerEpost,
          epost: saksbehandlerEpost,
          checked: true,
        }));
      const saksbehandlererSomSkalFjernes = saksbehandlere
        .filter(valgtSaksbehandler => !nyeValgteSaksbehandlereposter.includes(valgtSaksbehandler))
        .map(valgtSaksbehandler => ({
          id: valgtSaksbehandler,
          epost: valgtSaksbehandler,
          checked: false,
        }));
      const data = nyeValgteSaksbehandlere.concat(saksbehandlererSomSkalFjernes);
      setValue('saksbehandlere', data);
    };

  console.log(saksbehandlere);

  return (
    <Form
      formMethods={formMethods}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField label="Navn" name="navn" validate={[required]} />
          <TextAreaField
            name="beskrivelse"
            label="Beskrivelse"
            description="Her kan du legge inn en valgfri beskrivelse av hva denne køen inneholder."
            className="my-8"
          />
        </div>
        <div>
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
              updateSelection={handleSaksbehandlerChange(formMethods.setValue)}
              selectedValues={[]}
            />
          )}
        </div>
      </div>

      <input type="submit" />
    </Form>
  );
};

export default BehandlingsKoForm;
