import React, { useContext, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { addSortering, resetSortering } from 'filter/queryUtils';
import { mapKodeTilSorteringParams, mapSorteringParamsTilKode } from './sorteringUtils';

const EnkelSortering = () => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const selectValue = useMemo(() => {
		if (!oppgaveQuery.order.length) return undefined;

		if (oppgaveQuery.order.length > 1) {
			throw new Error('Kan ikke håndtere flere sorteringer');
		}

		return mapSorteringParamsTilKode(oppgaveQuery.order[0]);
	}, [oppgaveQuery]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const payload = mapKodeTilSorteringParams(e.target.value);
		if (payload) {
			updateQuery([resetSortering(), addSortering(payload)]);
		}
	};

	return (
		<Select label="Sortering:" size="small" onChange={handleChange} value={selectValue}>
			<option value="mottattDatoEldstTilNyest">Mottatt dato: eldste til nyeste</option>
			<option value="mottattDatoNyestTilEldst">Mottatt dato: nyeste til eldste</option>
		</Select>
	);
};

export default EnkelSortering;
