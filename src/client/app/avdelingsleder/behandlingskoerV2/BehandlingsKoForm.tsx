import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { arrayMinLength, minLength, required } from '@navikt/ft-form-validators';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import FilterIndex from 'filter/FilterIndex';
import OppgaveQueryModel from 'filter/OppgaveQueryModel';
import { Saksbehandler } from 'saksbehandler/behandlingskoer/saksbehandlerTsType';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';

enum fieldnames {
    SAKSBEHANDLERE = 'saksbehandlere',
    OPPGAVE_QUERY = 'oppgaveQuery',
}

const BehandlingsKoForm = () => {
    const { startRequest: hentAlleSaksbehandlere, data: alleSaksbehandlere = [] } = useRestApiRunner<Saksbehandler[]>(
        K9LosApiKeys.SAKSBEHANDLERE,
    );
    useEffect(() => {
        hentAlleSaksbehandlere();
    }, []);

    const formMethods = useForm({
        defaultValues: {
            [fieldnames.SAKSBEHANDLERE]: [],
            [fieldnames.OPPGAVE_QUERY]: new OppgaveQueryModel().toOppgaveQuery(),
        },
    });
    const [visModal, setVisModal] = useState(false);
    const manglerGruppering = 'Mangler gruppering';
    const formaterteSaksbehandlere = alleSaksbehandlere.map((saksbehandler) => ({
        value: saksbehandler.epost,
        label: saksbehandler.navn || saksbehandler.epost,
        group: saksbehandler.enhet || manglerGruppering,
    }));
    const lagreOppgaveQuery = (oppgaveQuery) => formMethods.setValue(fieldnames.OPPGAVE_QUERY, oppgaveQuery);
    const onSubmit = (data) => console.log(data);
    const grupper = [...new Set(formaterteSaksbehandlere.map((oppgavekode) => oppgavekode.group))].sort();
    const saksbehandlere = formMethods.watch(fieldnames.SAKSBEHANDLERE);
    formMethods.register(fieldnames.SAKSBEHANDLERE, {
        validate: (sb) => arrayMinLength(1)(sb),
    });
    const antallOppgaver = 0;
    return (
        <Form
            formMethods={formMethods}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputField label="Navn" name="navn" size="medium" validate={[required, minLength(3)]} />
                    <TextAreaField
                        size="medium"
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
                            updateSelection={(valgteSaksbehandlere) => {
                                formMethods.setValue(fieldnames.SAKSBEHANDLERE, valgteSaksbehandlere);
                                formMethods.trigger('saksbehandlere');
                            }}
                            error={formMethods.getFieldState('saksbehandlere')?.error?.message}
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
            <Modal className="w-4/6" open={visModal} onClose={() => setVisModal(false)}>
                <Modal.Content className="ml-[-75px]">
                    <FilterIndex lagre={lagreOppgaveQuery} />
                </Modal.Content>
            </Modal>
        </Form>
    );
};

export default BehandlingsKoForm;
