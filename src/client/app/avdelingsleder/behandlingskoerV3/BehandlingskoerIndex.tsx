import React, { useState } from 'react';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, Loader, Skeleton, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useAlleKoer } from 'api/queries/avdelingslederQueries';
import { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';
import BehandlingsKoForm from './BehandlingsKoForm';
import KopierKø from './KopierKø';
import NyKøModal from './NyKøModal';
import SlettKø from './SlettKø';

function scrollToId(id: string) {
	let intervalId: NodeJS.Timeout | undefined;

	const scroll = () => {
		const element = document.getElementById(id);
		if (element) {
			clearInterval(intervalId);
			setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'end' }), 500);
		}
	};

	intervalId = setInterval(scroll, 100);
}

const berikMedAntallOppgaver = (køArray: OppgavekøV3Enkel[]) =>
	useQuery(
		['beriketAntallOppgaver', køArray],
		async () => {
			if (!køArray) return køArray;

			const requests = køArray.map(async (kø) => {
				try {
					const response = await axiosInstance.get(apiPaths.antallOppgaverIKoV3(kø.id));
					return { ...kø, antallOppgaver: response.data };
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					return { ...kø, antallOppgaver: undefined };
				}
			});

			return Promise.all(requests);
		},
		{
			enabled: !!køArray,
		},
	);

const Row = ({
	kø,
	ekspandert,
	isLoadingAntallOppgaver,
	toggleExpand,
}: {
	kø: OppgavekøV3Enkel & { antallOppgaver?: number };
	ekspandert: boolean;
	isLoadingAntallOppgaver: boolean;
	toggleExpand: () => void;
}) => (
	<Table.ExpandableRow
		onOpenChange={toggleExpand}
		open={ekspandert}
		togglePlacement="left"
		content={<BehandlingsKoForm id={kø.id} ekspandert={ekspandert} lukk={toggleExpand} />}
	>
		<Table.DataCell scope="row">{kø.tittel}</Table.DataCell>
		<Table.DataCell>{kø.antallSaksbehandlere || '0'}</Table.DataCell>
		<Table.DataCell>
			{isLoadingAntallOppgaver ? <Skeleton variant="text" /> : (kø?.antallOppgaver ?? '-')}
		</Table.DataCell>
		<Table.DataCell>{kø.sistEndret ? dayjs(kø.sistEndret).format('DD.MM.YYYY HH:mm') : '-'}</Table.DataCell>
		<Table.DataCell>
			<KopierKø kø={kø} />
			<SlettKø kø={kø} />
		</Table.DataCell>
	</Table.ExpandableRow>
);
const BehandlingskoerIndex = () => {
	const { data: initielleKøer, isLoading, error } = useAlleKoer();
	const {
		data: køer,
		isLoading: isLoadingAntallOppgaver,
		isSuccess: harHentetAntallOppgaver,
	} = berikMedAntallOppgaver(initielleKøer);
	const [visNyKøModal, setVisNyKøModal] = useState(false);
	const [sort, setSort] = useState(null);
	const [ekspanderteKøer, setEkspanderteKøer] = useState([]);
	const [køSomNettoppBleLaget, setKøSomNettoppBleLaget] = useState('');

	const toggleExpand = (køId: string) => {
		setEkspanderteKøer((prevState) =>
			prevState.includes(køId) ? prevState.filter((v) => v !== køId) : [...prevState, køId],
		);
	};
	React.useEffect(() => {
		if (køSomNettoppBleLaget) {
			setEkspanderteKøer([køSomNettoppBleLaget]);
			scrollToId(køSomNettoppBleLaget);
			setKøSomNettoppBleLaget('');
		}
	}, [køSomNettoppBleLaget]);

	const handleSort = (sortKey) => {
		const newDirection =
			sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending';
		setSort((prevState) =>
			prevState && sortKey === prevState.orderBy && prevState.direction === 'descending'
				? undefined
				: { orderBy: sortKey, direction: newDirection },
		);
	};

	const sortData = () => {
		if (!køer || !sort) return køer;

		return køer.slice().sort((a, b) => {
			const comparator = (itemA, itemB, orderBy) => {
				let aVal = itemA[orderBy];
				let bVal = itemB[orderBy];
				if (orderBy === 'sistEndret') {
					aVal = aVal ? new Date(aVal).getTime() : 0;
					bVal = bVal ? new Date(bVal).getTime() : 0;
				}
				if (orderBy === 'tittel') {
					aVal = aVal?.toLowerCase();
					bVal = bVal?.toLowerCase();
				}
				if (bVal < aVal || bVal === undefined) return -1;
				if (bVal > aVal) return 1;
				return 0;
			};

			return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
		});
	};

	if (isLoading) return <Loader />;
	if (error) return <>Noe gikk galt ved lasting av køer.</>;

	const sortedData = sortData();

	return (
		<>
			<Button className="mb-7" variant="primary" onClick={() => setVisNyKøModal(true)} icon={<PlusCircleIcon />}>
				Legg til ny oppgavekø
			</Button>
			<Table sort={sort} onSortChange={handleSort} size="small">
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader scope="col" />
						<Table.ColumnHeader sortKey="tittel" sortable scope="col">
							Kønavn
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallSaksbehandlere" sortable scope="col">
							Saksbehandlere
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallOppgaver" sortable={harHentetAntallOppgaver} scope="col">
							Antall oppgaver
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="sistEndret" sortable scope="col">
							Sist endret
						</Table.ColumnHeader>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData?.map((kø) => (
						<Row
							kø={kø}
							key={kø.id}
							isLoadingAntallOppgaver={isLoadingAntallOppgaver}
							ekspandert={ekspanderteKøer.includes(kø.id)}
							toggleExpand={() => toggleExpand(kø.id)}
						/>
					))}
				</Table.Body>
			</Table>
			{visNyKøModal && (
				<NyKøModal
					vis
					lukk={() => setVisNyKøModal(false)}
					onSuccessCallback={(id) => {
						setKøSomNettoppBleLaget(id);
					}}
				/>
			)}
		</>
	);
};

export default BehandlingskoerIndex;
