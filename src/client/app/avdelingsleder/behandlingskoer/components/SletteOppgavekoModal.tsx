
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import advarselImageUrl from 'images/advarsel.svg';
import { Oppgaveko } from '../oppgavekoTsType';
import oppgavekoPropType from '../oppgavekoPropType';

import styles from './sletteOppgavekoModal.less';

type TsProps = Readonly<{
  intl: any;
  valgtOppgaveko: Oppgaveko;
  cancel: () => void;
  submit: (oppgaveko: Oppgaveko) => void;
}>;

/**
 * SletteOppgavekoModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne oppgavekøer.
 */
export const SletteOppgavekoModal = ({
  intl,
  valgtOppgaveko,
  cancel,
  submit,
}: TsProps) => (
  <Modal
    className={styles.modal}
    closeButton={false}
    isOpen
    contentLabel={intl.formatMessage({ id: 'SletteOppgavekoModal.SletteModal' })}
    onRequestClose={cancel}
  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode="SletteOppgavekoModal.SletteModal" src={advarselImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="6" className={styles.text}>
        <Normaltekst>
          <FormattedMessage id="SletteOppgavekoModal.SletteOppgaveko" values={{ oppgavekoNavn: valgtOppgaveko.navn }} />
        </Normaltekst>
      </Column>
      <Column xs="4">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={() => submit(valgtOppgaveko)}
          autoFocus
        >
          {intl.formatMessage({ id: 'SletteOppgavekoModal.Ja' })}
        </Hovedknapp>
        <Knapp
          className={styles.cancelButton}
          mini
          htmlType="reset"
          onClick={cancel}
        >
          {intl.formatMessage({ id: 'SletteOppgavekoModal.Nei' })}
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

SletteOppgavekoModal.propTypes = {
  intl: intlShape.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  valgtOppgaveko: oppgavekoPropType.isRequired,
};

export default injectIntl(SletteOppgavekoModal);
