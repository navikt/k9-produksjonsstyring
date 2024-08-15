import React, { useRef, useState } from 'react';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Popover } from '@navikt/ds-react';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';

const KommentarMedMerknad = ({ reservasjon }: { reservasjon: ReservasjonV3 }) => {
	const ref = useRef<HTMLButtonElement>(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const { date, time } = getDateAndTime(reservasjon.reservertFra);

	if (!reservasjon || !reservasjon.kommentar) {
		return null;
	}
	return (
		<>
			<Button
				icon={<ChatElipsisIcon />}
				variant="tertiary"
				className="p-0"
				ref={ref}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
			/>
			<Popover open={showTooltip} onClose={() => setShowTooltip(false)} anchorEl={ref.current}>
				<Popover.Content>
					<>
						<BodyShort size="small">{`Reservasjon endret av ${reservasjon.endretAvNavn || 'Ukjent'}`}</BodyShort>
						<BodyShort size="small">{`${date} ${time}`}</BodyShort>
						<VerticalSpacer sixteenPx />
						<BodyShort size="small">{reservasjon.kommentar}</BodyShort>
					</>
				</Popover.Content>
			</Popover>
		</>
	);
};

export default KommentarMedMerknad;
