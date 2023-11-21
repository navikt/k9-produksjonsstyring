/* eslint-disable react/jsx-pascal-case */

/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import { updateFilter } from 'filter/queryUtils';

interface Props {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
}

const MultiSelectKriterie = ({ feltdefinisjon, oppgavefilter }: Props) => {
	const [value, setValue] = useState('');
	const [visAlle, setVisAlle] = useState(false);
	const { updateQuery } = useContext(FilterContext);
	const selectedOptions = oppgavefilter.verdi?.map(
		(v) => feltdefinisjon.verdiforklaringer.find((verdiforklaring) => verdiforklaring.verdi === v).visningsnavn,
	);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		if (option === '--- Vis alle ---') {
			setVisAlle(true);
			setValue('');
			return;
		}

		const verdi = feltdefinisjon?.verdiforklaringer.find((v) => v.visningsnavn === option)?.verdi;
		if (isSelected) {
			updateQuery([updateFilter(oppgavefilter.id, { verdi: [...(oppgavefilter?.verdi || []), verdi] })]);
		} else {
			updateQuery([updateFilter(oppgavefilter.id, { verdi: oppgavefilter.verdi?.filter((o) => o !== verdi) })]);
		}
	};
	const options = visAlle
		? [...feltdefinisjon.verdiforklaringer?.map((v) => v.visningsnavn), 'Her', 'Er', 'Alle']
		: [...feltdefinisjon.verdiforklaringer?.map((v) => v.visningsnavn), '--- Vis alle ---'];
	return (
		<div>
			<UNSAFE_Combobox
				size="small"
				label={feltdefinisjon.visningsnavn}
				shouldAutocomplete
				clearButton
				onClear={() => {
					setValue('');
				}}
				hideLabel
				options={options}
				isMultiSelect
				onChange={(event) => {
					if (event) {
						setValue(event.target.value);
					}
				}}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions || []}
				value={value}
			/>
		</div>
	);
};

export default MultiSelectKriterie;
