import React, { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bubbletextBlack from 'images/bubbletext_black.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { Detail } from '@navikt/ds-react';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';

const createTooltip = (oppgaveStatus: OppgaveStatus): ReactNode | undefined => {
	const { flyttetReservasjon } = oppgaveStatus;
	if (!flyttetReservasjon) {
		return undefined;
	}
	const datoOgTid = getDateAndTime(flyttetReservasjon.tidspunkt);
	const textValues = {
		dato: datoOgTid.date,
		tid: datoOgTid.time,
		uid: flyttetReservasjon.uid,
		navn: flyttetReservasjon.navn,
		beskrivelse: flyttetReservasjon.begrunnelse,
		br: <br />,
	};
	return (
		<Normaltekst>
			<FormattedMessage id="OppgaverTabell.OverfortReservasjonTooltip" values={textValues} />
		</Normaltekst>
	);
};

const KommentarMedMerknad = ({ reservasjon }: { reservasjon: Oppgave | ReservasjonV3 }) => {
	const intl = useIntl();
	// V1 reservasjon - deprecated
	if ('status' in reservasjon) {
		if (!reservasjon?.merknad?.fritekst || !reservasjon.status.flyttetReservasjon) {
			return null;
		}
		return (
			<Image
				src={bubbletextBlack}
				srcHover={bubbletextFilledUrl}
				alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
				tooltip={
					<>
						{reservasjon.status.flyttetReservasjon && (
							<>
								{createTooltip(reservasjon.status)}
								<VerticalSpacer sixteenPx />
							</>
						)}
						{!!reservasjon?.merknad?.fritekst && (
							<>
								<Detail>{intl.formatMessage({ id: 'OppgaverTabell.BegrunnelseForMerknad' })}</Detail>
								<VerticalSpacer eightPx />
								<Normaltekst>{reservasjon?.merknad?.fritekst}</Normaltekst>
							</>
						)}
					</>
				}
			/>
		);
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
							<Normaltekst>{`Reservert av ${reservasjon.reservertAv}`}</Normaltekst>
							<Normaltekst>{`${reservasjon.reservertFra} - ${reservasjon.reservertTil}`}</Normaltekst>
							<VerticalSpacer sixteenPx />
							<Normaltekst>{reservasjon.kommentar}</Normaltekst>
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
