import React, { FunctionComponent, useEffect } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { useGetAlleSaksbehandlere } from 'api/queries/saksbehandlerQueries';
import { ErrorMessage, Skeleton, UNSAFE_Combobox, Modal, Button } from '@navikt/ds-react';
import { useForm } from 'react-hook-form';
import { Form, TextAreaField, Datepicker } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required, dateAfterOrEqualToToday } from '@navikt/ft-form-validators';
import { useEndreReservasjoner } from 'api/queries/avdelingslederQueries';

interface FlyttReservasjonType {
	oppgaveNøkkel: OppgaveNøkkel;
	begrunnelse: string;
	reserverTil?: string;
	reservertAvIdent?: string;
}

interface OwnProps {
	open: boolean;
	closeModal: () => void;
	reservasjoner?: FlyttReservasjonType[];
}

const harFlereReservasjoner = (reservasjoner: FlyttReservasjonType[]) => reservasjoner && reservasjoner.length > 1;

const initialValues = (reservasjoner: FlyttReservasjonType[]) => {
	if (harFlereReservasjoner(reservasjoner)) {
		return {
			reserverTil: '',
			begrunnelse: null,
			reservertAvIdent: '',
		};
	}
	return {
		reserverTil: reservasjoner[0]?.reserverTil ? dayjs(reservasjoner[0].reserverTil).format('YYYY-MM-DD') : '',
		begrunnelse: reservasjoner[0]?.begrunnelse || null,
		reservertAvIdent: reservasjoner[0]?.reservertAvIdent || '',
	};
};

/**
 * FlyttReservasjonerModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, reservasjoner }) => {
	const { mutate: flyttReservasjoner } = useEndreReservasjoner({ callback: closeModal });
	const intl = useIntl();
	const { data: saksbehandlere, isLoading, error } = useGetAlleSaksbehandlere({ placeholderData: [] });
	const uniqueSaksbehandlere = Array.from(new Set(saksbehandlere.map((a) => a.brukerIdent))).map((brukerIdent) => {
		return saksbehandlere.find((a) => a.brukerIdent === brukerIdent);
	});
	const saksbehandlerOptions = uniqueSaksbehandlere
		.map((v) => ({ value: v.brukerIdent, label: v.navn }))
		.sort((a, b) => a.label.localeCompare(b.label));

	const formMethods = useForm<Omit<FlyttReservasjonType, 'oppgaveNøkkel'>>({
		defaultValues: initialValues(reservasjoner),
		mode: 'onBlur',
		reValidateMode: 'onChange',
	});
	const { setValue, formState, trigger } = formMethods;
	useEffect(() => {
		formMethods.register('reservertAvIdent', { validate: required });
	}, [formMethods]);

	const saksbehandlerIdent = formMethods.watch('reservertAvIdent');
	const onSubmit = (brukerIdent: string, begrunnelse: string, reserverTil: string) => {
		if (reservasjoner.length === 1) {
			flyttReservasjoner([
				{
					oppgaveNøkkel: reservasjoner[0]?.oppgaveNøkkel,
					brukerIdent,
					begrunnelse,
					reserverTil,
				},
			]);
			return;
		}

		flyttReservasjoner(
			reservasjoner.map((v) => ({
				oppgaveNøkkel: v.oppgaveNøkkel,
				begrunnelse: v.begrunnelse,
				brukerIdent,
				reserverTil,
			})),
		);
		return;
	};

	return (
		<Modal
			open={open}
			onClose={closeModal}
			header={{
				heading:
					reservasjoner.length === 1
						? intl.formatMessage({ id: 'FlyttReservasjonerModal.Tittel' })
						: intl.formatMessage({ id: 'FlyttReservasjonerModal.Tittel.Flertall' }, { antall: reservasjoner.length }),
			}}
			className="min-w-[500px]"
		>
			<Modal.Body>
				<Form
					formMethods={formMethods}
					onSubmit={(values) => onSubmit(values.reservertAvIdent, values.begrunnelse, values.reserverTil)}
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
									setValue('reservertAvIdent', saksbehandlere.find((v) => v.brukerIdent === optionValue)?.brukerIdent);
									trigger('reservertAvIdent');
								} else {
									setValue('reservertAvIdent', '');
								}
							}}
							shouldAutocomplete={true}
							onBlurCapture={() => trigger('reservertAvIdent')}
							error={formState.errors.reservertAvIdent?.message}
						/>
					)}
					<div className="mt-8">
						<Datepicker
							label={
								reservasjoner.length === 1
									? intl.formatMessage({ id: 'FlyttReservasjonerModal.FlyttReservasjonText' })
									: intl.formatMessage({ id: 'FlyttReservasjonerModal.FlyttReservasjonText.Flertall' })
							}
							description={intl.formatMessage({ id: 'FlyttReservasjonerModal.FlyttReservasjonText.Description' })}
							name={'reserverTil'}
							validate={[dateAfterOrEqualToToday]}
						/>
					</div>
					{!harFlereReservasjoner(reservasjoner) && (
						<TextAreaField
							className="mt-8"
							label={intl.formatMessage({ id: 'FlyttReservasjonerModal.Begrunn' })}
							name="begrunnelse"
							validate={[required, minLength(3), maxLength(1500), hasValidText]}
						/>
					)}
					<div className="flex flex-row-reverse gap-4 mt-8">
						<Button variant="primary" type="submit">
							{intl.formatMessage({ id: 'FlyttReservasjonerModal.Ok' })}
						</Button>
						<Button variant="secondary" type="reset" onClick={closeModal}>
							{intl.formatMessage({ id: 'FlyttReservasjonerModal.Avbryt' })}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default FlyttReservasjonerModal;
