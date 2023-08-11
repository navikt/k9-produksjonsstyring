import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Heading, Panel, Select } from '@navikt/ds-react';
import styles from '../../filterIndex.css';
import { FeltverdiOppgavefilter, Oppgavefelt, Oppgavefilter } from '../../filterTsTypes';
import { feltverdiKey, kodeFraKey, områdeFraKey } from '../../utils';
import FilterOperatorOgVerdi from '../FilterOperatorOgVerdi';
import FjernFilterButton from '../FjernFilterButton';
import OperatorSelect from '../OperatorSelect';
import { generateId } from './idGenerator';

interface Props {
	felter: Oppgavefelt[];
	oppgavefilter: FeltverdiOppgavefilter;
	onOppdaterFilter: (id: string, data: object) => void;
	onFjernFilter: (oppgavefilter: Oppgavefilter) => void;
}

const FeltverdiOppgavefilterPanel: React.FC<Props> = ({ felter, oppgavefilter, onOppdaterFilter, onFjernFilter }) => {
	const testID = useMemo(() => generateId(), []);
	const [feltdefinisjon, setFeltdefinisjon] = useState<Oppgavefelt | undefined>();
	const [isUsingPredefinedValues, setIsUsingPredefinedValues] = useState<boolean>(false);

	useEffect(() => {
		const feltdef = felter.find((fd) => fd.område === oppgavefilter.område && fd.kode === oppgavefilter.kode);
		setFeltdefinisjon(feltdef);
		setIsUsingPredefinedValues(!!feltdef?.verdiforklaringer?.length);
	}, [felter, oppgavefilter.område, oppgavefilter.kode]);

	const handleChangeKey = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const område = områdeFraKey(event.target.value);
		const kode = kodeFraKey(event.target.value);

		const updateData = { område, kode, operator: 'EQUALS', verdi: feltdefinisjon?.tolkes_som === 'boolean' ? [] : '' };
		onOppdaterFilter(oppgavefilter.id, updateData);
	};

	const options = useMemo(
		() =>
			felter.map((fd) => (
				<option key={feltverdiKey(fd)} value={feltverdiKey(fd)}>
					{fd.visningsnavn}
				</option>
			)),
		[felter],
	);

	return (
		<Panel className={`${styles.filter} ${styles.filterFelt}`} key={oppgavefilter.id} id={`feltpanel-${testID}`} border>
			<FjernFilterButton oppgavefilter={oppgavefilter} onFjernFilter={onFjernFilter} />
			<Heading level="5" size="xsmall">
				Felt
			</Heading>
			<div className="flex">
				<Select
					label="Felt"
					hideLabel
					value={feltverdiKey(oppgavefilter)}
					onChange={handleChangeKey}
					className={classNames({ 'mt-[55px]': isUsingPredefinedValues })}
				>
					<option value="">Velg felt</option>
					{options}
				</Select>
				{oppgavefilter.kode && (
					<>
						<OperatorSelect
							oppgavefilter={oppgavefilter}
							onOppdaterFilter={onOppdaterFilter}
							isUsingPredefinedValues={isUsingPredefinedValues}
						/>
						<FilterOperatorOgVerdi
							feltdefinisjon={feltdefinisjon}
							oppgavefilter={oppgavefilter}
							onOppdaterFilter={onOppdaterFilter}
						/>
					</>
				)}
			</div>
		</Panel>
	);
};

export default FeltverdiOppgavefilterPanel;
