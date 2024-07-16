import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidSaksnummerOrFodselsnummerFormat } from 'utils/validation/validators';
import * as styles from './searchForm.css';
import { Button, TextField } from '@navikt/ds-react';

const isButtonDisabled = (searchString: string, searchStarted: boolean) => searchStarted || !searchString;

interface OwnProps {
	onSubmit: (searchString: string) => void;
	searchStarted: boolean;
	searchResultAccessDenied?: {
		feilmelding?: string;
	};
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm: FunctionComponent<OwnProps> = ({ onSubmit, searchStarted }) => {
	const intl = useIntl();
	const [searchString, setSearchString] = useState<string>('');
	const [error, setError] = useState<{ id: string } | undefined>(undefined);
	const prevSearchStringRef = useRef<string>('');

	useEffect(() => {
		if (error && searchString !== prevSearchStringRef.current) {
			setError(undefined);
		}
		prevSearchStringRef.current = searchString;
	}, [searchString, error]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const error = hasValidSaksnummerOrFodselsnummerFormat(searchString);
		if (!error) {
			onSubmit(searchString);
		} else {
			setError(error[0]);
		}
	};
	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<div className="flex">
				<TextField
					label="Søk på saksnummer, personnummer eller journalpostID"
					value={searchString}
					onChange={(e) => setSearchString(e.target.value)}
					error={error && intl.formatMessage(error)}
					size="medium"
				/>
				<div className="relative ml-6">
					<Button
						className="absolute bottom-0"
						variant="primary"
						type="submit"
						loading={searchStarted}
						disabled={isButtonDisabled(searchString, searchStarted)}
					>
						Søk
					</Button>
				</div>
			</div>
		</form>
	);
};

export default SearchForm;
