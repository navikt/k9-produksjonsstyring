import React, { FunctionComponent } from 'react';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import advarselImageUrl from 'images/advarsel-sirkel-fyll.svg';
import moment from 'moment';
import { DD_MM_HHMM } from 'utils/formats';

import Image from 'sharedComponents/Image';
import styles from './driftsmeldingPanel.css';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';

interface OwnProps {
  driftsmeldinger: Driftsmelding[];
}

/**
 * DriftsmeldingPanel
 *
 * Presentasjonskomponent. Definerer hvordan driftsmeldinger vises.
 */
const DriftsmeldingPanel: FunctionComponent<OwnProps> = ({ driftsmeldinger }) => {
  if (
    driftsmeldinger === undefined ||
    driftsmeldinger.length === 0 ||
    driftsmeldinger.filter(message => message.aktiv).length === 0
  ) {
    return null;
  }

  const aktiveDriftsmeldinger = driftsmeldinger.filter(message => message.aktiv);

  return (
    <div className={styles.container}>
      {aktiveDriftsmeldinger.map(message => (
        <Row key={message.id}>
          <Column xs="11" className={styles.column}>
            <Image className={styles.image} src={advarselImageUrl} />
            <Undertekst className={styles.wordWrap}>
              {`${message.melding}. (Registrert ${moment(message.aktivert).format(DD_MM_HHMM)})`}
            </Undertekst>
          </Column>
        </Row>
      ))}
    </div>
  );
};

export default DriftsmeldingPanel;
