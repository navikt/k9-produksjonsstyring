import React, { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Heading } from '@navikt/ds-react';
import Merkelapp from '../merkelapp/Merkelapp';
import Merkelapper from '../merkelapp/Merkelapper';
import SearchForm from './SearchForm';
import SuggestionList from './SuggestionList';
import styles from './searchWithDropdown.css';

const inputClassName = `${styles.input} navds-search__input navds-search__input--secondary navds-text-field__input navds-body-short navds-body-medium`;
const buttonClassName =
	'navds-search__button-search navds-button navds-button--primary navds-button--medium navds-button--icon-only';

interface SuggestionsType {
	label: string;
	value: string;
	group?: string;
}

type Props = {
	label: string;
	description?: string;
	suggestions: SuggestionsType[];
	groups?: string[];
	heading: string;
	addButtonText: string;
	updateSelection: (values: string[]) => void;
	selectedValues: string[];
	error?: string;
};

const SearchWithDropdown: React.FC<Props> = (props) => {
	const { label, description, suggestions, groups, heading, addButtonText, updateSelection, selectedValues, error } =
		props;

	const [selectedSuggestionValues, setSelectedSuggestionValues] = useState(selectedValues);
	const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
	const [currentInput, setCurrentInput] = useState('');
	const [openSuggestionGroups, setOpenSuggestionGroups] = useState<string[]>([]);
	const [showFilteredSuggestionsOnly, setShowFilteredSuggestionsOnly] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const inputId = useMemo(() => uuidv4(), []);
	const descriptionId = useMemo(() => uuidv4(), []);

	const getSuggestion = (suggestionValue: string) => suggestions.find((s) => s.value === suggestionValue);

	useEffect(() => {
		const selectedGroups = [];
		setSelectedSuggestionValues(selectedValues);
		selectedValues.forEach((value) => {
			const selectedGroup = getSuggestion(value).group;
			selectedGroups.push(selectedGroup);
		});
		setOpenSuggestionGroups([...new Set(selectedGroups)]);
		setShowFilteredSuggestionsOnly(false);
		setFilteredSuggestions(suggestions);
		setCurrentInput('');
	}, [selectedValues]);

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

	const onSubmit = () => {
		const matchedSuggestion = suggestions.find(
			(suggestion) => currentInput.toLowerCase() === suggestion.value.toLowerCase(),
		);

		if (matchedSuggestion) {
			onSelect(matchedSuggestion.value);
		}
	};

	const deselectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
		setOpenSuggestionGroups(openSuggestionGroups.filter((s) => s !== suggestionGroup));
		setSelectedSuggestionValues(
			selectedSuggestionValues.filter((suggestionValue) => getSuggestion(suggestionValue).group !== suggestionGroup),
		);
	};

	const selectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
		setOpenSuggestionGroups([...openSuggestionGroups, suggestionGroup]);
		const relevantSuggestionValues = suggestions.filter((s) => s.group === suggestionGroup).map((s) => s.value);
		setSelectedSuggestionValues([...selectedSuggestionValues, ...relevantSuggestionValues]);
	};

	const handleSuggestionGroupToggle = (suggestionGroup: string) => {
		if (openSuggestionGroups.includes(suggestionGroup)) {
			deselectSuggestionGroupAndSubValues(suggestionGroup);
		} else {
			selectSuggestionGroupAndSubValues(suggestionGroup);
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
		<div className={styles.searchContainer}>
			<SearchForm
				label={label}
				description={description}
				inputId={inputId}
				descriptionId={descriptionId}
				onSubmit={onSubmit}
				inputClassName={inputClassName}
				buttonClassName={buttonClassName}
				currentInput={currentInput}
				onChange={onChange}
				setIsPopoverOpen={setIsPopoverOpen}
				onSelect={onSelect}
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
						handleSuggestionGroupToggle={handleSuggestionGroupToggle}
						updateSelection={updateSelection}
						addButtonText={addButtonText}
						openSuggestionGroups={openSuggestionGroups}
						setIsPopoverOpen={setIsPopoverOpen}
						getSuggestion={getSuggestion}
					/>
				)}
			</SearchForm>
			{selectedValues.length > 0 && (
				<div>
					<Heading className={styles.merkelapperHeading} level="4" size="xsmall">
						Valgte filter:
					</Heading>
					<Button
						icon={<TrashIcon />}
						variant="tertiary"
						size="small"
						className="border-border-danger text-border-danger float-right mt-4"
						onClick={removeAllSuggestions}
					>
						Fjern alle
					</Button>
				</div>
			)}

			<Merkelapper>
				{selectedValues.map((suggestion) => (
					<Merkelapp key={suggestion} onClick={() => onRemoveSuggestion(suggestion)}>
						{getSuggestion(suggestion).label}
					</Merkelapp>
				))}
			</Merkelapper>

			{error && <ErrorMessage>{error}</ErrorMessage>}
		</div>
	);
};

export default SearchWithDropdown;
