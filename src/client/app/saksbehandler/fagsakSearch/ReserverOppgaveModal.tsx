import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import advarselImageUrl from 'images/advarsel.svg';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { Oppgave } from 'saksbehandler/oppgaveTsType';
import Image from 'sharedComponents/Image';
import Modal from 'sharedComponents/Modal';
import styles from './reserverOppgaveModal.css';

type TsProps = Readonly<{
    cancel: (oppgave: Oppgave, selectOppgaveCallback) => void;
    submit: (oppgave: Oppgave, selectOppgaveCallback) => void;
    valgtOppgave: Oppgave;
    selectOppgaveCallback: () => void;
}>;

export const ReserverOppgaveModal = ({ cancel, submit, valgtOppgave, selectOppgaveCallback }: TsProps) => (
    <Modal
        className={styles.modal}
        closeButton={false}
        isOpen
        contentLabel="Ønsker du å reservere behandlingen?"
        onRequestClose={cancel}
    >
        <Row>
            <Column xs="1">
                <Image className={styles.image} altCode="ReserverOppgaveModal.ReserverOppgave" src={advarselImageUrl} />
                <div className={styles.divider} />
            </Column>
            <Column xs="6" className={styles.text}>
                <Normaltekst>
                    <FormattedMessage id="ReserverOppgaveModal.ReserverOppgave" />
                </Normaltekst>
            </Column>
            <Column xs="4">
                <Hovedknapp
                    className={styles.submitButton}
                    mini
                    htmlType="submit"
                    onClick={() => submit(valgtOppgave, selectOppgaveCallback)}
                    autoFocus
                >
                    Ja
                </Hovedknapp>
                <Knapp
                    className={styles.cancelButton}
                    mini
                    htmlType="reset"
                    onClick={() => cancel(valgtOppgave, selectOppgaveCallback)}
                >
                    Nei
                </Knapp>
            </Column>
        </Row>
    </Modal>
);

ReserverOppgaveModal.propTypes = {
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
};

export default injectIntl(ReserverOppgaveModal);
