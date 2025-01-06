import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

/**
 * DateTimeLabel
 *
 * Presentasjonskomponent. Formaterer dato til formatet dd.mm.yyyy - hh:mm.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const DateTimeLabel = ({ dateTimeString }) => (
	<div>
		<FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateTimeString)} />
		{' - '}
		<FormattedTime value={new Date(dateTimeString)} />
	</div>
);

DateTimeLabel.propTypes = {
	dateTimeString: PropTypes.string.isRequired,
};

export default DateTimeLabel;
