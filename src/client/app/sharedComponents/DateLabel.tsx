import React from 'react';
import { FormattedDate } from 'react-intl';

interface DateLabelProps {
	dateString: string;
}

/**
 * DateLabel
 *
 * Presentasjonskomponent. Formaterer dato på formatet dd.mm.yyyy.
 * @deprecatedƒ
 * Eksempel:
 * ```html
 * <DateLabel dateString="2017-08-31" />
 * ```
 */
const DateLabel = ({ dateString }: DateLabelProps) => (
	<FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateString)} />
);

export default DateLabel;
