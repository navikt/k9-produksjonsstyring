import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Normaltekst } from 'nav-frontend-typografi';
import { Button, Checkbox, Loader, SortState, Table, TextField } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { useAvdelingslederReservasjoner } from 'api/queries/avdelingslederQueries';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import ReservasjonerBolkButtons from 'avdelingsleder/reservasjoner/components/ReservasjonerBolkButtons';
import ModalButton from 'sharedComponents/ModalButton';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import { ArrowUndoIcon, PencilIcon } from '@navikt/aksel-icons';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import * as styles from './reservasjonerTabell.css';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import Reservasjon from '../reservasjonTsType';

type ReservasjonTableData = {
	reservasjon: Reservasjon;
	id: string;
	navn: string;
	type: string;
	reservertTil: string;
};

// Snevrer inn typesettingen av vanlig SortState, slik at kun felter som finnes i tabellen kan sorteres på
type ReservasjonTableDataSortState = SortState & { orderBy: keyof ReservasjonTableData };

const ReservasjonerTabell = () => {
	const [reservasjonerSomSkalVises, setReservasjonerSomSkalVises] = useState<ReservasjonTableData[]>([]);
	const [finnesSokResultat, setFinnesSokResultat] = useState(true);
	const [valgteReservasjoner, setValgteReservasjoner] = useState<
		{ oppgaveNøkkel: OppgaveNøkkel; begrunnelse: string }[]
	>([]);
	const [sort, setSort] = useState<ReservasjonTableDataSortState>({ orderBy: 'navn', direction: 'ascending' });

	const comparator = (a: ReservasjonTableData, b: ReservasjonTableData, orderBy: keyof ReservasjonTableData) => {
		switch (orderBy) {
			case 'reservasjon':
				// Brukes ikke til sortering
				return 0;
			case 'reservertTil':
				// Kan ikke bruke DD.MM.YYYY til å sortere på, må bruke YYYY-MM-DD
				return a.reservasjon.reservertTilTidspunkt.localeCompare(b.reservasjon.reservertTilTidspunkt);
			default:
				return a[orderBy].localeCompare(b[orderBy]);
		}
	};

	const sorter = (reservasjonerListe: ReservasjonTableData[], newSort: ReservasjonTableDataSortState) => reservasjonerListe?.sort((a, b) => {
			if (newSort) {
				return newSort.direction === 'ascending'
					? comparator(b, a, newSort.orderBy)
					: comparator(a, b, newSort.orderBy);
			}
			return 1;
		});

	const handleSort = (sortKey: keyof ReservasjonTableData) => {
		const newSort: ReservasjonTableDataSortState =
			sort && sortKey === sort.orderBy && sort.direction === 'descending'
				? undefined
				: {
						orderBy: sortKey,
						direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
					};
		setSort(newSort);
		setReservasjonerSomSkalVises(sorter(reservasjonerSomSkalVises, newSort));
	};

	const {
		data: reservasjoner,
		isLoading,
		isSuccess,
	} = useAvdelingslederReservasjoner({
		onSuccess: (data: Reservasjon[]) => {
			setReservasjonerSomSkalVises(sorter(data.map(mapTilTableData), sort));
			setValgteReservasjoner([]);
		},
	});

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const mapTilTableData = (reservasjon: Reservasjon): ReservasjonTableData => ({
		reservasjon,
		navn: reservasjon.reservertAvNavn || reservasjon.reservertAvEpost,
		id: reservasjon.saksnummer || reservasjon.journalpostId,
		type:
			getKodeverknavnFraKode(reservasjon.behandlingType?.kode, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) +
			(reservasjon.tilBeslutter ? ' - [B] ' : ''),
		reservertTil: getDateAndTime(reservasjon.reservertTilTidspunkt).date,
	});

	const sokEtterReservasjon = (e: any) => {
		const sokVerdi = e.target.value.toLowerCase();
		const reservasjonerMedMatch = reservasjoner.filter(
			(res) =>
				res.reservertAvEpost.toLowerCase().includes(sokVerdi) ||
				res.saksnummer?.toLowerCase()?.includes(sokVerdi) ||
				res.journalpostId?.toLowerCase()?.includes(sokVerdi),
		);
		if (reservasjonerMedMatch.length > 0) {
			setFinnesSokResultat(true);
			setReservasjonerSomSkalVises(reservasjonerMedMatch.map(mapTilTableData));
		} else {
			setFinnesSokResultat(false);
		}
	};
	const debounceFn = useCallback(_.debounce(sokEtterReservasjon, 300), [reservasjoner]);

	return (
		<>
			<div className={styles.titelContainer}>
				<div className="flex flex-col justify-between">
					<b>
						<FormattedMessage id="ReservasjonerTabell.Reservasjoner" />
						{reservasjoner?.length > 0 && isSuccess && ` (${reservasjoner.length} stk)`}
					</b>
					{/* Hvis mer enn 50 antas litt scrolling, så det kan være kjekt å ha knappene på toppen i tillegg til i bunn */}
					{valgteReservasjoner.length > 50 && <ReservasjonerBolkButtons valgteReservasjoner={valgteReservasjoner} />}
				</div>
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
				<Table sort={sort} onSortChange={handleSort}>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader scope="col">
								<Checkbox
									checked={valgteReservasjoner.length === reservasjonerSomSkalVises.length}
									indeterminate={
										valgteReservasjoner.length > 0 && valgteReservasjoner.length !== reservasjonerSomSkalVises.length
									}
									onChange={() => {
										if (valgteReservasjoner.length > 0) {
											setValgteReservasjoner([]);
										} else {
											setValgteReservasjoner(
												reservasjonerSomSkalVises.map((r) => ({
													oppgaveNøkkel: r.reservasjon.oppgavenøkkel,
													begrunnelse: r.reservasjon.kommentar,
												})),
											);
										}
									}}
									hideLabel
								>
									Velg alle rader
								</Checkbox>
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="navn">
								Navn
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="id">
								Id
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="type">
								Type
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" sortable sortKey="reservertTil">
								Reservert til
							</Table.ColumnHeader>
							<Table.ColumnHeader scope="col" />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjonerSomSkalVises.map(({ reservasjon, id, navn, type, reservertTil }) => (
							<Table.Row key={`${reservasjon.oppgavenøkkel}`}>
								<Table.DataCell>
									<Checkbox
										hideLabel
										checked={
											valgteReservasjoner.filter(({ oppgaveNøkkel }) => oppgaveNøkkel == reservasjon.oppgavenøkkel)
												.length > 0
										}
										onClick={(event) => {
											if (event.currentTarget.checked) {
												const endret = [...valgteReservasjoner];
												endret.push({ oppgaveNøkkel: reservasjon.oppgavenøkkel, begrunnelse: reservasjon.kommentar });
												setValgteReservasjoner(endret);
											} else {
												setValgteReservasjoner(
													valgteReservasjoner.filter(
														({ oppgaveNøkkel }) => oppgaveNøkkel !== reservasjon.oppgavenøkkel,
													),
												);
											}
										}}
									>
										Velg reservasjon {id}
									</Checkbox>
								</Table.DataCell>
								<Table.DataCell>{navn}</Table.DataCell>
								<Table.DataCell>{id}</Table.DataCell>
								<Table.DataCell>{type}</Table.DataCell>
								<Table.DataCell>{reservertTil}</Table.DataCell>
								<Table.DataCell>
									<ModalButton
										renderButton={({ openModal }) => (
											<Button
												size="small"
												variant="tertiary"
												icon={<ArrowUndoIcon />}
												onClick={openModal}
												disabled={valgteReservasjoner.length > 0}
											>
												Legg tilbake i kø
											</Button>
										)}
										renderModal={({ closeModal, open }) => (
											<OpphevReservasjonerModal
												open={open}
												closeModal={closeModal}
												oppgaveNøkler={[reservasjon.oppgavenøkkel]}
											/>
										)}
									/>
									<ModalButton
										renderButton={({ openModal }) => (
											<Button
												size="small"
												variant="tertiary"
												icon={<PencilIcon />}
												onClick={openModal}
												disabled={valgteReservasjoner.length > 0}
											>
												Endre/flytt
											</Button>
										)}
										renderModal={({ closeModal, open }) => (
											<FlyttReservasjonerModal
												open={open}
												closeModal={closeModal}
												reservasjoner={[
													{
														oppgaveNøkkel: reservasjon.oppgavenøkkel,
														begrunnelse: reservasjon.kommentar,
														reserverTil: reservasjon.reservertTilTidspunkt,
														reservertAvIdent: reservasjon.reservertAvIdent,
													},
												]}
											/>
										)}
									/>
								</Table.DataCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			)}
			{valgteReservasjoner.length > 0 && (
				<>
					<VerticalSpacer sixteenPx />
					<ReservasjonerBolkButtons valgteReservasjoner={valgteReservasjoner} />
				</>
			)}
		</>
	);
};

export default ReservasjonerTabell;
