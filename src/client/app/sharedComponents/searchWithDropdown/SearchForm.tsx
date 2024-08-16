import React from 'react';
import { Combobox, ComboboxInput } from '@reach/combobox';
import { Search } from '@navikt/ds-icons';
import { BodyShort, Label } from '@navikt/ds-react';
import * as styles from './searchWithDropdown.css';

interface SearchFormProps {
	label: string;
	showLabel?: boolean;
	description?: string;
	inputId: string;
	descriptionId: string;
	currentInput: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setIsPopoverOpen: (open: boolean) => void;
	children?: React.ReactNode;
	onSelect: (value: string) => void;
	size?: 'small' | 'medium';
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
	showLabel = false,
	size = 'small',
}) => {
	const comboboxSize = size === 'medium' ? '3rem' : '2rem';
	return (
		<div className={styles.form}>
			<div className="mb-2">
				<Label htmlFor={inputId} size={size} className={`${showLabel ? '' : 'navds-sr-only'}`}>
					{label}
				</Label>
			</div>
			{description && (
				<BodyShort size={size} as="div" id={descriptionId} className="navds-form-field__description">
					{description}
				</BodyShort>
			)}
			<Combobox className={`navds-search__wrapper ${styles.searchWrapper}`} onSelect={onSelect} openOnFocus>
				<div className="flex">
					<div className="navds-search__wrapper-inner">
						<ComboboxInput
							id={inputId}
							autoComplete="off"
							aria-describedby={descriptionId}
							// eslint-disable-next-line max-len
							className="navds-search__input navds-search__input--secondary navds-text-field__input navds-body-short navds-body--small py-0"
							style={{ minHeight: comboboxSize }}
							onChange={onChange}
							value={currentInput}
							onFocus={() => setIsPopoverOpen(true)}
						/>
					</div>
					<button
						type="button"
						// eslint-disable-next-line max-len
						className={`${styles.searchButton} navds-button navds-button--primary navds-button--medium navds-button--icon-only p-1`}
						style={{ minWidth: comboboxSize, minHeight: comboboxSize }}
						onClick={() => setIsPopoverOpen(true)}
						aria-label="search button"
					>
						<span className="navds-button__icon">
							<Search />
						</span>
					</button>
				</div>
				<div className="relative w-full">{children}</div>
			</Combobox>
		</div>
	);
};

export default SearchForm;
