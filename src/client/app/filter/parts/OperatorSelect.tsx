import React, { useContext } from 'react';
import { Select } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { updateFilter } from 'filter/queryUtils';

function OperatorSelect({ oppgavefilter }) {
	const { updateQuery } = useContext(FilterContext);
	const handleChangeOperator = (event) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				operator: event.target.value,
			}),
		]);
	};

	return (
		<Select label="Operator" size="small" hideLabel value={oppgavefilter.operator} onChange={handleChangeOperator}>
			<option value="EQUALS">er lik</option>
			<option value="NOT_EQUALS">er IKKE lik</option>
			<option value="IN">inneholder</option>
			<option value="NOT_IN">inneholder IKKE</option>
			<option value="LESS_THAN">mindre enn (&#60;)</option>
			<option value="GREATER_THAN">større enn (&#62;)</option>
			<option value="LESS_THAN_OR_EQUALS">mindre enn eller lik (&#60;=)</option>
			<option value="GREATER_THAN_OR_EQUALS">større enn eller lik (&#62;=)</option>
		</Select>
	);
}

export default OperatorSelect;
