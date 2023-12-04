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

	const operatorDisplayMap = {
		[OPERATORS.EQUALS]: 'er lik',
		[OPERATORS.NOT_EQUALS]: 'er IKKE lik',
		[OPERATORS.IN]: 'Inkluder',
		[OPERATORS.NOT_IN]: 'Ekskluder',
		[OPERATORS.LESS_THAN]: 'mindre enn (<)',
		[OPERATORS.GREATER_THAN]: 'større enn (>)',
		[OPERATORS.LESS_THAN_OR_EQUALS]: 'mindre enn eller lik (<=)',
		[OPERATORS.GREATER_THAN_OR_EQUALS]: 'større enn eller lik (>=)',
		[OPERATORS.INTERVAL]: 'mellom',
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
	}, [JSON.stringify(operators), JSON.stringify(kriterieDefinisjon)]);
	if (operators.length <= 1) {
		return null;
	}

	const handleChangeOperator = (event) => {
		updateQuery([
			updateFilter(oppgavefilter.id, {
				operator: event.target.value,
			}),
		]);
	};

	return (
		<Select
			label="Operator"
			size="small"
			hideLabel
			className="w-[12rem]"
			value={oppgavefilter.operator}
			onChange={handleChangeOperator}
		>
			{operators.map((operator) => (
				<option key={operator} value={operator}>
					{operatorDisplayMap[operator]}
				</option>
			))}
		</Select>
	);
}

export default KriterieOperator;
