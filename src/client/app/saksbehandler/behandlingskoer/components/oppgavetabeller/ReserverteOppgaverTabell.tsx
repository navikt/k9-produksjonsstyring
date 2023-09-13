/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl, useIntl } from 'react-intl';
import classNames from 'classnames';
import menuIconBlackUrl from 'images/ic-menu-18px_black.svg';
import menuIconBlueUrl from 'images/ic-menu-18px_blue.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import { WarningColored } from '@navikt/ds-icons';
import { Loader, Table } from '@navikt/ds-react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import {
	getHeaderCodes,
	hentIDFraSak,
} from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import KommentarMedMerknad from 'saksbehandler/components/KommentarMedMerknad';
import Oppgave from 'saksbehandler/oppgaveTsType';
import DateLabel from 'sharedComponents/DateLabel';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import OppgaveHandlingerMenu from '../menu/OppgaveHandlingerMenu';
import styles from './oppgaverTabell.css';

interface OwnProps {
	apneOppgave: (oppgave: Oppgave) => void;
	reserverteOppgaver: Oppgave[];
	hentReserverteOppgaver: () => void;
	requestFinished: boolean;
	hastesaker?: boolean;
}

const ReserverteOppgaverTabell: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	apneOppgave,
	reserverteOppgaver,
	hentReserverteOppgaver,
	requestFinished,
	hastesaker,
}) => {
	const intl = useIntl();

	const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
	const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(
		K9LosApiKeys.FORLENG_OPPGAVERESERVASJON,
	);

	const initialRender = useRef(true);

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
		}
	});

	const forlengOppgaveReservasjonFn = useCallback(
		(oppgaveId: string): Promise<any> => forlengOppgavereservasjon({ oppgaveId }).then(() => hentReserverteOppgaver()),
		[],
	);

	const ref = useRef({});

	const goToFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave);
		apneOppgave(oppgave);
	};

	const toggleMenu = (oppgaveValgt: Oppgave) => {
		if (oppgaveValgt) {
			setValgtOppgaveId(oppgaveValgt.eksternId);
		} else {
			setValgtOppgaveId(undefined);
		}
	};
	const valgtOppgave = reserverteOppgaver.find((o) => o.eksternId === valgtOppgaveId);
	return (
		<div>
			{reserverteOppgaver.length === 0 && !requestFinished && <Loader size="2xlarge" className={styles.spinner} />}

			{reserverteOppgaver.length === 0 && requestFinished && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						{!hastesaker ? (
							<FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
						) : (
							<FormattedMessage id="OppgaverTabell.IngenReserverteHastesaker" />
						)}
					</Normaltekst>
				</>
			)}

			{reserverteOppgaver.length > 0 && requestFinished && (
				<Table>
					<Table.Header>
						<Table.Row>
							{getHeaderCodes(true, hastesaker)
								.filter(Boolean)
								.map((header) => (
									<Table.HeaderCell key={header}>
										{!header.includes('EMPTY') ? <FormattedMessage id={header} /> : ''}
									</Table.HeaderCell>
								))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reserverteOppgaver.map((oppgave) => (
							<Table.Row
								key={oppgave.eksternId}
								className={classNames(styles.isUnderBehandling, { [styles.hastesak]: hastesaker })}
								onKeyDown={() => goToFagsak(oppgave)}
							>
								{hastesaker && (
									<Table.DataCell
										onClick={() => goToFagsak(oppgave)}
										className={`${styles.hastesakTd} hover:cursor-pointer`}
									>
										<WarningColored className={styles.hastesakIkon} />
									</Table.DataCell>
								)}
								<Table.DataCell
									onClick={() => goToFagsak(oppgave)}
									className={`${hastesaker ? '' : styles.soekerPadding} hover:cursor-pointer`}
								>
									{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}
								</Table.DataCell>
								<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
									{hentIDFraSak(oppgave, alleKodeverk)}
								</Table.DataCell>
								<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
									{getKodeverknavnFraKode(oppgave.behandlingstype, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)}
								</Table.DataCell>
								<Table.DataCell onClick={() => goToFagsak(oppgave)} className="hover:cursor-pointer">
									{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
								</Table.DataCell>
								<Table.DataCell
									onClick={() => goToFagsak(oppgave)}
									className={`${styles.reservertTil} hover:cursor-pointer`}
								>
									<FormattedMessage
										id="OppgaveHandlingerMenu.ReservertTil"
										values={{
											...getDateAndTime(oppgave.status.reservertTilTidspunkt),
											// eslint-disable-next-line react/no-unstable-nested-components
											b: (...chunks) => <b>{chunks}</b>,
										}}
									/>
								</Table.DataCell>
								<Table.DataCell>
									<KommentarMedMerknad oppgave={oppgave} />
								</Table.DataCell>
								<Table.DataCell className={styles.menuElement}>
									<div
										ref={(el) => {
											ref.current = { ...ref.current, [oppgave.eksternId]: el };
										}}
										onKeyDown={(event) => event.stopPropagation()}
									>
										{valgtOppgaveId === oppgave.eksternId && (
											<OppgaveHandlingerMenu
												imageNode={ref.current[valgtOppgaveId]}
												toggleMenu={toggleMenu}
												oppgave={valgtOppgave}
												forlengOppgaveReservasjon={forlengOppgaveReservasjonFn}
												hentReserverteOppgaver={hentReserverteOppgaver}
											/>
										)}
										<Image
											className={styles.image}
											src={menuIconBlackUrl}
											srcHover={menuIconBlueUrl}
											alt={intl.formatMessage({ id: 'OppgaverTabell.OppgaveHandlinger' })}
											onMouseDown={() => toggleMenu(oppgave)}
											onKeyDown={() => toggleMenu(oppgave)}
										/>
									</div>
								</Table.DataCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
		</div>
	);
};

export default injectIntl(ReserverteOppgaverTabell);
