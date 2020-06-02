
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import DateLabel from 'sharedComponents/DateLabel';

import styles from './aldervisning.less';

interface TsProps {

  doedsdato?: string;
}

/**
 * AlderVisning
 *
 * Presentasjonskomponent. Definerer visning av personens alder. (Søker)
 */
const AlderVisning = ({

  doedsdato,
}: TsProps) => (
  <Normaltekst className={styles.displayInline}>
    {doedsdato
      ? <DateLabel dateString={doedsdato} />
      : <FormattedMessage id="Person.ManglerDodsdato" />}
  </Normaltekst>
);
AlderVisning.propTypes = {
  doedsdato: PropTypes.string,
};

AlderVisning.defaultProps = {
  doedsdato: '',
};

export default AlderVisning;
