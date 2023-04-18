import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { OppgavekøV2 } from 'types/OppgavekøV2Type';
import { Button, Loader, Table } from '@navikt/ds-react';
import { apiPaths } from 'api/k9LosApi';
import BehandlingsKoForm from './BehandlingsKoForm';
import NyKøModal from './NyKøModal';

const BehandlingskoerIndex = () => {
	const { data, isLoading } = useQuery<OppgavekøV2[]>(apiPaths.hentOppgavekoer, { placeholderData: [] });

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

	const sortData = () =>
		data
			.slice()
			.map((v) => ({ ...v, saksbehandlere: v.saksbehandlere.length }))
			.sort((a, b) => {
				if (sort) {
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const comparator = (a, b, orderBy) => {
						if (b[orderBy] < a[orderBy] || b[orderBy] === undefined) {
							return -1;
						}
						if (b[orderBy] > a[orderBy]) {
							return 1;
						}
						return 0;
					};

					return sort.direction === 'ascending' ? comparator(b, a, sort.orderBy) : comparator(a, b, sort.orderBy);
				}
				return 1;
			});

	if (isLoading) {
		return <Loader />;
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
					{data &&
						sortData().map((kø) => (
							<Table.ExpandableRow
								key={kø.id}
								onOpenChange={() => onOpenChange(kø.id)}
								open={ekspanderteKøer.includes(kø.id)}
								togglePlacement="right"
								content={
									<BehandlingsKoForm
										kø={data.find((v) => v.id === kø.id)}
										ekspandert={ekspanderteKøer.includes(kø.id)}
										lukk={() => onOpenChange(kø.id)}
									/>
								}
							>
								<Table.DataCell scope="row">{kø.tittel}</Table.DataCell>
								<Table.DataCell>{kø.saksbehandlere}</Table.DataCell>
								<Table.DataCell>{kø.antallOppgaver}</Table.DataCell>
								<Table.DataCell>{kø.sistEndret}</Table.DataCell>
							</Table.ExpandableRow>
						))}
				</Table.Body>
			</Table>
			{visNyKøModal && <NyKøModal vis lukk={() => setVisNyKøModal(false)} />}
		</>
	);
};

export default BehandlingskoerIndex;
