import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { getDateAndTime } from 'utils/dateUtils';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';

import advarselImageUrl from 'images/advarsel.svg';

import styles from './oppgaveErReservertAvAnnenModal.less';

type OwnProps = Readonly<{
    lukkErReservertModalOgOpneOppgave: (oppgave: Oppgave) => void;
    oppgave: Oppgave;
    oppgaveStatus: OppgaveStatus;
    lukkModal: () => void;
}>

const getClickEvent = (lukkErReservertModalOgOpneOppgave, oppgave) => () => lukkErReservertModalOgOpneOppgave(oppgave);

/**
 * OppgaveErReservertAvAnnenModal
 *
 * Presentasjonskomponent. Modal som vises når en åpner oppgave som er reservert av en annen saksbehandler
 */
export const OppgaveErReservertAvAnnenModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  lukkErReservertModalOgOpneOppgave,
  oppgave,
  oppgaveStatus,
  lukkModal,
}) => (
  <Modal
    className={styles.modal}
    isOpen
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.ReservertAvEnkel' })}
    onRequestClose={getClickEvent(lukkErReservertModalOgOpneOppgave, oppgave)}
  >
    <Row>
      <Column xs="1">
        <Image
          className={styles.image}
          alt={intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.ReservertAvEnkel' })}
          src={advarselImageUrl}
        />
        <div className={styles.divider} />
      </Column>
      <Column xs="8" className={styles.text}>
        <Normaltekst>
          <FormattedMessage
            id="OppgaveErReservertAvAnnenModal.ReservertAv"
            values={{
              saksbehandlerid: oppgaveStatus.reservertAv,
              saksbehandlernavn: typeof oppgaveStatus.reservertAvNavn !== 'undefined' ? oppgaveStatus.reservertAvNavn : '',
              ...getDateAndTime(oppgaveStatus.reservertTilTidspunkt),
            }}
          />
        </Normaltekst>
      </Column>
    </Row>
    <Row>
      <div className={styles.knappContainer}>
        <Knapp
          className={styles.tilbakeButton}
          mini
          htmlType="button"
          onClick={() => lukkModal()}
          autoFocus
        >
          {intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.GåTilKøen' })}
        </Knapp>
        <Hovedknapp
          className={styles.okButton}
          mini
          htmlType="button"
          onClick={getClickEvent(lukkErReservertModalOgOpneOppgave, oppgave)}
          autoFocus
        >
          {intl.formatMessage({ id: 'OppgaveErReservertAvAnnenModal.Ok' })}
        </Hovedknapp>
      </div>
    </Row>
  </Modal>
);

export default injectIntl(OppgaveErReservertAvAnnenModal);
