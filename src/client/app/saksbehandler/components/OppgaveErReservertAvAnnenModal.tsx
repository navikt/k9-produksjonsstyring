import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Modal, Button, BodyLong } from '@navikt/ds-react';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { getDateAndTime } from 'utils/dateUtils';

type OwnProps = Readonly<{
	lukkErReservertModalOgOpneOppgave: (oppgave: Oppgave) => void;
	oppgave: Oppgave;
	oppgaveStatus: OppgaveStatus;
	lukkModal: () => void;
}>;

const getClickEvent = (lukkErReservertModalOgOpneOppgave, oppgave) => () => lukkErReservertModalOgOpneOppgave(oppgave);

/**
 * OppgaveErReservertAvAnnenModal
 *
 * Presentasjonskomponent. Modal som vises når en åpner oppgave som er reservert av en annen saksbehandler
 */
export const OppgaveErReservertAvAnnenModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	lukkErReservertModalOgOpneOppgave,
	oppgave,
	oppgaveStatus,
	lukkModal,
}) => (
	<Modal
		open
		onClose={getClickEvent(lukkErReservertModalOgOpneOppgave, oppgave)}
		header={{
			heading: intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.ReservertAvEnkel' }),
			closeButton: false,
		}}
	>
		<Modal.Body>
			<BodyLong>
				<FormattedMessage
					id="OppgaveErReservertAvAnnenModal.ReservertAv"
					values={{
						saksbehandlerid: oppgaveStatus.reservertAv,
						saksbehandlernavn:
							typeof oppgaveStatus.reservertAvNavn !== 'undefined' ? oppgaveStatus.reservertAvNavn : '',
						...getDateAndTime(oppgaveStatus.reservertTilTidspunkt),
					}}
				/>
			</BodyLong>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="primary" onClick={getClickEvent(lukkErReservertModalOgOpneOppgave, oppgave)}>
				{intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.Ok' })}
			</Button>
			<Button variant="secondary" onClick={() => lukkModal()} autoFocus>
				{intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' })}
			</Button>
		</Modal.Footer>
	</Modal>
);

export default injectIntl(OppgaveErReservertAvAnnenModal);
