import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import advarselImageUrl from 'images/advarsel.svg';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';
import { Driftsmelding } from '../driftsmeldingTsType';
import styles from './sletteDriftsmeldingerModal.css';

type TsProps = Readonly<{
  intl: any;
  valgtDriftsmelding: Driftsmelding;
  closeSletteModal: () => void;
  fjernDriftsmelding: (driftsmelding: Driftsmelding) => void;
}>;

/**
 * SletteDriftsmeldingModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteDriftsmeldingModal: FunctionComponent<TsProps & WrappedComponentProps> = ({
  intl,
  valgtDriftsmelding,
  closeSletteModal,
  fjernDriftsmelding,
}: TsProps) => (
  <Modal
    className={styles.modal}
    closeButton={false}
    isOpen
    contentLabel={intl.formatMessage({ id: 'SletteDriftsmeldingModal.SletteModal' })}
    onRequestClose={closeSletteModal}
  >
    <Row>
      <Column xs="1">
        <Image
          className={styles.image}
          alt={intl.formatMessage({ id: 'SletteDriftsmeldingModal.SletteModal' })}
          src={advarselImageUrl}
        />
        <div className={styles.divider} />
      </Column>
      <Column xs="6" className={styles.text}>
        <Normaltekst>
          <FormattedMessage id="SletteDriftsmeldingModal.SletteDriftsmelding" />
        </Normaltekst>
      </Column>
      <Column xs="4">
        <Hovedknapp
          className={styles.submitButton}
          mini
          htmlType="submit"
          onClick={() => fjernDriftsmelding(valgtDriftsmelding)}
          autoFocus
        >
          {intl.formatMessage({ id: 'SletteDriftsmeldingModal.Ja' })}
        </Hovedknapp>
        <Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeSletteModal}>
          {intl.formatMessage({ id: 'SletteDriftsmeldingModal.Nei' })}
        </Knapp>
      </Column>
    </Row>
  </Modal>
);

export default injectIntl(SletteDriftsmeldingModal);
