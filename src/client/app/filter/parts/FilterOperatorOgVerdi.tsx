import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
	BodyShort,
	Checkbox,
	CheckboxGroup,
	TextField,
	UNSAFE_DatePicker,
	UNSAFE_useDatepicker,
} from '@navikt/ds-react';
import AksjonspunktVelger from 'avdelingsleder/behandlingskoerV2/components/AksjonspunktVelger';
import { FeltverdiOppgavefilter, Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
import { aksjonspunktKoder } from 'filter/konstanter';
import { calculateDays, mapBooleanToStringArray, mapStringToBooleanArray } from 'filter/utils';
import styles from '../filterIndex.css';
import SearchDropdownMedPredefinerteVerdier from './SearchDropdownMedPredefinerteVerdier';

const useChangeValue = (oppgavefilter, onOppdaterFilter) => (value) => {
	const trimmedValue = typeof value === 'string' ? value.trim() : value;
	onOppdaterFilter(oppgavefilter.id, {
		verdi: trimmedValue,
	});
};

const useDatepickerSafely = (config) => {
	const { fromDate, onDateChange, defaultSelected } = config;

	const safeFromDate = dayjs(fromDate).isValid() ? fromDate : undefined;
	const safeDefaultSelected = dayjs(defaultSelected).isValid() ? defaultSelected : undefined;

	return UNSAFE_useDatepicker({
		fromDate: safeFromDate,
		onDateChange,
		defaultSelected: safeDefaultSelected,
	});
};

const FilterOperatorOgVerdi = ({
	feltdefinisjon,
	oppgavefilter,
	onOppdaterFilter,
}: {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
	onOppdaterFilter: (id: string, data: object) => void;
}) => {
	const [dager, setDager] = useState<number | undefined>(calculateDays(oppgavefilter.verdi));
	const handleChangeValue = useChangeValue(oppgavefilter, onOppdaterFilter);

	const handleChangeBoolean = (values: string[]) => {
		const mappedValues: (string | null)[] = mapStringToBooleanArray(values);

		onOppdaterFilter(oppgavefilter.id, {
			verdi: mappedValues,
		});
	};

	const onDateChange = (date) => {
		if (!date) {
			return;
		}
		const timezoneOffset = date.getTimezoneOffset() * 60000;
		const newDate = new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];
		handleChangeValue(newDate);
	};

	const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
		fromDate: new Date('Aug 23 2017'),
		onDateChange,
		defaultSelected: dayjs(new Date(oppgavefilter.verdi)).isValid() ? new Date(oppgavefilter.verdi) : undefined,
	});

	const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDays = parseFloat(e.target.value);
		setDager(newDays);
		const newDuration = dayjs.duration(newDays, 'days').toISOString();
		handleChangeValue(newDuration);
	};

	if (aksjonspunktKoder.includes(feltdefinisjon?.kode)) {
		return (
			<div className="w-[500px]">
				<AksjonspunktVelger
					onChange={handleChangeValue}
					feltdefinisjon={feltdefinisjon}
					oppgavefilter={oppgavefilter}
				/>
			</div>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Duration) {
		return (
			<>
				<TextField
					label=""
					value={dager}
					onChange={handleDaysChange}
					type="number"
					placeholder="Antall dager"
					min="0"
				/>
				<BodyShort className="self-center">dager</BodyShort>
			</>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Timestamp) {
		return (
			<div className="mt-[-7px]">
				<UNSAFE_DatePicker {...datepickerProps}>
					<UNSAFE_DatePicker.Input {...inputProps} />
				</UNSAFE_DatePicker>
			</div>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Boolean) {
		return (
			<CheckboxGroup
				className={styles.feltvalgCheckboxes}
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeBoolean}
				value={mapBooleanToStringArray(oppgavefilter.verdi || [])}
			>
				<Checkbox value="ja">Ja</Checkbox>
				<Checkbox value="nei">Nei</Checkbox>
				<Checkbox value="ikkeSatt">Ikke satt</Checkbox>
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon?.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length > 0
	) {
		return (
			<div className="w-[500px]">
				<SearchDropdownMedPredefinerteVerdier
					feltdefinisjon={feltdefinisjon}
					onChange={handleChangeValue}
					oppgavefilter={oppgavefilter}
				/>
			</div>
		);
	}

	return <TextField label="" value={oppgavefilter.verdi} onChange={(e) => handleChangeValue(e.target.value)} />;
};

export default FilterOperatorOgVerdi;
