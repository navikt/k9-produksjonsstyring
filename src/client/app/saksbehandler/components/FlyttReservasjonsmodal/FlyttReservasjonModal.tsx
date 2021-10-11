import React, { FunctionComponent } from 'react';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { getDateAndTime } from 'utils/dateUtils';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import advarselImageUrl from 'images/advarsel.svg';
import { WrappedComponentProps, FormattedMessage } from 'react-intl';
import styles from './flyttReservasjonsmodal.less';

interface OwnProps{
  ut: string;
}

export const FlyttReservasjonsmodal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  ut,
}) => (
  <Modal
    className={styles.flyttReservasjonModal}
    isOpen
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
    // eslint-disable-next-line
    onRequestClose={() => {}}
  >
    <div className={styles.oppgaveReservertAvAnnenModal}>
      <div className={styles.flyttReservasjonModal_informasjon}>
        <div className={styles.flyttReservasjonModal_image__container}>
          <Image
            className={styles.flyttReservasjonModal_image}
            alt={intl.formatMessage({ id: 'FlyttReservasjonModal.ReservertAvEnkel' })}
            src={advarselImageUrl}
          />
        </div>
        <div className={styles.flyttReservasjonModal_text}>
          <Normaltekst>
            <FormattedMessage
              id="FlyttReservasjonModal.ReservertAv"
              values={{
                saksbehandlerid: 'Hiskjdjkshdjkshkjdshjksd sdkljsdksljdlk',
                saksbehandlernavn: 'Ho',
              }}
            />
          </Normaltekst>
        </div>
      </div>
      <div className={styles.flyttReservasjonModal_knapper__container}>
        <Hovedknapp
          mini
          htmlType="button"
          className={styles.flyttReservasjonModal_knapper__knapp}
          // eslint-disable-next-line
          onClick={() => {}}
        >
          {intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjon' })}
        </Hovedknapp>

        <Hovedknapp
          className={styles.flyttReservasjonModal_knapper__knapp}
          mini
          htmlType="button"
          // eslint-disable-next-line
          onClick={() => {}}
        >
          {intl.formatMessage({ id: 'FlyttReservasjonModal.OverstyrReservasjon' })}

        </Hovedknapp>
        <Knapp
          className={styles.flyttReservasjonModal_knapper__knapp}
          mini
          htmlType="button"
          // eslint-disable-next-line
          onClick={() => {}}
          autoFocus
        >
          {intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' })}
        </Knapp>
      </div>
    </div>
  </Modal>
);

export default FlyttReservasjonsmodal;
