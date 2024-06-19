import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { MappedReservasjon } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';

const ReservasjonRowExpandableContent = ({ reservasjon }: { reservasjon: MappedReservasjon }) => {
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
					oppgaveNøkler={[reservasjon.oppgaveNøkkel]}
					open={showOpphevReservasjonModal}
					closeModal={() => setShowOpphevReservasjonModal(false)}
				/>
			)}
			{showFlyttReservasjonModal && (
				<FlyttReservasjonerModal
					reservasjoner={[
						{
							oppgaveNøkkel: reservasjon.oppgaveNøkkel,
							begrunnelse: reservasjon.kommentar,
							reserverTil: reservasjon.reservertTil,
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
