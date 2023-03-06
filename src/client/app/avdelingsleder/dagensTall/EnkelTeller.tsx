import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import styles from './enkelTeller.css';

interface OwnProps {
  antall: number;
  tekst: string;
}
const EnkelTeller: FunctionComponent<OwnProps> = ({ antall, tekst }) => (
  <div className={classNames(styles.frame, 'divide-y')}>
    <div className={styles.container}>
      <div className={styles.venstre}>
        <p className={styles.number}>{antall}</p>
      </div>
    </div>
    <div className={classNames(styles.beskrivelse, 'py-2')}>
      <p>{tekst}</p>
    </div>
  </div>
);

export default EnkelTeller;
