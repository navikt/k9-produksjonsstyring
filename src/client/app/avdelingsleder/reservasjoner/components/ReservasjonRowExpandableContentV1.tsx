import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
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
				<OpphevReservasjonerModal
					oppgaveNøkler={[reservasjon.oppgavenøkkel]}
					open={showOpphevReservasjonModal}
					closeModal={() => setShowOpphevReservasjonModal(false)}
				/>
			)}
			{showFlyttReservasjonModal && (
				<FlyttReservasjonerModal
					reservasjoner={[
						{
							oppgaveNøkkel: reservasjon.oppgavenøkkel,
							begrunnelse: reservasjon.kommentar,
							reservertTil: reservasjon.reservertTilTidspunkt,
							reservertAvIdent: reservasjon.reservertAvIdent,
						},
					]}
					open={showFlyttReservasjonModal}
					closeModal={() => setShowFlyttReservasjonModal(false)}
				/>
			)}
		</>
	);
};

export default ReservasjonRowExpandableContent;
