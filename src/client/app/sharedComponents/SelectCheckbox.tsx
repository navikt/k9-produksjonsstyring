import React from 'react';
import { Next } from '@navikt/ds-icons';
import { Checkbox } from '@navikt/ds-react';
import styles from './selectCheckbox.css';

interface Props {
	value: string;
	label: string;
	onClick: (suggestionGroup: string) => void;
	numberOfItems: number;
	isChecked: boolean;
}

const SelectCheckbox: React.FC<Props> = ({ value, label, onClick, numberOfItems, isChecked }) => (
	<div className={styles.wrapper}>
		<div className="flex flex-row">
			<Checkbox className="flex-shrink-0" onClick={() => onClick(value)} value={value} checked={isChecked}>
				{label}
			</Checkbox>
			<div className="flex-grow">
				<div className="flex mt-3 float-right">
					{numberOfItems ? <div className={styles.numberBubble}>{numberOfItems}</div> : null}
					<Next className={isChecked ? styles.chevronIconChecked : ''} />
				</div>
			</div>
		</div>
	</div>
);

export default SelectCheckbox;
