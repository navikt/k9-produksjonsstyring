import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import advarselIcon from 'images/advarsel.svg';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { InputField } from 'form/FinalFields';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidSaksnummerOrFodselsnummerFormat } from 'utils/validation/validators';
import * as styles from './searchForm.css';
import { Loader, TextField } from '@navikt/ds-react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';

const isButtonDisabled = (
	searchString: string,
	searchStarted: boolean,
	searchResultAccessDenied: { feilmelding?: string },
) => (!searchResultAccessDenied.feilmelding && searchStarted) || !searchString;

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
export const SearchForm: FunctionComponent<OwnProps> = ({ onSubmit, searchStarted, searchResultAccessDenied = {} }) => {
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

	const handleSubmit = () => {
		const error = hasValidSaksnummerOrFodselsnummerFormat(searchString);
		if (!error) {
			onSubmit(searchString);
		} else {
			setError(error[0]);
		}
	};
	console.log(error);
	return (
		<form className={styles.container} onSubmit={handleSubmit}>
			<Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
			<VerticalSpacer eightPx />
			<FlexContainer>
				<FlexRow>
					<FlexColumn>
						<TextField
							label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
							value={searchString}
							onChange={(e) => setSearchString(e.target.value)}
							error={error && intl.formatMessage(error)}
							size="small"
						/>
					</FlexColumn>
					<FlexColumn>
						<Knapp
							mini
							htmlType="submit"
							className={styles.button}
							spinner={!searchResultAccessDenied.feilmelding && searchStarted}
							disabled={isButtonDisabled(searchString, searchStarted, searchResultAccessDenied)}
						>
							<FormattedMessage id="Search.Search" />
						</Knapp>
					</FlexColumn>
				</FlexRow>
				{searchResultAccessDenied.feilmelding && (
					<>
						<VerticalSpacer eightPx />
						<FlexRow>
							<FlexColumn>
								<Image className={styles.advarselIcon} src={advarselIcon} />
							</FlexColumn>
							<FlexColumn>
								<FormattedMessage id={searchResultAccessDenied.feilmelding} />
							</FlexColumn>
						</FlexRow>
					</>
				)}
			</FlexContainer>
		</form>
	);
};

export default SearchForm;
