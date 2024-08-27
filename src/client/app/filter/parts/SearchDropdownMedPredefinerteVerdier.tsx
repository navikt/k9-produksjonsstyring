import React from 'react';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import SearchWithDropdown, { SearchWithDropdownProps } from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

export interface SearchDropdownPredefinerteVerdierProps extends Partial<SearchWithDropdownProps> {
	feltdefinisjon: Oppgavefelt;
	onChange: (values: string[]) => void;
	oppgavefilter: FeltverdiOppgavefilter;
	error?: string;
}

const SearchDropdownMedPredefinerteVerdier = ({
	feltdefinisjon,
	onChange,
	oppgavefilter,
	error,
	...rest
}: SearchDropdownPredefinerteVerdierProps) => (
	<SearchWithDropdown
		id={`${feltdefinisjon.visningsnavn.toLowerCase()}`}
		suggestions={feltdefinisjon.verdiforklaringer.map((verdiforklaring) => ({
			label: verdiforklaring.visningsnavn,
			value: verdiforklaring.verdi,
		}))}
		heading={`Velg ${feltdefinisjon.visningsnavn}`}
s		updateSelection={onChange}
		selectedValues={(oppgavefilter.verdi as string[]) || []}
		label={feltdefinisjon.visningsnavn}
		className="grow"
		size="small"
		error={error}
		{...rest}
	/>
);

export default SearchDropdownMedPredefinerteVerdier;
