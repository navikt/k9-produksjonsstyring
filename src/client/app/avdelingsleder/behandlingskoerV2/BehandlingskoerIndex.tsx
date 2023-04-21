import React, { useState } from 'react';
import { Button, Loader, Table } from '@navikt/ds-react';
import { useAlleKoer } from 'api/queries/avdelingslederQueries';
import BehandlingsKoForm from './BehandlingsKoForm';
import NyKøModal from './NyKøModal';

const BehandlingskoerIndex = () => {
	const { data, isLoading, error } = useAlleKoer();
	const [visNyKøModal, setVisNyKøModal] = useState(false);
	const [sort, setSort] = useState(null);
	const [ekspanderteKøer, setEkspanderteKøer] = useState([]);

	const onOpenChange = (køId) => {
		if (ekspanderteKøer.includes(køId)) {
			setEkspanderteKøer(ekspanderteKøer.filter((v) => v !== køId));
		} else setEkspanderteKøer([...ekspanderteKøer, køId]);
	};

	const handleSort = (sortKey) => {
		setSort(
			sort && sortKey === sort.orderBy && sort.direction === 'descending'
				? undefined
				: {
						orderBy: sortKey,
						direction: sort && sortKey === sort.orderBy && sort.direction === 'ascending' ? 'descending' : 'ascending',
				  },
		);
	};

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <>Noe gikk galt ved lasting av køer.</>;
	}

	return (
		<>
			<Button className="my-4" variant="secondary" onClick={() => setVisNyKøModal(true)}>
				Opprett ny kø
			</Button>
			<Table sort={sort} zebraStripes onSortChange={(sortKey) => handleSort(sortKey)}>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeader sortKey="tittel" sortable>
							Navn
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="saksbehandlere" sortable scope="col">
							Antall saksbehandlere
						</Table.ColumnHeader>
						<Table.ColumnHeader sortKey="antallOppgaver" sortable scope="col">
							Antall behandlinger
						</Table.ColumnHeader>
						<Table.ColumnHeader scope="col" sortKey="Sist endret" sortable>
							Sist endret
						</Table.ColumnHeader>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data.map((kø) => (
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
			{visNyKøModal && <NyKøModal vis lukk={() => setVisNyKøModal(false)} />}
		</>
	);
};

export default BehandlingskoerIndex;
