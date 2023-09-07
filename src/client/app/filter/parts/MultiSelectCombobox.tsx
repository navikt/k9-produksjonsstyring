/* eslint-disable react/jsx-pascal-case */

/* eslint-disable camelcase */
import React, { useMemo, useState } from 'react';
import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react';

const MultiSelectCombobox = (props: ComboboxProps) => {
	const [value, setValue] = useState('');

	const [selectedOptions, setSelectedOptions] = useState([]);
	const filteredOptions = useMemo(() => props.options.filter((option) => option.includes(value)), [value]);

	const onToggleSelected = (option: string, isSelected: boolean) => {
		if (isSelected) {
			setSelectedOptions([...selectedOptions, option]);
		} else {
			setSelectedOptions(selectedOptions.filter((o) => o !== option));
		}
	};
	console.log(value);
	return (
		<div>
			<UNSAFE_Combobox
				label="Hvilke land har du besøkt de siste 6 ukene? Velg opptil flere."
				filteredOptions={filteredOptions}
				isMultiSelect
				onChange={(event) => {
					if (event) setValue(event.target.value);
				}}
				onToggleSelected={onToggleSelected}
				selectedOptions={selectedOptions}
				value={value}
				{...props}
			/>
		</div>
	);
};

export default MultiSelectCombobox;
