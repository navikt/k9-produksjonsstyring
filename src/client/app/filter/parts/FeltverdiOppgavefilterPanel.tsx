import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { BodyShort, Checkbox, CheckboxGroup, Heading, Panel, Select, TextField } from '@navikt/ds-react';
import AksjonspunktVelger from 'avdelingsleder/behandlingskoerV2/components/AksjonspunktVelger';
import styles from '../filterIndex.css';
import { FeltverdiOppgavefilter, Oppgavefelt, Oppgavefilter, TolkesSom } from '../filterTsTypes';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import FjernFilterButton from './FjernFilterButton';
import SearchDropdownMedPredefinerteVerdier from './SearchDropdownMedPredefinerteVerdier';

dayjs.extend(duration);

interface OwnProps {
	felter: Oppgavefelt[];
	oppgavefilter: FeltverdiOppgavefilter;
	onOppdaterFilter: (id: string, data: object) => void;
	onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

function renderFilterOperator(
	oppgavefilter: FeltverdiOppgavefilter,
	onOppdaterFilter: (id: string, data: object) => void,
	isUsingPredefinedValues: boolean,
) {
	const handleChangeOperator = (event) => {
		onOppdaterFilter(oppgavefilter.id, {
			operator: event.target.value,
		});
	};

	return (
		<Select
			label=""
			value={oppgavefilter.operator}
			onChange={handleChangeOperator}
			className={classNames({ 'mt-[55px]': isUsingPredefinedValues })}
		>
			<option value="EQUALS">er lik</option>
			<option value="NOT_EQUALS">er IKKE lik</option>
			<option value="IN">inneholder</option>
			<option value="NOT_IN">inneholder IKKE</option>
			<option value="LESS_THAN">mindre enn (&#60;)</option>
			<option value="GREATER_THAN">større enn (&#62;)</option>
			<option value="LESS_THAN_OR_EQUALS">mindre enn eller lik (&#60;=)</option>
			<option value="GREATER_THAN_OR_EQUALS">større enn eller lik (&#62;=)</option>
		</Select>
	);
}

const dagerInitialValue = (verdi: any) => {
	const days = dayjs.duration(verdi).asDays();
	if (Number.isNaN(days)) {
		return undefined;
	}
	return days;
};

const FilterOperatorOgVerdi = ({
	feltdefinisjon,
	oppgavefilter,
	onOppdaterFilter,
	isUsingPredefinedValues,
}: {
	feltdefinisjon: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
	onOppdaterFilter: (id: string, data: object) => void;
	isUsingPredefinedValues: boolean;
}) => {
	const [dager, setDager] = useState<number | undefined>(dagerInitialValue(oppgavefilter.verdi));

	const handleChangeValue = (value) => {
		onOppdaterFilter(oppgavefilter.id, {
			verdi: value,
		});
	};

	const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDays = parseFloat(e.target.value);
		setDager(newDays);
		const newDuration = dayjs.duration(newDays, 'days').toISOString();
		handleChangeValue(newDuration);
	};

	const aksjonspunktKoder = ['aksjonspunkt', 'aktivtAksjonspunkt', 'løsbartAksjonspunkt'];
	if (aksjonspunktKoder.includes(feltdefinisjon.kode)) {
		return (
			<div className="max-w-500">
				{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
				<AksjonspunktVelger
					onChange={handleChangeValue}
					feltdefinisjon={feltdefinisjon}
					oppgavefilter={oppgavefilter}
				/>
			</div>
		);
	}

	if (feltdefinisjon.tolkes_som === TolkesSom.Duration) {
		return (
			<>
				{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
				<TextField
					label=""
					value={dager}
					onChange={handleDaysChange}
					type="number"
					placeholder="Antall dager"
					min="0"
				/>
				<BodyShort className="flex justify-center">dager</BodyShort>
			</>
		);
	}

	if (feltdefinisjon.tolkes_som === TolkesSom.Boolean) {
		return (
			<CheckboxGroup
				className={styles.feltvalgCheckboxes}
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeValue}
				value={oppgavefilter.verdi}
			>
				<Checkbox value="ja">Ja</Checkbox>
				<Checkbox value="nei">Nei</Checkbox>
				<Checkbox value="ikkeSatt">Ikke satt</Checkbox>
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length > 0
	) {
		return (
			<div className="max-w-500">
				{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
				<SearchDropdownMedPredefinerteVerdier
					feltdefinisjon={feltdefinisjon}
					onChange={handleChangeValue}
					oppgavefilter={oppgavefilter}
				/>
			</div>
		);
	}

	return (
		<>
			{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
			<TextField label="" value={oppgavefilter.verdi} onChange={(e) => handleChangeValue(e.target.value)} />
		</>
	);
};

function finnFeltdefinisjon(felter, område: string, kode: string) {
	return felter.find((fd) => fd.område === område && fd.kode === kode);
}
const harVerdiforklaringer = (feltdefinisjon: Oppgavefelt) =>
	Array.isArray(feltdefinisjon?.verdiforklaringer) && feltdefinisjon?.verdiforklaringer?.length > 0;

const FeltverdiOppgavefilterPanel = ({ felter, oppgavefilter, onOppdaterFilter, onFjernFilter }: OwnProps) => {
	const feltdefinisjon = finnFeltdefinisjon(felter, oppgavefilter.område, oppgavefilter.kode);
	const [isUsingPredefinedValues, setIsUsingPredefinedValues] = React.useState(harVerdiforklaringer(feltdefinisjon));

	useEffect(() => {
		setIsUsingPredefinedValues(harVerdiforklaringer(feltdefinisjon));
	}, [JSON.stringify(feltdefinisjon)]);

	const handleChangeKey = (event) => {
		const område = områdeFraKey(event.target.value);
		const kode = kodeFraKey(event.target.value);

		if (feltdefinisjon && feltdefinisjon.tolkes_som === 'boolean') {
			onOppdaterFilter(oppgavefilter.id, {
				område,
				kode,
				operator: 'EQUALS',
				verdi: [],
			});
		} else {
			onOppdaterFilter(oppgavefilter.id, {
				område,
				kode,
				operator: 'EQUALS',
				verdi: '',
			});
		}
	};
	return (
		<Panel className={`${styles.filter} ${styles.filterFelt}`} key={oppgavefilter.id} border>
			<FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
			<Heading level="5" size="xsmall">
				Felt
			</Heading>
			<div className="flex">
				<Select
					label=""
					value={feltverdiKey(oppgavefilter)}
					onChange={handleChangeKey}
					className={classNames({ 'mt-[55px]': isUsingPredefinedValues })}
				>
					<option value="">Velg felt</option>
					{felter.map((fd) => (
						<option key={feltverdiKey(fd)} value={feltverdiKey(fd)}>
							{fd.visningsnavn}
						</option>
					))}
				</Select>
				{oppgavefilter.kode && (
					<FilterOperatorOgVerdi
						feltdefinisjon={feltdefinisjon}
						oppgavefilter={oppgavefilter}
						onOppdaterFilter={onOppdaterFilter}
						isUsingPredefinedValues={isUsingPredefinedValues}
					/>
				)}
			</div>
		</Panel>
	);
};

export default FeltverdiOppgavefilterPanel;
