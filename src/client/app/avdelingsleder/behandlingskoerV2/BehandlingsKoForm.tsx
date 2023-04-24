import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { OppgavekøV2 } from 'types/OppgavekøV2Type';
import { Edit } from '@navikt/ds-icons';
import { Alert, BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { arrayMinLength, minLength, required } from '@navikt/ft-form-validators';
import { useKo, useOppdaterKøMutation } from 'api/queries/avdelingslederQueries';
import { AvdelingslederContext } from 'avdelingsleder/context';
import FilterIndex from 'filter/FilterIndex';
import SearchWithDropdown from 'sharedComponents/SearchWithDropdown';

enum fieldnames {
	TITTEL = 'tittel',
	SAKSBEHANDLERE = 'saksbehandlere',
	OPPGAVE_QUERY = 'oppgaveQuery',
	BESKRIVELSE = 'beskrivelse',
	FRITT_VALG_AV_OPPGAVE = 'frittValgAvOppgave',
}

interface BaseProps {
	lukk: () => void;
	ekspandert: boolean;
}

interface BehandlingsKoFormContainer extends BaseProps {
	id: string;
}
interface BehandlingsKoFormProps extends BaseProps {
	kø: OppgavekøV2;
}

const BehandlingsKoForm = ({ kø, lukk, ekspandert }: BehandlingsKoFormProps) => {
	const { versjon } = kø;
	const [visFilterModal, setVisFilterModal] = useState(false);
	const [visLagreModal, setVisLagreModal] = useState(false);
	const [visSuksess, setVisSuksess] = useState(false);
	const { saksbehandlere: alleSaksbehandlere } = useContext(AvdelingslederContext);
	const formMethods = useForm({
		defaultValues: {
			[fieldnames.TITTEL]: kø?.tittel || '',
			[fieldnames.SAKSBEHANDLERE]: kø?.saksbehandlere || [],
			[fieldnames.OPPGAVE_QUERY]: kø?.oppgaveQuery ? kø?.oppgaveQuery : undefined,
			[fieldnames.BESKRIVELSE]: kø?.beskrivelse || '',
			[fieldnames.FRITT_VALG_AV_OPPGAVE]: kø?.frittValgAvOppgave || false,
		},
	});

	const lagreMutation = useOppdaterKøMutation(() => {
		setVisLagreModal(false);
		setVisSuksess(true);
	});
	useEffect(() => {
		formMethods.reset(kø);
	}, [ekspandert, versjon]);

	useEffect(() => {
		if (visSuksess) {
			setTimeout(() => setVisSuksess(false), 3000);
		}
	}, [visSuksess]);

	const manglerGruppering = 'Mangler gruppering';
	const formaterteSaksbehandlere = alleSaksbehandlere.map((saksbehandler) => ({
		value: saksbehandler.epost,
		label: saksbehandler.navn || saksbehandler.epost,
		group: saksbehandler.enhet || manglerGruppering,
	}));
	const lagreOppgaveQuery = (oppgaveQuery) => {
		formMethods.setValue(fieldnames.OPPGAVE_QUERY, oppgaveQuery, { shouldDirty: true });
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
			<div className="grid grid-cols-2 gap-16">
				<div>
					<Heading className="mb-2" size="small">
						Om køen
					</Heading>
					<div className="bg-[#e6f0ff] rounded p-7 pb-3">
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
				</div>
				<div className="w-full">
					<Heading className="mb-2" size="small">
						Saksbehandlere
					</Heading>

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
								formMethods.setValue(fieldnames.SAKSBEHANDLERE, valgteSaksbehandlere, { shouldDirty: true });
								formMethods.trigger('saksbehandlere');
							}}
							error={formMethods.getFieldState('saksbehandlere')?.error?.message}
							selectedValues={saksbehandlere}
						/>
					)}
				</div>
			</div>
			<div className="flex mt-6 gap-4">
				<div className="inline-block">
					<div className="bg-gray-100 rounded p-2">
						Antall behandlinger: <span>{`${antallOppgaver || '-'}`}</span>
					</div>
				</div>
				<Button
					className="ml-1 my-auto "
					variant="tertiary"
					type="button"
					onClick={() => setVisFilterModal(true)}
					icon={<Edit />}
				>
					Endre filter for kø
				</Button>
			</div>
			{visSuksess && (
				<Alert variant="success" className="mt-12 max-w-[300px]">
					Køen er nå lagret!
				</Alert>
			)}
			<div className="mt-8 flex gap-4">
				<Button
					type="button"
					onClick={async () => {
						const isValid = await formMethods.trigger();
						if (isValid) {
							setVisLagreModal(true);
						}
					}}
					disabled={!formMethods.formState.isDirty}
				>
					Lagre kø
				</Button>
				<Button variant="secondary" type="button" onClick={lukk}>
					Lukk
				</Button>
			</div>
			<Modal className="w-2/6" open={visLagreModal} onClose={() => setVisLagreModal(false)}>
				<Modal.Content>
					<Heading spacing level="1" size="medium">
						Lagre kø
					</Heading>
					<div className="h-[75px] flex items-center">
						<BodyShort>Er du sikker på at du ønsker å lagre køen?</BodyShort>
					</div>
					{lagreMutation.isError && (
						<div>
							<ErrorMessage>Noe gikk galt ved lagring av kø</ErrorMessage>
						</div>
					)}
					<Button className="mt-2" onClick={formMethods.handleSubmit((values) => onSubmit({ ...kø, ...values }))}>
						Lagre kø
					</Button>
					<Button className="ml-2" variant="secondary" onClick={() => setVisLagreModal(false)}>
						Avbryt
					</Button>
				</Modal.Content>
			</Modal>
			<Modal className="w-3/6" open={visFilterModal} onClose={() => setVisFilterModal(false)}>
				<Modal.Content className="ml-[-75px]">
					<Heading className="ml-[80px] mb-8" level="1" size="small">
						Endre filter for behandlingskø
					</Heading>
					<FilterIndex lagre={lagreOppgaveQuery} avbryt={() => setVisFilterModal(false)} />
				</Modal.Content>
			</Modal>
		</Form>
	);
};

const BehandlingsKoFormContainer = (props: BehandlingsKoFormContainer) => {
	const { lukk, ekspandert } = props;
	const { data, isLoading, error } = useKo(props.id, { enabled: ekspandert });

	if (isLoading) {
		return <div className="animate-pulse bg-surface-neutral-subtle h-10 w-full rounded-xl" />;
	}

	if (error) {
		return <ErrorMessage>Noe gikk galt ved henting av kø</ErrorMessage>;
	}

	if (!data) return null;

	return <BehandlingsKoForm kø={data} lukk={lukk} ekspandert={ekspandert} />;
};

export default BehandlingsKoFormContainer;
