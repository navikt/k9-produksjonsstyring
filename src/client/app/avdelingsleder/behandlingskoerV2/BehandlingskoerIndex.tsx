import React, { useState } from 'react';
import { Button, Loader, Table } from '@navikt/ds-react';
import { useAlleKoer } from 'api/queries/avdelingslederQueries';
import BehandlingsKoForm from './BehandlingsKoForm';
import NyKøModal from './NyKøModal';

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

const BehandlingskoerIndex = () => {
	const { data, isLoading, error } = useAlleKoer();
	const [visNyKøModal, setVisNyKøModal] = useState(false);
	const [sort, setSort] = useState(null);
	const [ekspanderteKøer, setEkspanderteKøer] = useState([]);
	const [køSomNettoppBleLaget, setKøSomNettoppBleLaget] = useState('');

	const onOpenChange = (køId: string) => {
		setEkspanderteKøer((prevState) =>
			prevState.includes(køId) ? prevState.filter((v) => v !== køId) : [...prevState, køId],
		);
	};
	React.useEffect(() => {
		if (køSomNettoppBleLaget) {
			setEkspanderteKøer([køSomNettoppBleLaget]);
			scrollToId(køSomNettoppBleLaget);
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
		if (!data || !sort) return data;

		return data.slice().sort((a, b) => {
			const comparator = (itemA, itemB, orderBy) => {
				if (itemB[orderBy] < itemA[orderBy] || itemB[orderBy] === undefined) return -1;
				if (itemB[orderBy] > itemA[orderBy]) return 1;
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
			<Button className="my-4" variant="secondary" onClick={() => setVisNyKøModal(true)}>
				Opprett ny kø
			</Button>
			<Table sort={sort} zebraStripes onSortChange={handleSort}>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader sortKey="tittel" sortable scope="col">
							Navn
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="saksbehandlere" sortable scope="col">
							Antall saksbehandlere
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallOppgaver" sortable scope="col">
							Antall behandlinger
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="Sist endret" sortable scope="col">
							Sist endret
						</Table.ColumnHeader>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData &&
						sortedData.map((kø) => (
							<Table.ExpandableRow
								key={kø.id}
								onOpenChange={() => onOpenChange(kø.id)}
								open={ekspanderteKøer.includes(kø.id)}
								togglePlacement="right"
								content={
									<BehandlingsKoForm
										id={kø.id}
										ekspandert={ekspanderteKøer.includes(kø.id)}
										lukk={() => onOpenChange(kø.id)}
									/>
								}
							>
								<Table.DataCell scope="row">{kø.tittel}</Table.DataCell>
								<Table.DataCell>-</Table.DataCell>
								<Table.DataCell>-</Table.DataCell>
								<Table.DataCell>-</Table.DataCell>
							</Table.ExpandableRow>
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
