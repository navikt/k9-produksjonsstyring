import React, { FunctionComponent } from 'react';
import {
  injectIntl, WrappedComponentProps, FormattedMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Image from 'sharedComponents/Image';
import advarselIcon from 'images/advarsel.svg';
import { hasValidSaksnummerOrFodselsnummerFormat } from 'utils/validation/validators';
import { InputField } from 'form/FinalFields';

import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import NavAnsatt from 'app/navAnsattTsType';
import useGlobalStateRestApiData from 'api/rest-api-hooks/global-data/useGlobalStateRestApiData';
import styles from './searchForm.less';

const isButtonDisabled = (searchString, searchStarted, searchResultAccessDenied) => (!searchResultAccessDenied.feilmelding && searchStarted) || !searchString;

const erIDev = () => window.location.hostname.includes('dev.adeo.no');

interface OwnProps {
  onSubmit: ({ searchString: string, skalReservere: boolean }) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
}

const infoText = {
  aPdl: <a href="https://navikt.github.io/pdl/">PDL</a>,
  aK9sak: <a href="https://app-q1.adeo.no/k9/web/"> K9-sak</a>,
  br: <br />,
};

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  onSubmit,
  searchStarted,
  searchResultAccessDenied,
}) => {
  const { kanSaksbehandle } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, values }) => (
        <form className={styles.container} onSubmit={handleSubmit}>
          { erIDev() && (
            <p className={styles.info}>
              {intl.formatMessage({ id: 'Search.Info' }, infoText)}
            </p>
          )}
          <Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
          {kanSaksbehandle && (
            <>
              <VerticalSpacer sixteenPx />
            </>
          )}
          <VerticalSpacer eightPx />
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <InputField
                  name="searchString"
                  parse={(s = '') => s.trim()}
                  label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
                  bredde="L"
                  validate={[hasValidSaksnummerOrFodselsnummerFormat]}
                />
              </FlexColumn>
              <FlexColumn>
                <Knapp
                  mini
                  htmlType="submit"
                  className={styles.button}
                  spinner={!searchResultAccessDenied.feilmelding && searchStarted}
                  disabled={isButtonDisabled(values.searchString, searchStarted, searchResultAccessDenied)}
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
      )}
    />
  );
};

SearchForm.defaultProps = {
  searchResultAccessDenied: {
    feilmelding: undefined,
  },
};

export default injectIntl(SearchForm);
