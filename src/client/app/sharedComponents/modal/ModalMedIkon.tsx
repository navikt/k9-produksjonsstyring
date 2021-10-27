import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import classnames from 'classnames/bind';
import styles from './modalMedIkon.less';

type TsProps = Readonly<{
  cancel: () => void;
  submit?: () => void;
    tekst: {
      formattedMessageId: string;
      values?: Record<string, boolean | string | number>;
      valgmulighetA?: string;
      valgmulighetB: string;
    }
    ikonUrl: string;
    ikonAlt: string;
}>;

const ModalMedIkon = ({
  cancel,
  submit,
  tekst,
  ikonUrl,
  ikonAlt,
}: TsProps) => (
  <Modal
    className={styles.modal}
    closeButton={false}
    isOpen
    onRequestClose={cancel}
  >
    <div className={classnames(styles.row, styles.container)}>
      <div><Image className={styles.image} alt={ikonAlt} src={ikonUrl} /></div>
      <div className={styles.divider}>
        <div className={styles.text}>
          <Normaltekst>
            {typeof tekst.values === 'undefined' && <FormattedMessage id={tekst.formattedMessageId} />}
            {typeof tekst.values !== 'undefined' && <FormattedMessage id={tekst.formattedMessageId} values={tekst.values} />}
          </Normaltekst>
        </div>
      </div>
      <div className={classnames(styles.row, styles.buttons)}>
        {tekst.valgmulighetA && typeof submit !== 'undefined' && (
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={() => submit()}
          autoFocus
        >
          {tekst.valgmulighetA}
        </Hovedknapp>
        )}
        <Knapp
          className={styles.cancelButton}
          mini
          htmlType="reset"
          onClick={() => cancel()}
        >
          {tekst.valgmulighetB}
        </Knapp>
      </div>
    </div>
  </Modal>
);

ModalMedIkon.propTypes = {
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default ModalMedIkon;
