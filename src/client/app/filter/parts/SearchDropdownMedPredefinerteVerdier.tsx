import React from 'react';
import { Oppgavefelt } from 'filter/filterTsTypes';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

interface OwnProps {
	feltdefinisjon: Oppgavefelt;
}

const SearchDropdownMedPredefinerteVerdier = ({ feltdefinisjon }: OwnProps) => {
	const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

	return (
		<SearchWithDropdown
			label={`Velg ${feltdefinisjon.visningsnavn.toLowerCase()}`}
			suggestions={feltdefinisjon.verdiforklaringer.map((verdiforklaring) => ({
				label: verdiforklaring.visningsnavn,
				value: verdiforklaring.verdi,
			}))}
			heading={`Velg ${feltdefinisjon.visningsnavn}`}
			addButtonText={`Legg til ${feltdefinisjon.visningsnavn.toLowerCase()}`}
			updateSelection={setSelectedValues}
			selectedValues={selectedValues}
			className="w-4/12"
		/>
	);
};

export default SearchDropdownMedPredefinerteVerdier;
