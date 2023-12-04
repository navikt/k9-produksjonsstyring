import React, { useContext, useEffect, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS, operatorsFraTolkesSom } from 'filter/utils';

function KriterieOperator({ oppgavefilter }) {
	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);
	const kriterieDefinisjon = kriterierSomKanVelges.find(
		(kriterie) => kriterie.område === oppgavefilter.område && kriterie.kode === oppgavefilter.kode,
	);

	if (!kriterieDefinisjon) {
		throw Error('KriterieDefinisjon ikke funnet');
	}
	const handleChangeOperator = (event) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				operator: event.target.value,
			}),
		]);
	};

	const operators = useMemo(
		() => operatorsFraTolkesSom(kriterieDefinisjon.tolkes_som, kriterieDefinisjon.verdiforklaringer?.length),
		[JSON.stringify(kriterieDefinisjon)],
	);

	useEffect(() => {
		if (operators.length && !operators.includes(oppgavefilter.operator)) {
			updateQuery([
				updateFilter(oppgavefilter.id, {
					operator: operators[0],
				}),
			]);
		}
	}, [JSON.stringify(operators)]);

	if (operators.length === 1 && operators.includes(OPERATORS.EQUALS)) {
		return null;
	}

	if (operators.length === 1 && operators.includes(OPERATORS.IN)) {
		return null;
	}

	if (operators.length === 2 && operators.includes(OPERATORS.IN) && operators.includes(OPERATORS.NOT_IN)) {
		return (
			<Select
				className="min-w-[8rem]"
				label="Operator"
				size="small"
				hideLabel
				value={oppgavefilter.operator}
				onChange={handleChangeOperator}
			>
				<option value="IN">Inkluder</option>
				<option value="NOT_IN">Ekskluder</option>
			</Select>
		);
	}

	if (
		operators.length === 2 &&
		operators.includes(OPERATORS.GREATER_THAN_OR_EQUALS) &&
		operators.includes(OPERATORS.LESS_THAN_OR_EQUALS)
	) {
		return (
			<Select
				className="min-w-[8rem]"
				label="Operator"
				size="small"
				hideLabel
				value={oppgavefilter.operator}
				onChange={handleChangeOperator}
			>
				<option value="LESS_THAN_OR_EQUALS">mindre enn eller lik (&#60;=)</option>
				<option value="GREATER_THAN_OR_EQUALS">større enn eller lik (&#62;=)</option>
			</Select>
		);
	}
	return (
		<Select
			className="min-w-[8rem]"
			label="Operator"
			size="small"
			hideLabel
			value={oppgavefilter.operator}
			onChange={handleChangeOperator}
		>
			<option value={OPERATORS.EQUALS}>er lik</option>
			<option value={OPERATORS.NOT_EQUALS}>er IKKE lik</option>
			<option value={OPERATORS.IN}>Inkluder</option>
			<option value={OPERATORS.NOT_IN}>Ekskluder</option>
			<option value={OPERATORS.LESS_THAN}>mindre enn (&#60;)</option>
			<option value={OPERATORS.GREATER_THAN}>større enn (&#62;)</option>
			<option value={OPERATORS.LESS_THAN_OR_EQUALS}>mindre enn eller lik (&#60;=)</option>
			<option value={OPERATORS.GREATER_THAN_OR_EQUALS}>større enn eller lik (&#62;=)</option>
		</Select>
	);
}

export default KriterieOperator;
