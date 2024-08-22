import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Label } from '@navikt/ds-react';
import Merkelapp from '../merkelapp/Merkelapp';
import Merkelapper from '../merkelapp/Merkelapper';
import SearchForm from './SearchForm';
import SuggestionList from './SuggestionList';
import * as styles from './searchWithDropdown.css';

interface SuggestionsType {
	label: string;
	value: string;
	group?: string;
}

export type SearchWithDropdownProps = {
	label?: string;
	size?: 'small' | 'medium';
	description?: string;
	suggestions: SuggestionsType[];
	groups?: string[];
	heading: string;
	updateSelection: (values: string[]) => void;
	selectedValues: string[];
	showLabel?: boolean;
	error?: string;
	className?: string;
	id?: string;
};

const SearchWithDropdown: React.FC<SearchWithDropdownProps> = (props) => {
	const {
		label,
		description,
		suggestions,
		groups,
		heading,
		updateSelection,
		selectedValues,
		error,
		className,
		id,
		showLabel = false,
		size = 'small',
	} = props;

	const [selectedSuggestionValues, setSelectedSuggestionValues] = useState(selectedValues);
	const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
	const [currentInput, setCurrentInput] = useState('');
	const [openSuggestionGroups, setOpenSuggestionGroups] = useState<string[]>([]);
	const [showFilteredSuggestionsOnly, setShowFilteredSuggestionsOnly] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const inputId = useMemo(() => id || uuidv4(), []);
	const descriptionId = useMemo(() => uuidv4(), []);

	const getSuggestion = (suggestionValue: string) => suggestions.find((s) => s.value === suggestionValue);

	useEffect(() => {
		const selectedGroups = [];
		setSelectedSuggestionValues(selectedValues);
		selectedValues.forEach((value) => {
			const selectedGroup = getSuggestion(value)?.group;
			if (selectedGroup) selectedGroups.push(selectedGroup);
		});
		setOpenSuggestionGroups([...new Set(selectedGroups)]);
		setShowFilteredSuggestionsOnly(false);
		setFilteredSuggestions(suggestions);
		setCurrentInput('');
	}, [JSON.stringify(selectedValues)]);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const suggestionLabel = event.target.value;
		setCurrentInput(suggestionLabel);
		if (!suggestionLabel) {
			setFilteredSuggestions(suggestions);
			setShowFilteredSuggestionsOnly(false);
		} else {
			setFilteredSuggestions(
				suggestions.filter(
					(s) =>
						s.label.toLowerCase().indexOf(suggestionLabel.toLowerCase()) > -1 || s.value.indexOf(suggestionLabel) > -1,
				),
			);
			setShowFilteredSuggestionsOnly(true);
		}
	};

	const onSelect = (suggestionValue: string) => {
		if (selectedSuggestionValues.includes(suggestionValue)) {
			setSelectedSuggestionValues(selectedSuggestionValues.filter((s) => s !== suggestionValue));
		} else {
			setSelectedSuggestionValues([...selectedSuggestionValues, suggestionValue]);
		}
	};

	const deselectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
		setSelectedSuggestionValues(
			selectedSuggestionValues.filter((suggestionValue) => getSuggestion(suggestionValue).group !== suggestionGroup),
		);
	};

	const selectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
		const relevantSuggestionValues = suggestions.filter((s) => s.group === suggestionGroup).map((s) => s.value);
		setSelectedSuggestionValues([...selectedSuggestionValues, ...relevantSuggestionValues]);
	};

	const toggleGroupSelectionValues = (suggestionGroup: string) => {
		const isGroupSelected = selectedSuggestionValues.some(
			(suggestionValue) => getSuggestion(suggestionValue).group === suggestionGroup,
		);
		if (isGroupSelected) {
			deselectSuggestionGroupAndSubValues(suggestionGroup);
		} else {
			selectSuggestionGroupAndSubValues(suggestionGroup);
		}
	};

	const toggleGroupOpen = (suggestionGroup: string) => {
		if (openSuggestionGroups.includes(suggestionGroup)) {
			setOpenSuggestionGroups(openSuggestionGroups.filter((s) => s !== suggestionGroup));
		} else {
			setOpenSuggestionGroups([...openSuggestionGroups, suggestionGroup]);
		}
	};

	const onRemoveSuggestion = (suggestionValue: string) => {
		const newSelectedValues = selectedSuggestionValues.filter((s) => s !== suggestionValue);
		setSelectedSuggestionValues(newSelectedValues);
		updateSelection(newSelectedValues);
	};

	const removeAllSuggestions = () => {
		setSelectedSuggestionValues([]);
		updateSelection([]);
	};

	return (
		<div className={`${styles.searchContainer} ${className || ''}`}>
			<SearchForm
				label={label}
				showLabel={showLabel}
				description={description}
				inputId={inputId}
				descriptionId={descriptionId}
				currentInput={currentInput}
				onChange={onChange}
				isPopoverOpen={isPopoverOpen}
				setIsPopoverOpen={setIsPopoverOpen}
				onSelect={onSelect}
				size={size}
			>
				{isPopoverOpen && (
					<SuggestionList
						groups={groups}
						heading={heading}
						suggestions={suggestions}
						filteredSuggestions={filteredSuggestions}
						showFilteredSuggestionsOnly={showFilteredSuggestionsOnly}
						selectedSuggestionValues={selectedSuggestionValues}
						onSelect={onSelect}
						toggleGroupSelectionValues={toggleGroupSelectionValues}
						toggleGroupOpen={toggleGroupOpen}
						updateSelection={updateSelection}
						openSuggestionGroups={openSuggestionGroups}
						setIsPopoverOpen={setIsPopoverOpen}
						getSuggestion={getSuggestion}
					/>
				)}
			</SearchForm>
			{selectedValues.length > 0 && (
				<div>
					<Label className="self-center text-sm ">Valgte:</Label>
					<Button icon={<TrashIcon />} variant="tertiary" size="xsmall" onClick={removeAllSuggestions}>
						<span className="text-sm">Fjern alle</span>
					</Button>
				</div>
			)}
			<Merkelapper>
				{selectedValues.map((suggestion) => (
					<Merkelapp key={suggestion} onClick={() => onRemoveSuggestion(suggestion)}>
						{getSuggestion(suggestion)?.label}
					</Merkelapp>
				))}
			</Merkelapper>

			{error && <ErrorMessage>{error}</ErrorMessage>}
		</div>
	);
};

export default SearchWithDropdown;
