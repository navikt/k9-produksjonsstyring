import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { useOpphevReservasjoner } from 'api/queries/avdelingslederQueries';
import { Button, Modal } from '@navikt/ds-react';

type OwnProps = Readonly<{
	open: boolean;
	oppgaveNøkkel: Array<OppgaveNøkkel>;
	closeModal: () => void;
}>;

export const OpphevReservasjonModal: FunctionComponent<OwnProps> = ({ open, closeModal, oppgaveNøkkel }) => {
	const { mutate: opphevReservasjoner } = useOpphevReservasjoner();
	const intl = useIntl();

	const antall = oppgaveNøkkel.length;

	return (
		<Modal
			open={open}
			header={{
				heading: intl.formatMessage({ id: 'OpphevReservasjonModal.Tittel' }),
			}}
			onClose={closeModal}
		>
			<Modal.Body>
				{antall > 1 ? (
					<FormattedMessage id="OpphevReservasjonModal.TekstFlertall" values={{ antall }} />
				) : (
					<FormattedMessage id="OpphevReservasjonModal.TekstEntall" />
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() =>
						opphevReservasjoner(
							oppgaveNøkkel.map((o) => ({
								oppgaveNøkkel: o,
							})),
							{ onSuccess: closeModal },
						)
					}
				>
					{intl.formatMessage({ id: 'OpphevReservasjonModal.Ok' })}
				</Button>
				<Button variant="secondary" type="button" onClick={closeModal}>
					{intl.formatMessage({ id: 'OpphevReservasjonModal.Avbryt' })}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpphevReservasjonModal;
