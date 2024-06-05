import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { DatepickerField, InputField, TextAreaField } from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import {
	dateAfterOrEqual,
	hasValidDate,
	hasValidText,
	maxLength,
	minLength,
	required,
} from 'utils/validation/validators';
import { useAvdelingslederEndreReservasjoner } from 'api/queries/avdelingslederQueries';
import { Saksbehandler } from '../../saksbehandlerTsType';
import * as styles from './flyttReservasjonModal.css';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
	open: boolean;
	closeModal: () => void;
	valgteReservasjoner: Array<{ oppgaveNøkkel: OppgaveNøkkel; begrunnelse: string }>;
}

/**
 * FlyttReservasjonBolkModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonBolkModal: FunctionComponent<OwnProps> = ({ open, closeModal, valgteReservasjoner }) => {
	const {
		startRequest,
		state,
		data: saksbehandler,
		resetRequestData,
	} = useRestApiRunner<Saksbehandler>(K9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK);
	const { mutate: flyttReservasjoner } = useAvdelingslederEndreReservasjoner();
	const intl = useIntl();
	const finnSaksbehandler = useCallback((brukerIdent: string) => startRequest({ brukerIdent }), []);

	const formatText = () => {
		if (state === RestApiState.SUCCESS && !saksbehandler) {
			return intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesIkke' });
		}
		return saksbehandler.navn || saksbehandler.brukerIdent || '';
	};

	useEffect(
		() => () => {
			resetRequestData();
		},
		[],
	);

	return (
		<Modal
			className={styles.modal}
			isOpen={open}
			closeButton={false}
			contentLabel={intl.formatMessage(
				{ id: 'FlyttReservasjonBolkModal.Tittel' },
				{ antall: valgteReservasjoner.length },
			)}
			onRequestClose={closeModal}
		>
			<Form
				onSubmit={(values) => finnSaksbehandler(values.brukerIdent)}
				initialValues={{ brukerIdent: saksbehandler?.navn || saksbehandler?.brukerIdent || '' }}
				render={({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<Element>
							<FormattedMessage id="FlyttReservasjonBolkModal.Tittel" values={{ antall: valgteReservasjoner.length }} />
						</Element>
						<VerticalSpacer eightPx />
						<FlexContainer>
							<FlexRow>
								<FlexColumn>
									<InputField
										name="brukerIdent"
										label={intl.formatMessage({ id: 'FlyttReservasjonBolkModal.Brukerident' })}
										bredde="S"
										validate={[required]}
										autoFocus
									/>
								</FlexColumn>
								<FlexColumn>
									<Hovedknapp
										mini
										htmlType="submit"
										className={styles.button}
										spinner={state === RestApiState.LOADING}
										disabled={!values.brukerIdent || state === RestApiState.LOADING}
									>
										<FormattedMessage id="FlyttReservasjonBolkModal.Sok" />
									</Hovedknapp>
								</FlexColumn>
							</FlexRow>
						</FlexContainer>
						{state === RestApiState.SUCCESS && (
							<>
								<Normaltekst>{formatText()}</Normaltekst>
								<VerticalSpacer sixteenPx />
							</>
						)}
					</form>
				)}
			/>
			<Form
				onSubmit={({ reservertTilDato }) =>
					flyttReservasjoner(
						valgteReservasjoner.map((r) => ({
							oppgaveNøkkel: r.oppgaveNøkkel,
							begrunnelse: r.begrunnelse,
							reservertTilDato,
							brukerIdent: saksbehandler?.brukerIdent ?? '',
						})),

						{ onSuccess: closeModal },
					)
				}
				render={({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<VerticalSpacer sixteenPx />
						<div>
							<DatepickerField
								name="reserverTil"
								onBlurValidation
								validate={[hasValidDate, dateAfterOrEqual(new Date())]}
								label={intl.formatMessage({ id: 'FlyttReservasjonBolkModal.FlyttReservasjonText' })}
								alwaysShowCalendar
								disabledDays={{ before: new Date() }}
							/>
						</div>
						<VerticalSpacer sixteenPx />
						<Hovedknapp className={styles.submitButton} mini htmlType="submit" disabled={!saksbehandler}>
							{intl.formatMessage({ id: 'FlyttReservasjonBolkModal.Ok' })}
						</Hovedknapp>
						<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeModal}>
							{intl.formatMessage({ id: 'FlyttReservasjonBolkModal.Avbryt' })}
						</Knapp>
					</form>
				)}
			/>
		</Modal>
	);
};

export default FlyttReservasjonBolkModal;
