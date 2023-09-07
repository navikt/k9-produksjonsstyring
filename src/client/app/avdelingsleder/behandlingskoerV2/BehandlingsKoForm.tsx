import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { OppgavekøV2 } from 'types/OppgavekøV2Type';
import { Edit } from '@navikt/ds-icons';
import { Alert, Button, ErrorMessage, Heading, Label, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { arrayMinLength, minLength, required } from '@navikt/ft-form-validators';
import { useKo, useOppdaterKøMutation } from 'api/queries/avdelingslederQueries';
import { AvdelingslederContext } from 'avdelingsleder/context';
import FilterIndex from 'filter/FilterIndex';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';
import LagreKoModal from './LagreKoModal';

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
	id: string;
}

interface BehandlingsKoFormProps extends BaseProps {
	kø: OppgavekøV2;
}

const BehandlingsKoForm = ({ kø, lukk, ekspandert, id }: BehandlingsKoFormProps) => {
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
		mode: 'all',
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
							maxLength={4000}
							validate={[required, minLength(3)]}
						/>
					</div>
				</div>
				<div className="w-full">
					<Heading className="mb-2" size="small">
						Saksbehandlere
					</Heading>

					{alleSaksbehandlere.length === 0 && (
						<>
							<FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
							{formMethods.getFieldState('saksbehandlere')?.error?.message && (
								<ErrorMessage>{formMethods.getFieldState('saksbehandlere')?.error?.message}</ErrorMessage>
							)}
						</>
					)}
					{alleSaksbehandlere.length > 0 && (
						<SearchWithDropdown
							label="Velg saksbehandlere"
							className="bg-[#e6f0ff] rounded p-7 pb-3"
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
			<div className="mt-8">
				<div>
					<Label size="small">Kriterier for kø:</Label>
				</div>
				<Button
					className="ml-1 mt-1 "
					size="small"
					variant="tertiary"
					type="button"
					onClick={() => setVisFilterModal(true)}
					icon={<Edit />}
				>
					Endre kriterier
				</Button>
			</div>
			{formMethods.formState.isDirty && (
				<Alert variant="warning" className="mt-12 max-w-[500px]">
					Du har gjort endringer i køen. Husk å lagre endringene før du lukker vinduet.
				</Alert>
			)}
			{visSuksess && (
				<Alert variant="success" className="mt-12 max-w-[300px]">
					Køen er nå lagret!
				</Alert>
			)}
			<div id={id} className="mt-8 flex gap-4">
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
					Lagre behandlingskø
				</Button>
				<Button variant="secondary" type="button" onClick={lukk}>
					{formMethods.formState.isDirty ? 'Lukk uten å lagre' : 'Lukk'}
				</Button>
			</div>
			<LagreKoModal
				visLagreModal={visLagreModal}
				setVisLagreModal={setVisLagreModal}
				onSubmit={formMethods.handleSubmit((values) => onSubmit({ ...kø, ...values }))}
				lagreMutation={lagreMutation}
			/>
			{visFilterModal && (
				<Modal className="w-[44rem] h-[45rem]" open={visFilterModal} onClose={() => setVisFilterModal(false)} portal>
					<Modal.Body>
						<FilterIndex
							initialQuery={formMethods.watch(fieldnames.OPPGAVE_QUERY)}
							lagre={lagreOppgaveQuery}
							avbryt={() => setVisFilterModal(false)}
							tittel="Kriterier for kø"
							visningV2
						/>
					</Modal.Body>
				</Modal>
			)}
		</Form>
	);
};

const BehandlingsKoFormContainer = (props: BaseProps) => {
	const { lukk, ekspandert, id } = props;
	const { data, isLoading, error } = useKo(props.id, { enabled: ekspandert });

	if (isLoading) {
		return <div className="animate-pulse bg-surface-neutral-subtle h-10 w-full rounded-xl" />;
	}

	if (error) {
		return <ErrorMessage>Noe gikk galt ved henting av kø</ErrorMessage>;
	}

	if (!data) return null;

	return <BehandlingsKoForm kø={data} id={id} lukk={lukk} ekspandert={ekspandert} />;
};

export default BehandlingsKoFormContainer;
