import React from 'react';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import SearchWithDropdown, { SearchWithDropdownProps } from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

export interface SearchDropdownPredefinerteVerdierProps extends Partial<SearchWithDropdownProps> {
	feltdefinisjon: Oppgavefelt;
	onChange: (values: string[]) => void;
	oppgavefilter: FeltverdiOppgavefilter;
}

const SearchDropdownMedPredefinerteVerdier = ({
	feltdefinisjon,
	onChange,
	oppgavefilter,
	...rest
}: SearchDropdownPredefinerteVerdierProps) => (
	<SearchWithDropdown
		id={`${feltdefinisjon.visningsnavn.toLowerCase()}`}
		suggestions={feltdefinisjon.verdiforklaringer.map((verdiforklaring) => ({
			label: verdiforklaring.visningsnavn,
			value: verdiforklaring.verdi,
		}))}
		heading={`Velg ${feltdefinisjon.visningsnavn}`}
		addButtonText={`Legg til ${feltdefinisjon.visningsnavn.toLowerCase()}`}
		updateSelection={onChange}
		selectedValues={oppgavefilter.verdi || []}
		className="grow"
		{...rest}
	/>
);

export default SearchDropdownMedPredefinerteVerdier;
