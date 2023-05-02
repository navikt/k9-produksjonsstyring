import React from 'react';
import { FeltverdiOppgavefilter, Oppgavefelt } from 'filter/filterTsTypes';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';

interface OwnProps {
	feltdefinisjon: Oppgavefelt;
	onChange: (values: string[]) => void;
	oppgavefilter: FeltverdiOppgavefilter;
}

const SearchDropdownMedPredefinerteVerdier = ({ feltdefinisjon, onChange, oppgavefilter }: OwnProps) => {
	const [selectedValues, setSelectedValues] = React.useState<string[]>(oppgavefilter?.verdi || []);

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
