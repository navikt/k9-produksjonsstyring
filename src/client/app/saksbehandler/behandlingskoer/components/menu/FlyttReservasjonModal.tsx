import React, { FunctionComponent, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { useGetAlleSaksbehandlere } from 'api/queries/saksbehandlerQueries';
import { ErrorMessage, Skeleton, UNSAFE_Combobox, Modal, Button } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { Form, TextAreaField, Datepicker } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required, dateAfterOrEqualToToday } from '@navikt/ft-form-validators';

interface OwnProps {
	showModal: boolean;
	oppgaveNøkkel: OppgaveNøkkel;
	oppgaveReservertTil?: Date | string;
	closeModal: () => void;
	eksisterendeBegrunnelse?: string;
	reservertAvIdent: string;
}

interface FlyttReservasjonType {
	reserverTil: string;
	begrunnelse: string;
	saksbehandlerIdent: string;
}

/**
 * FlyttReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonModal: FunctionComponent<OwnProps> = ({
	showModal,
	closeModal,
	oppgaveNøkkel,
	oppgaveReservertTil,
	eksisterendeBegrunnelse,
	reservertAvIdent,
}) => {
	const { startRequest: endreOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.ENDRE_OPPGAVERESERVASJON);
	const intl = useIntl();
	const queryClient = useQueryClient();
	const { data: saksbehandlere, isLoading, error } = useGetAlleSaksbehandlere({ placeholderData: [] });

	const uniqueSaksbehandlere = Array.from(new Set(saksbehandlere.map((a) => a.brukerIdent))).map((brukerIdent) => {
		return saksbehandlere.find((a) => a.brukerIdent === brukerIdent);
	});

	const saksbehandlerOptions = uniqueSaksbehandlere.map((v) => ({ value: v.brukerIdent, label: v.navn }));

	const fieldnames: FlyttReservasjonType = {
		reserverTil: 'reserverTil',
		begrunnelse: 'begrunnelse',
		saksbehandlerIdent: 'saksbehandlerIdent',
	};

	const initialValues = {
		[fieldnames.reserverTil]: oppgaveReservertTil
			? dayjs(oppgaveReservertTil).format('YYYY-MM-DD')
			: dayjs().format('YYYY-MM-DD'),
		[fieldnames.begrunnelse]: eksisterendeBegrunnelse || '',
		[fieldnames.saksbehandlerIdent]: reservertAvIdent || '',
	};
	const formMethods = useForm<FlyttReservasjonType>({ defaultValues: initialValues, mode: 'onBlur' });

	const { setValue, formState, trigger } = formMethods;
	useEffect(() => {
		formMethods.register(fieldnames.saksbehandlerIdent as keyof FlyttReservasjonType, { validate: required });
	}, [formMethods]);

	const saksbehandlerIdent = formMethods.watch(fieldnames.saksbehandlerIdent as keyof FlyttReservasjonType);
	const endreReservasjonFn = (brukerIdent: string, begrunnelse: string, reservertTilDato: string): Promise<any> => {
		const params = {
			oppgaveNøkkel,
			brukerIdent,
			begrunnelse,
			reserverTil: reservertTilDato,
		};

		return endreOppgaveReservasjon(params).then(() => {
			closeModal();
			queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner);
			queryClient.invalidateQueries(apiPaths.avdelinglederReservasjoner);
		});
	};
	const onSubmit = (brukerIdent: string, begrunnelse: string, reservertTilDato: string) => {
		endreReservasjonFn(brukerIdent, begrunnelse, reservertTilDato);
	};

	return (
		<Modal
			open={showModal}
			onClose={closeModal}
			header={{ heading: intl.formatMessage({ id: 'FlyttReservasjonModal.Tittel' }) }}
		>
			<Modal.Body>
				<Form
					formMethods={formMethods}
					onSubmit={(values) => onSubmit(values.saksbehandlerIdent, values.begrunnelse, values.reserverTil)}
					className="p-2"
				>
					{isLoading && <Skeleton height={80} />}
					{(error || !saksbehandlere) && <ErrorMessage>Noe gikk galt ved henting av saksbehandlere</ErrorMessage>}
					{saksbehandlere.length > 0 && (
						<UNSAFE_Combobox
							label="Velg saksbehandler"
							size="small"
							options={saksbehandlerOptions}
							selectedOptions={
								saksbehandlerIdent && saksbehandlerOptions.find((v) => v.value === saksbehandlerIdent)
									? saksbehandlerOptions.filter((v) => v.value === saksbehandlerIdent)
									: []
							}
							onToggleSelected={(optionValue, isSelected) => {
								if (isSelected) {
									setValue(
										fieldnames.saksbehandlerIdent as keyof FlyttReservasjonType,
										saksbehandlere.find((v) => v.brukerIdent === optionValue)?.brukerIdent,
									);
								} else {
									setValue(fieldnames.saksbehandlerIdent as keyof FlyttReservasjonType, '');
								}
							}}
							shouldAutocomplete={true}
							onBlurCapture={() => trigger(fieldnames.saksbehandlerIdent as keyof FlyttReservasjonType)}
							error={formState.errors.saksbehandlerIdent?.message}
						/>
					)}
					<div className="mt-8">
						<Datepicker
							label={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjonText' })}
							name={fieldnames.reserverTil}
							validate={[dateAfterOrEqualToToday]}
						/>
					</div>
					<TextAreaField
						className="mt-8"
						label={intl.formatMessage({ id: 'FlyttReservasjonModal.Begrunn' })}
						name="begrunnelse"
						validate={[required, minLength(3), maxLength(1500), hasValidText]}
					/>
					<Modal.Footer>
						<Button variant="primary" type="submit">
							{intl.formatMessage({ id: 'FlyttReservasjonModal.Ok' })}
						</Button>
						<Button variant="secondary" type="reset" onClick={closeModal}>
							{intl.formatMessage({ id: 'FlyttReservasjonModal.Avbryt' })}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default FlyttReservasjonModal;
