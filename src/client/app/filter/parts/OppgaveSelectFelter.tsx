import React from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Delete } from '@navikt/ds-icons';
import { Button, Select } from '@navikt/ds-react';
import { EnkelSelectFelt, OppgaveQuery, Oppgavefelt } from '../filterTsTypes';
import { feltverdiKey } from '../utils';
import styles from './OppgaveSelectFelter.css';

interface OwnProps {
	felter: Oppgavefelt[];
	oppgaveQuery: OppgaveQuery;
	onLeggTil: () => void;
	onOppdater: (sf: EnkelSelectFelt, verdi: string) => void;
	onFjern: (sf: EnkelSelectFelt) => void;
}

const renderFjernSelectFeltKnapp = (felt, onFjern) => (
	<Button icon={<Delete aria-hidden />} size="medium" variant="tertiary" onClick={() => onFjern(felt)} />
);

const renderAddEnkelSelectFeltKnapp = (onLeggTil) => (
	<Button icon={<PlusCircleIcon aria-hidden />} size="small" variant="tertiary" onClick={() => onLeggTil()}>
		Legg til felt som skal vises i søkeresultat
	</Button>
);

const renderSelectFelt = (felter, felt, onOppdater, onFjern) => (
	<div className={styles.selectEnkelFelt} key={felt.id}>
		<Select
			hideLabel
			label="Velg felt"
			className={styles.noGap}
			value={feltverdiKey(felt)}
			onChange={(event) => onOppdater(felt, event.target.value)}
		>
			<option value="">Velg felt</option>
			{felter.map((feltdefinisjon) => (
				<option key={feltverdiKey(feltdefinisjon)} value={feltverdiKey(feltdefinisjon)}>
					{feltdefinisjon.visningsnavn}
				</option>
			))}
		</Select>
		{renderFjernSelectFeltKnapp(felt, onFjern)}
	</div>
);

const OppgaveSelectFelter = ({ felter, oppgaveQuery, onLeggTil, onOppdater, onFjern }: OwnProps) => (
	<div>
		{oppgaveQuery.select && oppgaveQuery.select.map((felt) => renderSelectFelt(felter, felt, onOppdater, onFjern))}
		{renderAddEnkelSelectFeltKnapp(onLeggTil)}
	</div>
);

export default OppgaveSelectFelter;
