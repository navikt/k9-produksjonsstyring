import React, { FunctionComponent } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { TextAreaField } from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';
import { hasValidText, maxLength, minLength, required } from 'utils/validation/validators';
import { useAvdelingslederOpphevReservasjoner } from 'api/queries/avdelingslederQueries';
import * as styles from './opphevReservasjonModal.css';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

type OwnProps = Readonly<{
	open: boolean;
	oppgaveNøkler: Array<OppgaveNøkkel>;
	closeModal: () => void;
}>;

/**
 * OpphevReservasjonBolkModal
 *
 * Presentasjonskomponent. Modal som lar en begrunne hvorfor en sak skal frigjøres.
 */
export const OpphevReservasjonBolkModal: FunctionComponent<OwnProps> = ({ open, closeModal, oppgaveNøkler }) => {
	const { mutate: opphevReservasjoner } = useAvdelingslederOpphevReservasjoner();
	const intl = useIntl();

	return (
		<Modal
			className={styles.modal}
			isOpen={open}
			closeButton={false}
			contentLabel={intl.formatMessage({ id: 'OpphevReservasjonBolkModal.Tittel' }, { antall: oppgaveNøkler.length })}
			onRequestClose={closeModal}
		>
			<Form
				onSubmit={({ begrunnelse }) => opphevReservasjoner({ oppgaveNøkler, begrunnelse }, { onSuccess: closeModal })}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit}>
						<Element>
							<FormattedMessage id="OpphevReservasjonBolkModal.Tittel" values={{ antall: oppgaveNøkler.length }} />
						</Element>
						<VerticalSpacer eightPx />
						<TextAreaField
							name="begrunnelse"
							label={intl.formatMessage({ id: 'OpphevReservasjonBolkModal.Begrunnelse' })}
							validate={[required, maxLength1500, minLength3, hasValidText]}
							maxLength={1500}
						/>
						<Hovedknapp className={styles.submitButton} mini htmlType="submit" autoFocus>
							{intl.formatMessage({ id: 'OpphevReservasjonBolkModal.Ok' })}
						</Hovedknapp>
						<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeModal}>
							{intl.formatMessage({ id: 'OpphevReservasjonBolkModal.Avbryt' })}
						</Knapp>
					</form>
				)}
			/>
		</Modal>
	);
};

export default OpphevReservasjonBolkModal;
