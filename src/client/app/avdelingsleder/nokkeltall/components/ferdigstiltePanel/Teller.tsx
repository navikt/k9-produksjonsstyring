import React, { FunctionComponent } from 'react';
import FerdigstilteOppgaver from 'avdelingsleder/nokkeltall/components/ferdigstiltePanel/ferdigstilteOppgaverTsType';
import styles from './teller.less';

interface OwnProps {
    info: FerdigstilteOppgaver;
}
const Teller: FunctionComponent<OwnProps> = ({ info }) => (
  <div className={styles.frame}>
    <div className={styles.container}>
      <div className={styles.venstre}>
        <p className={styles.periode}>I dag</p>
        <p className={styles.number}>{info.ferdigstilteIdag}</p>
      </div>
      <div className={styles.vl}> </div>
      <div className={styles.hoyre}>
        <p className={styles.periode}>7 dager</p>
        <p className={styles.number}>{info.ferdigstilteSyvDager}</p>
      </div>
    </div>
    <div className={styles.beskrivelse}>
      <p>{info.behandlingType.navn}</p>
    </div>
  </div>
);

export default Teller;
