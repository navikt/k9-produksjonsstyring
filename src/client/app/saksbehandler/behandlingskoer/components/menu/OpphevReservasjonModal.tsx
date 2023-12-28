import React, { FunctionComponent, useCallback } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { captureMessage } from '@sentry/browser';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { TextAreaField } from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';
import { hasValidText, maxLength, minLength, required } from 'utils/validation/validators';
import styles from './opphevReservasjonModal.css';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

type OwnProps = Readonly<{
	showModal: boolean;
	oppgaveNøkkel: OppgaveNøkkel;
	cancel: () => void;
}>;

/**
 * OpphevReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en begrunne hvorfor en sak skal frigjøres.
 */
export const OpphevReservasjonModal: FunctionComponent<OwnProps> = ({ showModal, cancel, oppgaveNøkkel }) => {
	const { startRequest: opphevOppgavereservasjon } = useRestApiRunner(K9LosApiKeys.OPPHEV_OPPGAVERESERVASJON);
	const intl = useIntl();
	const queryClient = useQueryClient();

	const opphevReservasjonFn = useCallback(
		(begrunnelse: string) =>
			opphevOppgavereservasjon({ oppgaveNøkkel, begrunnelse }).then(() => {
				captureMessage(
					`Legg tilbake: ${oppgaveNøkkel.oppgaveEksternId} - Tidspunkt: ${new Date().toLocaleString('no-NO', {
						timeZone: 'Europe/Oslo',
					})}`,
				);
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				setTimeout(() => {}, 1000);
				queryClient.invalidateQueries([apiPaths.saksbehandlerReservasjoner]);
				queryClient.invalidateQueries([apiPaths.avdelinglederReservasjoner]);
				cancel();
			}),
		[JSON.stringify(oppgaveNøkkel)],
	);

	return (
		<Modal
			className={styles.modal}
			isOpen={showModal}
			closeButton={false}
			contentLabel={intl.formatMessage({ id: 'OpphevReservasjonModal.Begrunnelse' })}
			onRequestClose={cancel}
		>
			<Form
				onSubmit={(values) => opphevReservasjonFn(values.begrunnelse)}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<Undertittel>
							<FormattedMessage id="OpphevReservasjonModal.Begrunnelse" />
						</Undertittel>
						<TextAreaField
							name="begrunnelse"
							label={intl.formatMessage({ id: 'OpphevReservasjonModal.Hjelpetekst' })}
							validate={[required, maxLength1500, minLength3, hasValidText]}
							maxLength={1500}
						/>
						<Hovedknapp className={styles.submitButton} mini htmlType="submit" autoFocus>
							{intl.formatMessage({ id: 'OpphevReservasjonModal.Ok' })}
						</Hovedknapp>
						<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={cancel}>
							{intl.formatMessage({ id: 'OpphevReservasjonModal.Avbryt' })}
						</Knapp>
					</form>
				)}
			/>
		</Modal>
	);
};

export default OpphevReservasjonModal;
