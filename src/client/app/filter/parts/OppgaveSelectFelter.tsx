import React, { useContext } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Delete } from '@navikt/ds-icons';
import { Button, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { addSelectFelt, removeSelectFelt, updateSelectFelt } from 'filter/queryUtils';
import { feltverdiKey } from '../utils';
import styles from './OppgaveSelectFelter.css';

const OppgaveSelectFelter = () => {
	const { felter } = useContext(AppContext);
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const handleRemove = (felt) => {
		updateQuery([removeSelectFelt(felt.id)]);
	};

	const handleAdd = () => {
		updateQuery([addSelectFelt()]);
	};

	const handleUpdate = (felt, newValue) => {
		updateQuery([updateSelectFelt(felt.id, newValue)]);
	};

	return (
		<div>
			{oppgaveQuery?.select?.map((felt) => (
				<div className={styles.selectEnkelFelt} key={felt.id}>
					<Select
						hideLabel
						label="Velg felt"
						className={styles.noGap}
						value={feltverdiKey(felt)}
						onChange={(event) => handleUpdate(felt, event.target.value)}
					>
						<option value="">Velg felt</option>
						{felter.map((feltdefinisjon) => (
							<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
								{feltdefinisjon.visningsnavn}
							</option>
						))}
					</Select>
					<Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => handleRemove(felt)} />
				</div>
			))}
			<Button icon={<PlusCircleIcon aria-hidden />} size="small" variant="tertiary" onClick={handleAdd}>
				Legg til felt som skal vises i søkeresultat
			</Button>
		</div>
	);
};

export default OppgaveSelectFelter;
