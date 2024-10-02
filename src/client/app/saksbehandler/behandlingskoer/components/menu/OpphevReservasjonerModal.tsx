import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { useOpphevReservasjoner } from 'api/queries/saksbehandlerQueries';
import { Button, Modal } from '@navikt/ds-react';

type OwnProps = Readonly<{
	open: boolean;
	oppgaveNøkler: Array<OppgaveNøkkel>;
	closeModal: () => void;
}>;

export const OpphevReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, oppgaveNøkler }) => {
	const { mutate: opphevReservasjoner } = useOpphevReservasjoner();
	const intl = useIntl();

	const antall = oppgaveNøkler.length;

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
							oppgaveNøkler.map((o) => ({
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

export default OpphevReservasjonerModal;
