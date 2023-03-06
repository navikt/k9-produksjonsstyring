import { Close } from '@navikt/ds-icons';
import React, { FunctionComponent, ReactNode, useRef } from 'react';
import styles from './merkelapp.less';

type Props = {
  onClick: () => void;
  children: ReactNode;
};

const Merkelapp: FunctionComponent<Props> = ({ onClick, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      type="button"
      className={styles.merkelapp}
      title={typeof children === 'string' ? children : undefined}
    >
      <span className={styles.tekst}>{children}</span>
      <Close />
    </button>
  );
};

export default Merkelapp;
