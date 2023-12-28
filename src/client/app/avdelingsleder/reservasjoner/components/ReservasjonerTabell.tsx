import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import Chevron from 'nav-frontend-chevron';
import { Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Loader, TextField } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import OpphevReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { useAvdelingslederReservasjoner } from 'api/queries/avdelingslederQueries';
import ReservasjonV3, {
	MappedReservasjon,
	mapReservasjonV3Array,
} from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import arrowIcon from '../../../../images/arrow-left-3.svg';
import arrowIconRight from '../../../../images/arrow-right-3.svg';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import styles from './reservasjonerTabell.css';

const headerTextCodes = [
	'ReservasjonerTabell.Navn',
	'ReservasjonerTabell.Saksnr',
	'ReservasjonerTabell.BehandlingType',
	'ReservasjonerTabell.ReservertTil',
	'EMPTY_2',
];

const sorterMedReservertAv = (reservasjonerListe: MappedReservasjon[]) =>
	reservasjonerListe?.sort((reservasjon1, reservasjon2) =>
		reservasjon1.reservertAv.localeCompare(reservasjon2.reservertAv),
	);

const ReservasjonerTabell = () => {
	const [valgtReservasjon, setValgtReservasjon] = useState<MappedReservasjon>();
	const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);
	const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);
	const [reservasjonerSomSkalVises, setReservasjonerSomSkalVises] = useState<MappedReservasjon[]>([]);
	const [finnesSokResultat, setFinnesSokResultat] = useState(true);

	const {
		data: reservasjoner,
		isLoading,
		isSuccess,
	} = useAvdelingslederReservasjoner({
		select: (reservasjonerData: ReservasjonV3[]): MappedReservasjon[] =>
			sorterMedReservertAv(mapReservasjonV3Array(reservasjonerData)),
		onSuccess: (data: MappedReservasjon[]) => {
			setValgtReservasjon(undefined);
			setReservasjonerSomSkalVises(data);
		},
	});

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const velgReservasjon = (res: MappedReservasjon) => {
		if (
			valgtReservasjon === undefined ||
			valgtReservasjon.oppgaveNøkkel.oppgaveEksternId !== res.oppgaveNøkkel.oppgaveEksternId
		) {
			setValgtReservasjon(res);
		} else {
			setValgtReservasjon(undefined);
		}
	};

	const sokEtterReservasjon = (e) => {
		const sokVerdi = e.target.value.toLowerCase();
		const reservasjonerMedMatch = reservasjoner.filter(
			(res) =>
				res.reservertAv.toLowerCase().includes(sokVerdi) ||
				res.saksnummer?.toLowerCase()?.includes(sokVerdi) ||
				res.journalpostId?.toLowerCase()?.includes(sokVerdi),
		);
		if (reservasjonerMedMatch.length > 0) {
			setFinnesSokResultat(true);
			setReservasjonerSomSkalVises(reservasjonerMedMatch);
		} else {
			setFinnesSokResultat(false);
		}
	};
	const debounceFn = useCallback(_.debounce(sokEtterReservasjon, 300), [reservasjoner]);

	return (
		<>
			<div className={styles.titelContainer}>
				<b>
					<FormattedMessage id="ReservasjonerTabell.Reservasjoner" />
					{reservasjoner?.length > 0 && isSuccess && ` (${reservasjoner.length} stk)`}
				</b>
				<div className={styles.sokfelt}>
					<TextField onChange={debounceFn} label="Søk på reservasjon" />
				</div>
			</div>
			<VerticalSpacer sixteenPx />
			{isLoading && <Loader size="2xlarge" className={styles.spinner} />}
			{reservasjoner?.length > 0 && isSuccess && !finnesSokResultat && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="ReservasjonerTabell.IngenMatchandeReservasjoner" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjoner?.length === 0 && isSuccess && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjonerSomSkalVises?.length > 0 && finnesSokResultat && (
				<Table headerTextCodes={headerTextCodes} noHover>
					{reservasjonerSomSkalVises.map((reservasjon) => (
						<React.Fragment
							key={`${reservasjon.oppgaveNøkkel.oppgaveEksternId} ${reservasjon.saksnummer} ${reservasjon.journalpostId}`}
						>
							<TableRow onMouseDown={() => velgReservasjon(reservasjon)} onKeyDown={() => velgReservasjon(reservasjon)}>
								<TableColumn>{reservasjon.reservertAv}</TableColumn>
								<TableColumn>{reservasjon.saksnummer}</TableColumn>
								<TableColumn>
									{getKodeverknavnFraKode(
										reservasjon.behandlingstype.kode,
										kodeverkTyper.BEHANDLING_TYPE,
										alleKodeverk,
									) + (reservasjon ? ' - [B] ' : '')}
								</TableColumn>
								<TableColumn>
									<FormattedMessage
										id="ReservasjonerTabell.ReservertTilFormat"
										values={getDateAndTime(reservasjon.reservertTil)}
									/>
								</TableColumn>
								<TableColumn>
									<Chevron
										type={
											valgtReservasjon &&
											valgtReservasjon.oppgaveNøkkel.oppgaveEksternId === reservasjon.oppgaveNøkkel.oppgaveEksternId
												? 'opp'
												: 'ned'
										}
										className={styles.chevron}
									/>
								</TableColumn>
							</TableRow>
							{valgtReservasjon &&
								valgtReservasjon.oppgaveNøkkel.oppgaveEksternId === reservasjon.oppgaveNøkkel.oppgaveEksternId && (
									<Row className={styles.actionMenu}>
										<Row>
											<div className={styles.menuLine}>
												<Image src={arrowIcon} className={styles.icon} />
												<div
													id="leggTilbake"
													tabIndex={0}
													className={styles.action}
													role="button"
													onClick={() => setShowOpphevReservasjonModal(true)}
													onKeyDown={() => {
														setShowOpphevReservasjonModal(true);
													}}
												>
													<FormattedMessage id="ReservasjonerTabell.LeggTilbake" />
												</div>
											</div>
										</Row>
										<Row>
											<div className={styles.menuLine}>
												<Image src={arrowIconRight} className={styles.icon} />
												<div
													id="flytt"
													tabIndex={0}
													className={styles.action}
													role="button"
													onClick={() => {
														setShowFlyttReservasjonModal(true);
													}}
													onKeyDown={() => {
														setShowFlyttReservasjonModal(true);
													}}
												>
													<FormattedMessage id="ReservasjonerTabell.FlyttReservasjon" />
												</div>
											</div>
										</Row>
									</Row>
								)}
						</React.Fragment>
					))}
				</Table>
			)}
			{showOpphevReservasjonModal && (
				<OpphevReservasjonModal
					oppgaveNøkkel={valgtReservasjon.oppgaveNøkkel}
					showModal={showOpphevReservasjonModal}
					cancel={() => setShowOpphevReservasjonModal(false)}
				/>
			)}
			{showFlyttReservasjonModal && (
				<FlyttReservasjonModal
					oppgaveNøkkel={valgtReservasjon.oppgaveNøkkel}
					oppgaveReservertTil={valgtReservasjon.reservertTil}
					eksisterendeBegrunnelse={valgtReservasjon.kommentar}
					showModal={showFlyttReservasjonModal}
					closeModal={() => setShowFlyttReservasjonModal(false)}
				/>
			)}
		</>
	);
};

export default ReservasjonerTabell;
