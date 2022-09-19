import React, { FunctionComponent, ReactNode } from 'react';
import styles from './merkelapp.less';

type Props = {
  children: ReactNode;
};

const Merkelapper: FunctionComponent<Props> = ({ children }) => <div className={styles.merkelapper}>{children}</div>;

export default Merkelapper;
