import React from 'react';
import classNames from 'classnames';
import { Checkbox, CheckboxGroup, Heading, Panel, Select, TextField } from '@navikt/ds-react';
import AksjonspunktVelger from 'avdelingsleder/behandlingskoerV2/components/AksjonspunktVelger';
import styles from '../filterIndex.css';
import { FeltverdiOppgavefilter, Oppgavefelt, Oppgavefilter } from '../filterTsTypes';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../utils';
import FjernFilterButton from './FjernFilterButton';
import SearchDropdownMedPredefinerteVerdier from './SearchDropdownMedPredefinerteVerdier';

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

function renderFilterOperatorOgVerdi(
	feltdefinisjon: Oppgavefelt,
	oppgavefilter: FeltverdiOppgavefilter,
	onOppdaterFilter: (id: string, data: object) => void,
	isUsingPredefinedValues: boolean,
) {
	const aksjonspunktKoder = ['aksjonspunkt', 'aktivtAksjonspunkt', 'løsbartAksjonspunkt'];
	if (aksjonspunktKoder.includes(feltdefinisjon.kode)) {
		return (
			<>
				{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
				<AksjonspunktVelger
					onChange={(aksjonspunkter) =>
						onOppdaterFilter(oppgavefilter.id, {
							verdi: aksjonspunkter,
						})
					}
					valgteAksjonspunkter={oppgavefilter.verdi}
				/>
			</>
		);
	}
	if (feltdefinisjon.tolkes_som === 'boolean') {
		const handleChangeValue = (event) => {
			onOppdaterFilter(oppgavefilter.id, {
				verdi: event,
			});
		};

		return (
			<CheckboxGroup
				className={styles.feltvalgCheckboxes}
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeValue}
			>
				<Checkbox value="ja">Ja</Checkbox>
				<Checkbox value="nei">Nei</Checkbox>
				<Checkbox value="ikkeSatt">Ikke satt</Checkbox>
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon.tolkes_som === 'String' &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length > 0
	) {
		return (
			<>
				{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
				<SearchDropdownMedPredefinerteVerdier
					feltdefinisjon={feltdefinisjon}
					onChange={(values) =>
						onOppdaterFilter(oppgavefilter.id, {
							verdi: values,
						})
					}
				/>
			</>
		);
	}

	const handleChangeValue = (event) => {
		onOppdaterFilter(oppgavefilter.id, {
			verdi: event.target.value,
		});
	};

	return (
		<>
			{renderFilterOperator(oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
			<TextField label="" value={oppgavefilter.verdi} onChange={handleChangeValue} />
		</>
	);
}

function finnFeltdefinisjon(felter, område: string, kode: string) {
	return felter.find((fd) => fd.område === område && fd.kode === kode);
}

const FeltverdiOppgavefilterPanel = ({ felter, oppgavefilter, onOppdaterFilter, onFjernFilter }: OwnProps) => {
	const [isUsingPredefinedValues, setIsUsingPredefinedValues] = React.useState(false);

	const handleChangeKey = (event) => {
		const område = områdeFraKey(event.target.value);
		const kode = kodeFraKey(event.target.value);
		const feltdefinisjon = finnFeltdefinisjon(felter, område, kode);

		if (feltdefinisjon && feltdefinisjon.verdiforklaringer && feltdefinisjon.verdiforklaringer.length > 0) {
			if (!isUsingPredefinedValues) {
				setIsUsingPredefinedValues(true);
			}
		} else if (isUsingPredefinedValues) {
			setIsUsingPredefinedValues(false);
		}

		if (feltdefinisjon && feltdefinisjon.tolkes_som === 'boolean') {
			onOppdaterFilter(oppgavefilter.id, {
				område,
				kode,
				operator: 'EQUALS',
				verdi: 'false',
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
	const feltdefinisjon = finnFeltdefinisjon(felter, oppgavefilter.område, oppgavefilter.kode);
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
				{oppgavefilter.kode &&
					renderFilterOperatorOgVerdi(feltdefinisjon, oppgavefilter, onOppdaterFilter, isUsingPredefinedValues)}
			</div>
		</Panel>
	);
};

export default FeltverdiOppgavefilterPanel;
