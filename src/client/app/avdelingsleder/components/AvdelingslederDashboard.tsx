import React, { FunctionComponent } from 'react';

import Panel from 'nav-frontend-paneler';
import SaksstotteIndex from 'saksbehandler/saksstotte/SaksstotteIndex';
import { SaksbehandlerIndex } from 'saksbehandler/SaksbehandlerIndex';
import BemanningIndex from 'avdelingsleder/bemanning/BemanningIndex';
import styles from './avdelingslederDashboard.less';

type OwnProps = Readonly<{
  children: any;
}>;

/**
 * AvdelingslederDashboard
 */
const AvdelingslederDashboard: FunctionComponent<OwnProps> = ({
  children,
}) => (
  <div>
    <div className={styles.oppgaveContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.leftColumn}>
          <div className={styles.avdelingslederContent}>
            {children}
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Panel>
            {' '}
            <BemanningIndex />
          </Panel>

        </div>
      </div>
    </div>
  </div>
);

export default AvdelingslederDashboard;
