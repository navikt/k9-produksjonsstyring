import ModalButton from 'sharedComponents/ModalButton';
import { Button } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import OpphevReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import FlyttReservasjonBolkModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonBolkModal';
import React from 'react';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

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
				<OpphevReservasjonModal
					oppgaveNøkkel={valgteReservasjoner.map((r) => r.oppgaveNøkkel)}
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
				<FlyttReservasjonBolkModal valgteReservasjoner={valgteReservasjoner} open={open} closeModal={closeModal} />
			)}
		/>
	</div>
);

export default ReservasjonerBolkButtons;
