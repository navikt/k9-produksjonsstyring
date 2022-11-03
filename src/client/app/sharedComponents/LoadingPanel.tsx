import React from 'react';
import { Loader } from '@navikt/ds-react';

import styles from './loadingPanel.less';

/**
 * LoadingPanel
 *
 * Presentasjonskomponent. Viser lasteikon.
 */
const LoadingPanel = () => <Loader size="2xlarge" className={styles.container} />;

export default LoadingPanel;
