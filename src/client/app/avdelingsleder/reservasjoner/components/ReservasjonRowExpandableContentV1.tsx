import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import OpphevReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import Reservasjon from '../reservasjonTsType';

const ReservasjonRowExpandableContent = ({ reservasjon }: { reservasjon: Reservasjon }) => {
	const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);
	const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);
	return (
		<>
			<div className="flex gap-4">
				<Button onClick={() => setShowOpphevReservasjonModal(true)} variant="secondary" size="small">
					<FormattedMessage id="ReservasjonerTabell.LeggTilbake" />
				</Button>
				<Button
					onClick={() => {
						setShowFlyttReservasjonModal(true);
					}}
					variant="secondary"
					size="small"
				>
					<FormattedMessage id="ReservasjonerTabell.FlyttReservasjon" />
				</Button>
			</div>
			{showOpphevReservasjonModal && (
				<OpphevReservasjonModal
					oppgaveNøkkel={[reservasjon.oppgavenøkkel]}
					open={showOpphevReservasjonModal}
					closeModal={() => setShowOpphevReservasjonModal(false)}
				/>
			)}
			{showFlyttReservasjonModal && (
				<FlyttReservasjonModal
					oppgaveNøkkel={reservasjon.oppgavenøkkel}
					reservertAvIdent={reservasjon.reservertAvIdent}
					oppgaveReservertTil={reservasjon.reservertTilTidspunkt}
					eksisterendeBegrunnelse={reservasjon?.kommentar}
					showModal={showFlyttReservasjonModal}
					closeModal={() => setShowFlyttReservasjonModal(false)}
				/>
			)}
		</>
	);
};

export default ReservasjonRowExpandableContent;
