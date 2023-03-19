import React, { FunctionComponent, useMemo } from 'react';
import { IntlShape, WrappedComponentProps, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Lukknapp from 'nav-frontend-lukknapp';
import { Undertekst } from 'nav-frontend-typografi';
import EventType from 'api/rest-api/src/requestApi/eventType';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import styles from './errorMessagePanel.css';

export const getErrorMessageList = (
  intl: IntlShape,
  queryStrings: { errorcode?: string; errormessage?: string },
  allErrorMessages = [],
): string[] => {
  const errorMessages = [];
  if (queryStrings.errorcode) {
    errorMessages.push(intl.formatMessage({ id: queryStrings.errorcode }));
  }
  if (queryStrings.errormessage) {
    errorMessages.push(queryStrings.errormessage);
  }
  allErrorMessages.forEach(message =>
    errorMessages.push(message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text),
  );
  return errorMessages;
};

interface OwnProps {
  errorMessages?: {
    type: EventType;
    code?: string;
    params?: {
      errorDetails?: string;
      location?: string;
    };
    text?: string;
  }[];
  queryStrings: {
    errormessage?: string;
    errorcode?: string;
  };
  removeErrorMessages: () => void;
}

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
const ErrorMessagePanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  errorMessages,
  queryStrings,
  removeErrorMessages,
}) => {
  const feilmeldinger = useMemo(
    () => getErrorMessageList(intl, queryStrings, errorMessages),
    [queryStrings, errorMessages],
  );

  if (feilmeldinger.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {feilmeldinger.length !== 0 &&
        feilmeldinger.map(message => (
          <Row key={message}>
            <Column xs="11">
              <Undertekst className={styles.wordWrap}>{`${decodeHtmlEntity(message)} `}</Undertekst>
            </Column>
          </Row>
        ))}

      <div className={styles.lukkContainer}>
        <Lukknapp hvit onClick={removeErrorMessages}>
          {intl.formatMessage({ id: 'ErrorMessagePanel.Close' })}
        </Lukknapp>
      </div>
    </div>
  );
};

export default injectIntl(ErrorMessagePanel);
