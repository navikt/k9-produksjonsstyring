import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';
import axios from 'axios';
import { Kødefinisjon } from 'types/Kødefinisjon';
import { Edit } from '@navikt/ds-icons';
import { BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { arrayMinLength, minLength, required } from '@navikt/ft-form-validators';
import { AvdelingslederContext } from 'avdelingsleder/context';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import FilterIndex from 'filter/FilterIndex';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';

enum fieldnames {
	TITTEL = 'tittel',
	SAKSBEHANDLERE = 'saksbehandlere',
	OPPGAVE_QUERY = 'oppgaveQuery',
	BESKRIVELSE = 'beskrivelse',
}

interface OwnProps {
	kø: Kødefinisjon;
	lukk: () => void;
	ekspandert: boolean;
}

const BehandlingsKoForm = ({ kø, lukk, ekspandert }: OwnProps) => {
	const [visFilterModal, setVisFilterModal] = useState(false);
	const [visLagreModal, setVisLagreModal] = useState(false);
	const lagreMutation = useMutation<Kødefinisjon, unknown, { tittel: string }>(
		(payload) => axios.post('/api/oppdater/v2', payload).then((res) => res.data),
		{ onSuccess: () => setVisLagreModal(false) },
	);
	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: kø.tittel,
			[fieldnames.SAKSBEHANDLERE]: kø.saksbehandlere,
			[fieldnames.OPPGAVE_QUERY]: kø.oppgaveQuery,
			[fieldnames.BESKRIVELSE]: kø.beskrivelse,
		},
	});

	useEffect(() => {
		formMethods.reset();
	}, [ekspandert]);

	const { saksbehandlere: alleSaksbehandlere } = useContext(AvdelingslederContext);

	const manglerGruppering = 'Mangler gruppering';
	const formaterteSaksbehandlere = alleSaksbehandlere.map((saksbehandler) => ({
		value: saksbehandler.epost,
		label: saksbehandler.navn || saksbehandler.epost,
		group: saksbehandler.enhet || manglerGruppering,
	}));
	const lagreOppgaveQuery = (oppgaveQuery) => {
		formMethods.setValue(fieldnames.OPPGAVE_QUERY, oppgaveQuery);
		setVisFilterModal(false);
	};
	const onSubmit = (data) => {
		lagreMutation.mutate(data);
	};
	const grupper = [...new Set(formaterteSaksbehandlere.map((oppgavekode) => oppgavekode.group))].sort();
	const saksbehandlere = formMethods.watch(fieldnames.SAKSBEHANDLERE);
	formMethods.register(fieldnames.SAKSBEHANDLERE, {
		validate: (sb) => arrayMinLength(1)(sb),
	});
	const antallOppgaver = 0;
	return (
		<Form formMethods={formMethods}>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<InputField label="Navn" name={fieldnames.TITTEL} size="medium" validate={[required, minLength(3)]} />
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
			<div className="flex">
				<div className="inline-block">
					<EnkelTeller antall={antallOppgaver} tekst="Oppgaver i denne køen" />
				</div>
				<Button
					className="ml-1 my-auto "
					variant="tertiary"
					type="button"
					onClick={() => setVisFilterModal(true)}
					icon={<Edit />}
				>
					Endre filter
				</Button>
			</div>
			<div className="mt-16 flex gap-4">
				<Button
					type="button"
					onClick={async () => {
						const isValid = await formMethods.trigger();
						if (isValid) {
							setVisLagreModal(true);
						}
					}}
				>
					Lagre kø
				</Button>
				<Button variant="secondary" type="button" onClick={lukk}>
					Lukk uten å lagre
				</Button>
			</div>
			{lagreMutation.isError && <ErrorMessage>Noe gikk galt ved lagring av kø</ErrorMessage>}

			<Modal className="w-2/6" open={visLagreModal} onClose={() => setVisLagreModal(false)}>
				<Modal.Content>
					<Heading spacing level="2" size="medium">
						Lagre kø
					</Heading>
					<div className="h-[75px] flex items-center">
						<BodyShort>Er du sikker på at du ønsker å lagre køen?</BodyShort>
					</div>
					<Button className="mt-2" onClick={formMethods.handleSubmit((values) => onSubmit(values))}>
						Lagre kø
					</Button>
					<Button className="ml-2" variant="secondary" onClick={() => setVisLagreModal(false)}>
						Avbryt
					</Button>
				</Modal.Content>
			</Modal>
			<Modal className="w-3/6" open={visFilterModal} onClose={() => setVisFilterModal(false)}>
				<Modal.Content className="ml-[-75px]">
					<FilterIndex
						initialQuery={formMethods.watch(fieldnames.OPPGAVE_QUERY)}
						lagre={lagreOppgaveQuery}
						avbryt={() => setVisFilterModal(false)}
					/>
				</Modal.Content>
			</Modal>
		</Form>
	);
};

export default BehandlingsKoForm;
