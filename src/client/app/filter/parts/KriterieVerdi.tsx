import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { Checkbox, CheckboxGroup, DatePicker, TextField, useDatepicker } from '@navikt/ds-react';
import AksjonspunktVelger from 'avdelingsleder/behandlingskoerV2/components/AksjonspunktVelger';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
import { aksjonspunktKoder } from 'filter/konstanter';
import { updateFilter } from 'filter/queryUtils';
import { calculateDays, mapBooleanToStringArray, mapStringToBooleanArray } from 'filter/utils';
import styles from '../filterIndex.css';
import MultiSelectKriterie from './MultiSelectKriterie';

const useChangeValue = (oppgavefilter, updateQuery) => (value) => {
	const trimmedValue = typeof value === 'string' ? value.trim() : value;
	updateQuery([
		updateFilter(oppgavefilter.id, {
			verdi: trimmedValue,
		}),
	]);
};

const KriterieVerdi = ({
	feltdefinisjon,
	oppgavefilter,
}: {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
}) => {
	const { updateQuery } = useContext(FilterContext);

	const handleChangeValue = useChangeValue(oppgavefilter, updateQuery);

	const handleChangeBoolean = (values: string[]) => {
		const mappedValues: (string | null)[] = mapStringToBooleanArray(values);

		updateQuery([
			updateFilter(oppgavefilter.id, {
				verdi: mappedValues,
			}),
		]);
	};
	const onDateChange = (date) => {
		if (!date) {
			return;
		}
		const timezoneOffset = date.getTimezoneOffset() * 60000;
		const newDate = new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];
		handleChangeValue(newDate);
	};
	const initialDate =
		oppgavefilter.verdi && dayjs(new Date(oppgavefilter.verdi)).isValid() ? new Date(oppgavefilter.verdi) : undefined;
	const { datepickerProps, inputProps } = useDatepicker({
		fromDate: new Date('23 2017'),
		onDateChange,
		defaultSelected: initialDate,
	});

	const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDays = parseFloat(e.target.value);
		const newDuration = dayjs.duration(newDays, 'days').toISOString();
		handleChangeValue([newDuration]);
	};

	if (aksjonspunktKoder.includes(feltdefinisjon?.kode)) {
		return (
			<AksjonspunktVelger onChange={handleChangeValue} feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} />
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Duration) {
		return (
			<TextField
				label="Antall dager"
				size="small"
				hideLabel
				value={calculateDays(oppgavefilter.verdi)}
				onChange={handleDaysChange}
				type="number"
				placeholder="Antall dager"
				min="0"
			/>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Timestamp) {
		return (
			<DatePicker {...datepickerProps}>
				<DatePicker.Input {...inputProps} size="small" label="Velg dato" hideLabel />
			</DatePicker>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Boolean) {
		return (
			<CheckboxGroup
				size="small"
				className={`${styles.feltvalgCheckboxes}`}
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeBoolean}
				value={mapBooleanToStringArray(oppgavefilter.verdi || [])}
			>
				<Checkbox value="ja">Ja</Checkbox>
				<Checkbox value="nei">Nei</Checkbox>
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon?.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length &&
		feltdefinisjon.verdiforklaringer.length < 4
	) {
		return (
			<CheckboxGroup
				className={`${styles.feltvalgCheckboxes}`}
				size="small"
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeValue}
				value={oppgavefilter.verdi}
			>
				{feltdefinisjon.verdiforklaringer.map((verdiforklaring) => (
					<Checkbox key={verdiforklaring.visningsnavn} value={verdiforklaring.verdi}>
						{verdiforklaring.visningsnavn}
					</Checkbox>
				))}
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon?.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length &&
		feltdefinisjon.verdiforklaringer.length > 3
	) {
		return (
			// eslint-disable-next-line react/jsx-pascal-case, camelcase
			<MultiSelectKriterie feltdefinisjon={feltdefinisjon} oppgavefilter={oppgavefilter} />
		);
	}

	return (
		<TextField
			label="Skriv fritekst"
			size="small"
			hideLabel
			value={oppgavefilter.verdi}
			onChange={(e) => handleChangeValue(e.target.value)}
		/>
	);
};

export default KriterieVerdi;
