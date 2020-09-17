import React, { FunctionComponent } from 'react';
import styles from './enkelTeller.less';

interface OwnProps {
    antall: number;
    tekst: string;
}
const EnkelTeller: FunctionComponent<OwnProps> = ({ antall, tekst }) => (
  <div className={styles.frame}>
    <div className={styles.container}>
      <div className={styles.venstre}>
        <p className={styles.number}>{antall}</p>
      </div>
      <hr className={styles.line} />
    </div>
    <div className={styles.beskrivelse}>
      <p>{tekst}</p>
    </div>
  </div>
);

export default EnkelTeller;
