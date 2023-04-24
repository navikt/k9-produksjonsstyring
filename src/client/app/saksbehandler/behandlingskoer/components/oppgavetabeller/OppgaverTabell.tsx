import React, { FunctionComponent, ReactNode, useCallback, useEffect } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import bubbletextUrl from 'images/bubbletext.svg';
import bubbletextFilledUrl from 'images/bubbletext_filled.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { Loader } from '@navikt/ds-react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import {
	getHeaderCodes,
	hentIDFraSak,
} from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import styles from './oppgaverTabell.css';

interface OwnProps {
	valgtOppgavekoId: string;
	oppgaverTilBehandling: Oppgave[];
	requestFinished: boolean;
	valgtKo: Oppgaveko;
}

/**
 * OppgaverTabell
 */
export const OppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	valgtOppgavekoId,
	oppgaverTilBehandling,
	requestFinished,
	valgtKo,
}) => {
	const { startRequest: hentOppgaveKo } = useRestApiRunner<Oppgaveko[]>(K9LosApiKeys.OPPGAVEKO);
	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	useEffect(() => {
		hentOppgaveKo();
	}, [valgtOppgavekoId]);

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

	return (
		<div>
			{oppgaverTilBehandling.length === 0 && !requestFinished && <Loader size="2xlarge" className={styles.spinner} />}
			{oppgaverTilBehandling.length === 0 && requestFinished && !valgtKo.skjermet && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="OppgaverTabell.IngenOppgaver" />
					</Normaltekst>
				</>
			)}

			{oppgaverTilBehandling.length === 0 && requestFinished && valgtKo.skjermet && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="OppgaverTabell.IngenTilgang" />
					</Normaltekst>
				</>
			)}

			{oppgaverTilBehandling.length > 0 && requestFinished && (
				<Table headerTextCodes={getHeaderCodes().filter(Boolean)}>
					{oppgaverTilBehandling.map((oppgave) => (
						<TableRow key={oppgave.eksternId} model={oppgave} className={styles.oppgavetabell_row}>
							<TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
							<TableColumn>{hentIDFraSak(oppgave, alleKodeverk)}</TableColumn>
							<TableColumn>
								{getKodeverknavnFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)}
							</TableColumn>
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
			)}
		</div>
	);
};

export default injectIntl(OppgaverTabell);
