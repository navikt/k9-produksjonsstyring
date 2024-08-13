import React from 'react';
import { useIntl } from 'react-intl';
import bubbletextBlack from 'images/bubbletext_black.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';
import { BodyShort } from '@navikt/ds-react';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';

const KommentarMedMerknad = ({ reservasjon }: { reservasjon: ReservasjonV3 }) => {
	const intl = useIntl();
	const { date, time } = getDateAndTime(reservasjon.reservertFra);

	if (!reservasjon.kommentar) {
		return null;
	}
	return (
		<Image
			src={bubbletextBlack}
			srcHover={bubbletextFilledUrl}
			alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
			tooltip={
				<>
					{reservasjon && (
						<>
							<BodyShort size="small">{`Reservasjon endret av ${reservasjon.endretAvNavn || 'Ukjent'}`}</BodyShort>
							<BodyShort size="small">{`${date} ${time}`}</BodyShort>
							<VerticalSpacer sixteenPx />
							<BodyShort size="small">{reservasjon.kommentar}</BodyShort>
						</>
					)}

					{/* TODO: Her må vi legge inn visning av merknad når det er støtte for det 				
	{!!reservasjon?.kommentar && (
						<>
							<Detail>{intl.formatMessage({ id: 'OppgaverTabell.BegrunnelseForMerknad' })}</Detail>
							<VerticalSpacer eightPx />
							<Normaltekst>{reservasjon.kommentar}</Normaltekst>
						</>
					)} */}
				</>
			}
		/>
	);
};

export default KommentarMedMerknad;
