import React, { FunctionComponent } from 'react';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import styles from './teller.less';

interface OwnProps {
    behandlingType: Kodeverk;
    antallIdag: number;
    antallSyvDager: number
}
const Teller: FunctionComponent<OwnProps> = ({ behandlingType, antallIdag, antallSyvDager }) => (
  <div className={styles.frame}>
    <div className={styles.container}>
      <div className={styles.venstre}>
        <p className={styles.periode}>I dag</p>
        <p className={styles.number}>{antallIdag}</p>
      </div>
      <div className={styles.vl}> </div>
      <div className={styles.hoyre}>
        <p className={styles.periode}>7 dager</p>
        <p className={styles.number}>{antallSyvDager}</p>
      </div>
    </div>
    <div className={styles.beskrivelse}>
      <p>{behandlingType.navn}</p>
    </div>
  </div>
);

export default Teller;
