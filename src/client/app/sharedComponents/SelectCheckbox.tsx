import { Checkbox } from '@navikt/ds-react';
import { Next } from '@navikt/ds-icons';
import React from 'react';
import styles from './selectCheckbox.less';

interface Props {
  value: string;
  label: string;
  onClick: (suggestionGroup: string) => void;
  numberOfItems: number;
  isChecked: boolean;
}

const SelectCheckbox: React.FC<Props> = ({ value, label, onClick, numberOfItems, isChecked }) => (
  <div className={styles.wrapper}>
    <Checkbox onClick={() => onClick(value)} value={value} checked={isChecked}>
      {label}
      <div className={styles.wrapperRight}>
        {numberOfItems ? <div className={styles.numberBubble}>{numberOfItems}</div> : null}
        <Next className={isChecked ? styles.chevronIconChecked : ''} />
      </div>
    </Checkbox>
  </div>
);

export default SelectCheckbox;
