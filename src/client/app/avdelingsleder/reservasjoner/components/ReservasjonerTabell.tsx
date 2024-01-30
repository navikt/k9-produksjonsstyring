import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Normaltekst } from 'nav-frontend-typografi';
import { Button, Loader, Table, TextField } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import FlyttReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonModal';
import OpphevReservasjonModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonModal';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { useAvdelingslederReservasjoner } from 'api/queries/avdelingslederQueries';
import ReservasjonV3, {
	MappedReservasjon,
	mapReservasjonV3Array,
} from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import styles from './reservasjonerTabell.css';

const sorterMedReservertAv = (reservasjonerListe: MappedReservasjon[]) =>
	reservasjonerListe?.sort((reservasjon1, reservasjon2) =>
		reservasjon1.reservertAv.localeCompare(reservasjon2.reservertAv),
	);

const ReservasjonerTabell = () => {
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
			setReservasjonerSomSkalVises(data);
		},
	});

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

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
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell scope="col" />
							<Table.HeaderCell scope="col">Navn</Table.HeaderCell>
							<Table.HeaderCell scope="col">Id</Table.HeaderCell>
							<Table.HeaderCell scope="col">Type</Table.HeaderCell>
							<Table.HeaderCell scope="col">Reservert til</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjonerSomSkalVises.map((reservasjon) => (
							<Table.ExpandableRow
								key={`${reservasjon.oppgaveNøkkel.oppgaveEksternId} ${reservasjon.saksnummer} ${reservasjon.journalpostId}`}
								content={
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
											<OpphevReservasjonModal
												oppgaveNøkkel={reservasjon.oppgaveNøkkel}
												showModal={showOpphevReservasjonModal}
												cancel={() => setShowOpphevReservasjonModal(false)}
											/>
										)}
										{showFlyttReservasjonModal && (
											<FlyttReservasjonModal
												oppgaveNøkkel={reservasjon.oppgaveNøkkel}
												oppgaveReservertTil={reservasjon.reservertTil}
												eksisterendeBegrunnelse={reservasjon.kommentar}
												showModal={showFlyttReservasjonModal}
												closeModal={() => setShowFlyttReservasjonModal(false)}
											/>
										)}
									</>
								}
							>
								<Table.DataCell>{reservasjon.reservertAv}</Table.DataCell>
								<Table.DataCell>{reservasjon.saksnummer || reservasjon.journalpostId}</Table.DataCell>
								<Table.DataCell>
									{getKodeverknavnFraKode(
										reservasjon.behandlingstype.kode,
										kodeverkTyper.BEHANDLING_TYPE,
										alleKodeverk,
									) + (reservasjon ? ' - [B] ' : '')}
								</Table.DataCell>
								<Table.DataCell>
									<FormattedMessage
										id="ReservasjonerTabell.ReservertTilFormat"
										values={getDateAndTime(reservasjon.reservertTil)}
									/>
								</Table.DataCell>
							</Table.ExpandableRow>
						))}
					</Table.Body>
				</Table>
			)}
		</>
	);
};

export default ReservasjonerTabell;
