import React, { FunctionComponent, ReactNode, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bubbletextUrl from 'images/bubbletext.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { OppgavekøV2MedNavn } from 'types/OppgavekøV2Type';
import { ErrorMessage, Loader } from '@navikt/ds-react';
import { useSaksbehandlerNesteTiV1 } from 'api/queries/saksbehandlerQueries';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { getKoId } from 'saksbehandler/behandlingskoer/utils';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import styles from './oppgaverTabell.css';

interface OwnProps {
	valgtKo: OppgavekøV1 | OppgavekøV2MedNavn;
}

/**
 * OppgaverTabell
 */
export const OppgaverTabell: FunctionComponent<OwnProps> = ({ valgtKo }) => {
	const { data: oppgaverTilBehandling, error, isLoading, isSuccess } = useSaksbehandlerNesteTiV1(getKoId(valgtKo.id));
	const intl = useIntl();

	const createTooltip = useCallback((oppgaveStatus: OppgaveStatus): ReactNode | undefined => {
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
	}, []);

	if (isLoading) {
		<Loader size="2xlarge" className={styles.spinner} />;
	}
	if (error) {
		return (
			<ErrorMessage>
				<FormattedMessage id="OppgaverTabell.KunneIkkeHenteOppgaver" />
			</ErrorMessage>
		);
	}

	if (isSuccess && oppgaverTilBehandling.length === 0) {
		return (
			<>
				<VerticalSpacer eightPx />
				<Normaltekst>
					<FormattedMessage id="OppgaverTabell.IngenOppgaver" />
				</Normaltekst>
			</>
		);
	}

	if (!oppgaverTilBehandling) {
		return null;
	}

	return (
		<div>
			<Table headerTextCodes={getHeaderCodes().filter(Boolean)}>
				{oppgaverTilBehandling?.map((oppgave) => (
					<TableRow key={oppgave.eksternId} model={oppgave} className={styles.oppgavetabell_row}>
						<TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
						<TableColumn>{oppgave.journalpostId || oppgave.saksnummer}</TableColumn>
						<TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
						<TableColumn>
							{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
						</TableColumn>
						<TableColumn>
							{oppgave.status.flyttetReservasjon && (
								<Image
									src={bubbletextUrl}
									srcHover={bubbletextFilledUrl}
									alt={intl.formatMessage({ id: 'OppgaverTabell.OverfortReservasjon' })}
									tooltip={createTooltip(oppgave.status)}
								/>
							)}
						</TableColumn>
					</TableRow>
				))}
			</Table>
		</div>
	);
};

export default OppgaverTabell;
