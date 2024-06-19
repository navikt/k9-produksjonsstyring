import ModalButton from 'sharedComponents/ModalButton';
import { Button } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import React from 'react';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';

interface Props {
	valgteReservasjoner: Array<{ oppgaveNøkkel: OppgaveNøkkel; begrunnelse: string }>;
}

const ReservasjonerBolkButtons = ({ valgteReservasjoner }: Props) => (
	<div className="flex gap-4">
		<ModalButton
			renderButton={({ openModal }) => (
				<Button onClick={openModal} variant="secondary" size="small">
					<FormattedMessage id="ReservasjonerTabell.LeggTilbakeBolk" values={{ antall: valgteReservasjoner.length }} />
				</Button>
			)}
			renderModal={({ closeModal, open }) => (
				<OpphevReservasjonerModal
					oppgaveNøkler={valgteReservasjoner.map((r) => r.oppgaveNøkkel)}
					open={open}
					closeModal={closeModal}
				/>
			)}
		/>
		<ModalButton
			renderButton={({ openModal }) => (
				<Button onClick={openModal} variant="secondary" size="small">
					<FormattedMessage
						id="ReservasjonerTabell.FlyttReservasjonBolk"
						values={{ antall: valgteReservasjoner.length }}
					/>
				</Button>
			)}
			renderModal={({ closeModal, open }) => (
				<FlyttReservasjonerModal reservasjoner={valgteReservasjoner} open={open} closeModal={closeModal} />
			)}
		/>
	</div>
);

export default ReservasjonerBolkButtons;
