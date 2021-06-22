import React, { FunctionComponent, useMemo } from 'react';
import { injectIntl, WrappedComponentProps, IntlShape } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import advarselImageUrl from 'images/advarsel-sirkel-fyll.svg';

import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import EventType from 'api/rest-api/src/requestApi/eventType';

import Image from 'sharedComponents/Image';
import moment from 'moment';
import { DD_MM_HHMM } from 'utils/formats';
import styles from './errorMessagePanel.less';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';

export const getErrorMessageList = (intl: IntlShape, queryStrings: { errorcode?: string; errormessage?: string}, allErrorMessages = []): string[] => {
  const errorMessages = [];
  if (queryStrings.errorcode) {
    errorMessages.push(intl.formatMessage({ id: queryStrings.errorcode }));
  }
  if (queryStrings.errormessage) {
    errorMessages.push(queryStrings.errormessage);
  }
  allErrorMessages.forEach((message) => errorMessages.push(message.code ? intl.formatMessage({ id: message.code }, message.params) : message.text));
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
  driftsmeldinger: Driftsmelding[];
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
  driftsmeldinger,
}) => {
  const feilmeldinger = useMemo(() => getErrorMessageList(intl, queryStrings, errorMessages), [queryStrings, errorMessages]);

  const aktiveDriftsmeldinger = driftsmeldinger.filter((message) => message.aktiv);

  if (feilmeldinger.length === 0 && aktiveDriftsmeldinger.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {feilmeldinger.length !== 0 && feilmeldinger.map((message) => (
        <Row key={message}>
          <Column xs="11">
            <Undertekst className={styles.wordWrap}>
              {`${decodeHtmlEntity(message)} `}
            </Undertekst>
          </Column>
        </Row>
      ))}
      {aktiveDriftsmeldinger.length !== 0 && aktiveDriftsmeldinger.map((message) => (
        <Row key={message.id}>
          <Column xs="11" className={styles.column}>
            <Image
              className={styles.image}
              src={advarselImageUrl}
            />
            <Undertekst className={styles.wordWrap}>
              {`${message.melding}. (Registrert ${moment(message.aktivert).format(DD_MM_HHMM)})`}
            </Undertekst>
          </Column>
        </Row>
      ))}
    </div>
  );
};

export default injectIntl(ErrorMessagePanel);
