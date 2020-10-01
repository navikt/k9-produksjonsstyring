import React, {
  Component, FunctionComponent, MouseEvent, useCallback,
} from 'react';
import { Form } from 'react-final-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';

import { DatepickerField } from 'form/FinalFields';
import styles from 'saksbehandler/behandlingskoer/components/menu/oppgaveReservasjonEndringDatoModal.less';
import Modal from 'sharedComponents/Modal';
import { dateAfterOrEqual, dateBeforeOrEqual, hasValidDate } from 'utils/validation/validators';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';

interface OwnProps {
  showModal: boolean;
  closeModal: (event: MouseEvent<HTMLButtonElement>) => void;
  reserverTilDefault: string;
  oppgaveId: string;
  hentAlleReservasjonerEllerOppgaver: (params: any, keepData: boolean) => void;
}

/**
 * OppgaveReservasjonEndringDatoModal.
 */
const OppgaveReservasjonEndringDatoModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  showModal,
  closeModal,
  reserverTilDefault,
  oppgaveId,
  hentAlleReservasjonerEllerOppgaver,
}) => {
  const buildInitialValues = useCallback((reserverTil: string) => ({
    reserverTil: (reserverTil && reserverTil.length >= 10) ? reserverTil.substr(0, 10) : '',
  }), []);

  const { startRequest: endreOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.ENDRE_OPPGAVERESERVASJON);

  const endreReservasjonDatoFn = useCallback((reserverTil: string): Promise<any> => endreOppgaveReservasjon({ oppgaveId, reserverTil })
    .then(() => hentAlleReservasjonerEllerOppgaver({}, true)),
  []);

  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'OppgaveReservasjonEndringDatoModal.Header' })}
      onRequestClose={closeModal as () => void}
    >
      <Form
        onSubmit={(values) => endreReservasjonDatoFn(values.reserverTil)}
        initialValues={buildInitialValues(reserverTilDefault)}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Panel className={styles.panel}>
              <h3>
                {intl.formatMessage({ id: 'OppgaveReservasjonEndringDatoModal.Header' })}
              </h3>
              <DatepickerField
                name="reserverTil"
                onBlurValidation
                validate={[hasValidDate, dateAfterOrEqual(new Date())]}
                alwaysShowCalendar
                disabledDays={{ before: new Date() }}
              />
              <Row className={styles.buttonRow}>
                <Column>
                  <div className={styles.buttonBox}>
                    <Knapp
                      mini
                      className={styles.button}
                      autoFocus
                    >
                      {intl.formatMessage({ id: 'OppgaveReservasjonEndringDatoModal.Ok' })}
                    </Knapp>

                    <Knapp
                      mini
                      className={styles.button}
                      onClick={closeModal}
                    >
                      {intl.formatMessage({ id: 'OppgaveReservasjonEndringDatoModal.Avbryt' })}
                    </Knapp>
                  </div>
                </Column>
              </Row>
            </Panel>
          </form>
        )}
      />
    </Modal>
  );
};

export default injectIntl(OppgaveReservasjonEndringDatoModal);
