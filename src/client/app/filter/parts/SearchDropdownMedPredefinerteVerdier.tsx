import React from 'react';
import { Oppgavefelt } from 'filter/filterTsTypes';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

interface OwnProps {
	feltdefinisjon: Oppgavefelt;
	onChange: (values: string[]) => void;
}

const SearchDropdownMedPredefinerteVerdier = ({ feltdefinisjon, onChange }: OwnProps) => {
	const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

	React.useEffect(() => {
		onChange(selectedValues);
	}, [selectedValues]);

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
			className="grow"
		/>
	);
};

export default SearchDropdownMedPredefinerteVerdier;
