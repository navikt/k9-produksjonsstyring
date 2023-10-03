import React from 'react';
import { Next } from '@navikt/ds-icons';
import { Checkbox } from '@navikt/ds-react';
import styles from './selectCheckbox.css';

interface Props {
	value: string;
	label: string;
	onClick: (suggestionGroup: string) => void;
	toggleGroupOpen: (suggestionGroup: string) => void;
	numberOfItems: number;
	isChecked: boolean;
	isOpen: boolean;
}

const SelectCheckbox: React.FC<Props> = ({
	value,
	label,
	onClick,
	numberOfItems,
	isChecked,
	toggleGroupOpen,
	isOpen,
}) => (
	<div className={styles.wrapper}>
		<div className="flex flex-row">
			<Checkbox className="flex-shrink-0" size="small" onClick={() => onClick(value)} value={value} checked={isChecked}>
				{label}
			</Checkbox>
			<div className="flex-grow">
				<div className="flex mt-2 float-right">
					{numberOfItems ? (
						<div className={styles.numberBubble}>
							<span className="text-sm">{numberOfItems}</span>
						</div>
					) : null}
					<Next
						width="1rem"
						height="1rem"
						onClick={() => toggleGroupOpen(value)}
						className={`${isOpen ? styles.chevronIconChecked : ''} cursor-pointer`}
					/>
				</div>
			</div>
		</div>
	</div>
);

export default SelectCheckbox;
