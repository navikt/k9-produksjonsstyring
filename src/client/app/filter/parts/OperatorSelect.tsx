import React from 'react';
import classNames from 'classnames';
import { Select } from '@navikt/ds-react';

function OperatorSelect({ oppgavefilter, onOppdaterFilter, isUsingPredefinedValues }) {
	const handleChangeOperator = (event) => {
		onOppdaterFilter(oppgavefilter.id, {
			operator: event.target.value,
		});
	};

	return (
		<Select
			label="Operator"
			hideLabel
			value={oppgavefilter.operator}
			onChange={handleChangeOperator}
			className={classNames({ 'mt-[55px]': isUsingPredefinedValues })}
		>
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
