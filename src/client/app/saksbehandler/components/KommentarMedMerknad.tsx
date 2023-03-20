import React, { ReactNode, useCallback } from 'react';
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

const KommentarMedMerknad = ({ oppgave }: { oppgave: Oppgave }) => {
	const intl = useIntl();
	if (!(!!oppgave?.merknad?.fritekst || oppgave.status.flyttetReservasjon)) {
		return null;
	}
	return (
		<Image
			src={bubbletextBlack}
			srcHover={bubbletextFilledUrl}
			alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
			tooltip={
				<>
					{oppgave.status.flyttetReservasjon && (
						<>
							{createTooltip(oppgave.status)}
							<VerticalSpacer sixteenPx />
						</>
					)}
					{!!oppgave?.merknad?.fritekst && (
						<>
							<Detail>{intl.formatMessage({ id: 'OppgaverTabell.BegrunnelseForMerknad' })}</Detail>
							<VerticalSpacer eightPx />
							<Normaltekst>{oppgave?.merknad?.fritekst}</Normaltekst>
						</>
					)}
				</>
			}
		/>
	);
};

export default KommentarMedMerknad;
