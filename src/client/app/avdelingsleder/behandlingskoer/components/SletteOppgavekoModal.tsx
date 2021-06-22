import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import Modal from 'sharedComponents/Modal';

import { Oppgaveko } from '../oppgavekoTsType';

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
export const SletteOppgavekoModal: FunctionComponent<TsProps & WrappedComponentProps> = ({
  intl,
  valgtOppgaveko,
  cancel,
  submit,
}) => (
  <Modal
    className={styles.modal}
    closeButton={false}
    isOpen
    contentLabel={intl.formatMessage({ id: 'SletteOppgavekoModal.SletteModal' })}
    onRequestClose={cancel}
  >
    <Row>
      <Column xs="6" className={styles.text}>
        <Normaltekst>
          <FormattedMessage id="SletteOppgavekoModal.SletteOppgaveko" values={{ OppgavekoNavn: valgtOppgaveko.navn }} />
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

export default injectIntl(SletteOppgavekoModal);
