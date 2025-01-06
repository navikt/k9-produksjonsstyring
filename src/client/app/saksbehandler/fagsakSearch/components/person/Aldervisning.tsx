import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { BodyShort } from '@navikt/ds-react';
import DateLabel from 'sharedComponents/DateLabel';
import * as styles from './aldervisning.css';

interface TsProps {
	doedsdato?: string;
}

/**
 * AlderVisning
 *
 * Presentasjonskomponent. Definerer visning av personens alder. (Søker)
 */
const AlderVisning = ({ doedsdato }: TsProps) => (
	<BodyShort size="small" className={styles.displayInline}>
		{doedsdato ? <DateLabel dateString={doedsdato} /> : <FormattedMessage id="Person.ManglerDodsdato" />}
	</BodyShort>
);
AlderVisning.propTypes = {
	doedsdato: PropTypes.string,
};

AlderVisning.defaultProps = {
	doedsdato: '',
};

export default AlderVisning;
