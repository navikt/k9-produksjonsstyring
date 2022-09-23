import { Search } from '@navikt/ds-icons';
import { BodyShort, Button, Checkbox, Heading, Label } from '@navikt/ds-react';
import { Combobox, ComboboxInput, ComboboxList, ComboboxPopover } from '@reach/combobox';
import React, { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Merkelapp from './merkelapp/Merkelapp';
import Merkelapper from './merkelapp/Merkelapper';
import styles from './searchWithDropdown.less';
import SelectCheckbox from './SelectCheckbox';

const formClassName = `${styles.form} navds-form-field`;

const inputClassName = `${styles.input} navds-search__input navds-search__input--secondary navds-text-field__input navds-body-short navds-body-medium`;

const buttonClassName =
  'navds-search__button-search navds-button navds-button--primary navds-button--medium navds-button--icon-only';

interface SuggestionsType {
  label: string;
  value: string;
  group: string;
}

type Props = {
  label: string;
  description?: string;
  suggestions: SuggestionsType[];
  groups: string[];
  heading: string;
  addButtonText: string;
  updateSelection: (values: string[]) => void;
  selectedValues: string[];
};

export const SearchWithDropdown: React.FC<Props> = ({
  label,
  description,
  suggestions,
  groups,
  heading,
  addButtonText,
  updateSelection,
  selectedValues,
}) => {
  const [selectedSuggestionValues, setSelectedSuggestionValues] = useState(selectedValues);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [currentInput, setCurrentInput] = useState('');
  const [openSuggestionGroups, setOpenSuggestionGroups] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputId = useMemo(() => uuidv4(), []);
  const descriptionId = useMemo(() => uuidv4(), []);

  const getSuggestion = (suggestionValue: string) => suggestions.find(s => s.value === suggestionValue);

  useEffect(() => {
    const selectedGroups = [];
    setSelectedSuggestionValues(selectedValues);
    selectedValues.forEach(value => {
      const selectedGroup = getSuggestion(value).group;
      selectedGroups.push(selectedGroup);
    });
    setOpenSuggestionGroups([...new Set(selectedGroups)]);
  }, [selectedValues]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const suggestionLabel = event.target.value;
    setCurrentInput(suggestionLabel);
    if (!suggestionLabel) {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(
        suggestions.filter(
          s =>
            s.label.toLowerCase().indexOf(suggestionLabel.toLowerCase()) > -1 || s.value.indexOf(suggestionLabel) > -1,
        ),
      );
    }
  };

  const onSelect = (suggestionValue: string) => {
    if (selectedSuggestionValues.includes(suggestionValue)) {
      setSelectedSuggestionValues(selectedSuggestionValues.filter(s => s !== suggestionValue));
    } else {
      setSelectedSuggestionValues([...selectedSuggestionValues, suggestionValue]);
    }
  };

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    const matchedSuggestion = suggestions.find(
      suggestion => currentInput.toLowerCase() === suggestion.value.toLowerCase(),
    );

    if (matchedSuggestion) {
      onSelect(matchedSuggestion.value);
    }
  };

  const deselectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
    setOpenSuggestionGroups(openSuggestionGroups.filter(s => s !== suggestionGroup));
    setSelectedSuggestionValues(
      selectedSuggestionValues.filter(suggestionValue => getSuggestion(suggestionValue).group !== suggestionGroup),
    );
  };

  const selectSuggestionGroupAndSubValues = (suggestionGroup: string) => {
    setOpenSuggestionGroups([...openSuggestionGroups, suggestionGroup]);
    const relevantSuggestionValues = suggestions.filter(s => s.group === suggestionGroup).map(s => s.value);
    setSelectedSuggestionValues([...selectedSuggestionValues, ...relevantSuggestionValues]);
  };

  const handleSuggestionGroupToggle = (suggestionGroup: string) => {
    if (openSuggestionGroups.includes(suggestionGroup)) {
      deselectSuggestionGroupAndSubValues(suggestionGroup);
    } else {
      selectSuggestionGroupAndSubValues(suggestionGroup);
    }
  };

  const onRemoveSuggestion = (suggestionValue: string) => {
    const newListofSelectedValues = selectedSuggestionValues.filter(s => s !== suggestionValue);
    updateSelection(newListofSelectedValues);
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={onSubmit} className={formClassName}>
        <Label htmlFor={inputId} className="navds-form-field__label">
          {label}
        </Label>
        <BodyShort size="small" as="div" id={descriptionId} className="navds-form-field__description">
          {description}
        </BodyShort>
        <Combobox className="navds-search__wrapper" onSelect={onSelect} openOnFocus>
          <div className="navds-search__wrapper-inner">
            <ComboboxInput
              id={inputId}
              autoComplete="off"
              aria-describedby={descriptionId}
              className={inputClassName}
              onChange={onChange}
              value={currentInput}
              onFocus={() => setIsPopoverOpen(true)}
            />
          </div>
          <button type="button" className={buttonClassName}>
            <span className="navds-button__icon">
              <Search />
            </span>
          </button>

          {isPopoverOpen && groups.length > 0 && (
            <ComboboxPopover className={styles.suggestionPopover}>
              <ComboboxList className={styles.list}>
                <Heading className={styles.listHeading} level="3" size="xsmall">
                  Grupper
                </Heading>
                <fieldset className={styles.fieldset}>
                  <legend className="navds-sr-only">{heading}</legend>
                  {groups
                    .filter(group => filteredSuggestions.some(suggestion => suggestion.group === group))
                    .map(group => {
                      const suggestionsInThisGroup = suggestions.filter(suggestion => suggestion.group === group);
                      const numberOfSelectedItemsInGroup = selectedSuggestionValues.filter(
                        suggestionValue => getSuggestion(suggestionValue).group === group,
                      ).length;
                      return (
                        <React.Fragment key={group}>
                          <SelectCheckbox
                            value={group}
                            label={group}
                            onClick={suggestionGroup => handleSuggestionGroupToggle(suggestionGroup)}
                            numberOfItems={numberOfSelectedItemsInGroup}
                            isChecked={openSuggestionGroups.includes(group)}
                          />
                          {openSuggestionGroups.includes(group) &&
                            suggestionsInThisGroup.map(suggestion => (
                              <div key={suggestion.label} className={styles.suggestionSubgroup}>
                                <Checkbox
                                  className={styles.suggestionCheckbox}
                                  value={suggestion.value}
                                  onClick={() => onSelect(suggestion.value)}
                                  checked={selectedSuggestionValues.includes(suggestion.value)}
                                >
                                  {`${suggestion.value} - ${suggestion.label}`}
                                </Checkbox>
                              </div>
                            ))}
                        </React.Fragment>
                      );
                    })}
                </fieldset>
              </ComboboxList>
              <p className={styles.popoverButtonWrapper}>
                <Button
                  onClick={() => {
                    updateSelection(selectedSuggestionValues);
                    setIsPopoverOpen(false);
                  }}
                  variant="primary"
                  size="medium"
                >
                  {addButtonText}
                </Button>
              </p>
            </ComboboxPopover>
          )}
        </Combobox>

        {selectedValues.length > 0 && (
          <Heading className={styles.merkelapperHeading} level="4" size="xsmall">
            Valgte filter:
          </Heading>
        )}
        <Merkelapper>
          {selectedValues.map(suggestion => (
            <Merkelapp key={suggestion} onClick={() => onRemoveSuggestion(suggestion)}>
              {`${suggestion} - ${getSuggestion(suggestion).label}`}
            </Merkelapp>
          ))}
        </Merkelapper>
      </form>
    </div>
  );
};

export default SearchWithDropdown;
