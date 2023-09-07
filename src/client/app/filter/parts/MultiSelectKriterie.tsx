/* eslint-disable react/jsx-pascal-case */

/* eslint-disable camelcase */
import React, { useContext, useMemo, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import FilterContext from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';

interface Props {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
}

const MultiSelectKriterie = ({ feltdefinisjon, oppgavefilter }: Props) => {
	const [value, setValue] = useState('');
	const { oppdaterFilter } = useContext(FilterContext);
	const selectedOptions = oppgavefilter.verdi?.map(
		(v) => feltdefinisjon.verdiforklaringer.find((verdiforklaring) => verdiforklaring.verdi === v).visningsnavn,
	);
	const filteredOptions = useMemo(
		() => feltdefinisjon.verdiforklaringer?.map((v) => v.visningsnavn).filter((option) => option.includes(value)),
		[value, JSON.stringify(oppgavefilter)],
	);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		const verdi = feltdefinisjon?.verdiforklaringer.find((v) => v.visningsnavn === option)?.verdi;
		if (isSelected) {
			oppdaterFilter(oppgavefilter.id, { verdi: [...(oppgavefilter?.verdi || []), verdi] });
		} else {
			oppdaterFilter(oppgavefilter.id, { verdi: oppgavefilter.verdi?.filter((o) => o !== verdi) });
		}
	};
	return (
		<div>
			<UNSAFE_Combobox
				size="small"
				label={feltdefinisjon.visningsnavn}
				hideLabel
				filteredOptions={filteredOptions}
				options={feltdefinisjon.verdiforklaringer?.map((v) => v.visningsnavn)}
				isMultiSelect
				onChange={(event) => {
					if (event) setValue(event.target.value);
				}}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions || []}
				value={value}
			/>
		</div>
	);
};

export default MultiSelectKriterie;
