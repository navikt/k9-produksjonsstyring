import React from 'react';
import { Combobox, ComboboxInput } from '@reach/combobox';
import { Search } from '@navikt/ds-icons';
import { BodyShort, Label } from '@navikt/ds-react';
import styles from './searchWithDropdown.css';

interface SearchFormProps {
	label: string;
	description?: string;
	inputId: string;
	descriptionId: string;
	inputClassName: string;
	buttonClassName: string;
	currentInput: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setIsPopoverOpen: (open: boolean) => void;
	children?: React.ReactNode;
	onSelect: (value: string) => void;
	onSubmit: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
	label,
	description,
	inputId,
	descriptionId,
	currentInput,
	onChange,
	setIsPopoverOpen,
	onSelect,
	children,
	inputClassName,
	buttonClassName,
	onSubmit,
}) => {
	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			onSubmit();
		}
	};

	return (
		<div className={styles.form}>
			<Label htmlFor={inputId} size="small" className="navds-form-field__label block">
				{label}
			</Label>
			{description && (
				<BodyShort size="small" as="div" id={descriptionId} className="navds-form-field__description">
					{description}
				</BodyShort>
			)}
			<Combobox className={`navds-search__wrapper ${styles.searchWrapper}`} onSelect={onSelect} openOnFocus>
				<div className="flex">
					<div className={`navds-search__wrapper-inner ${styles.searchWrapper__inner}`}>
						<ComboboxInput
							id={inputId}
							autoComplete="off"
							aria-describedby={descriptionId}
							className={inputClassName}
							onChange={onChange}
							value={currentInput}
							onFocus={() => setIsPopoverOpen(true)}
							onKeyPress={handleKeyPress}
						/>
					</div>
					<button
						type="button"
						className={`${buttonClassName} ${styles.searchButton}`}
						onClick={onSubmit}
						aria-label="search button"
					>
						<span className="navds-button__icon">
							<Search />
						</span>
					</button>
				</div>
				{children}
			</Combobox>
		</div>
	);
};

export default SearchForm;
