import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import {
  dateAfterOrEqual,
  hasValidDate,
  hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import {TextAreaField, InputField, DatepickerField} from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import { Saksbehandler } from '../../saksbehandlerTsType';

import styles from './flyttReservasjonModal.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

interface OwnProps {
  showModal: boolean;
  oppgaveId: string;
  closeModal: () => void;
  hentAlleReservasjonerEllerOppgaver: () => void;
}

/**
 * FlyttReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl, showModal, closeModal, oppgaveId, hentAlleReservasjonerEllerOppgaver,
}) => {
  const {
    startRequest, state, data: saksbehandler, resetRequestData,
  } = useRestApiRunner<Saksbehandler>(K9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK);
  const { startRequest: endreOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.ENDRE_OPPGAVERESERVASJON);
  const { startRequest: flyttOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.FLYTT_RESERVASJON);

  const finnSaksbehandler = useCallback((brukerIdent) => startRequest({ brukerIdent }), []);

  const flyttOppgaveReservasjonFn = useCallback(
    (brukerIdent: string, begrunnelse: string): Promise<any> => flyttOppgaveReservasjon({ oppgaveId, brukerIdent, begrunnelse })
      .then(() => {
        hentAlleReservasjonerEllerOppgaver();
        closeModal();
      }),
    [],
  );

  const endreReservasjonDatoOgFlyttOppgaveReservasjonFn = useCallback((reserverTil: string, brukerIdent: string, begrunnelse: string): Promise<any> => endreOppgaveReservasjon({ oppgaveId, reserverTil })
      .then(() => {
        flyttOppgaveReservasjonFn(brukerIdent, begrunnelse);
      }),
    []);

  const onSubmit = (brukerIdent: string, begrunnelse: string, reservertTilDato: string) => {
    if(reservertTilDato){
      endreReservasjonDatoOgFlyttOppgaveReservasjonFn(reservertTilDato, saksbehandler ? saksbehandler.brukerIdent : '', begrunnelse);
    }else{
      flyttOppgaveReservasjonFn(saksbehandler ? saksbehandler.brukerIdent : '', begrunnelse);
    }
  }

  const formatText = () => {
    if (state === RestApiState.SUCCESS && !saksbehandler) {
      return intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesIkke' });
    }

    return saksbehandler
      ? `${saksbehandler.navn}`
      : '';
  };

  useEffect(() => () => {
    resetRequestData();
  }, []);

  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjon' })}
      onRequestClose={closeModal}
    >
      <Form
        onSubmit={(values) => finnSaksbehandler(values.brukerIdent)}
        render={({
          handleSubmit, values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Element>
              <FormattedMessage id="FlyttReservasjonModal.FlyttReservasjon" />
            </Element>
            <VerticalSpacer eightPx />
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <InputField
                    name="brukerIdent"
                    label={intl.formatMessage({ id: 'FlyttReservasjonModal.Brukerident' })}
                    bredde="S"
                    // validate={[required]}
                    autoFocus
                  />
                </FlexColumn>
                <FlexColumn>
                  <Hovedknapp
                    mini
                    htmlType="submit"
                    className={styles.button}
                    spinner={state === RestApiState.LOADING}
                    disabled={!values.brukerIdent || state === RestApiState.LOADING}
                  >
                    <FormattedMessage id="FlyttReservasjonModal.Sok" />
                  </Hovedknapp>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
            {state === RestApiState.SUCCESS && (
            <>
              <Normaltekst>{formatText()}</Normaltekst>
              <VerticalSpacer sixteenPx />
            </>
            )}
          </form>
        )}
      />
      <Form
        onSubmit={(values) => onSubmit(saksbehandler ? saksbehandler.brukerIdent : '', values.begrunnelse, values.reserverTil)}
        render={({
          handleSubmit, values,
        }) => (
          <form onSubmit={handleSubmit}>
            <VerticalSpacer sixteenPx />
            <div className={styles.test}>
            <DatepickerField
              name="reserverTil"
              onBlurValidation
              validate={[hasValidDate, dateAfterOrEqual(new Date())]}
              label={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjonText' })}
              alwaysShowCalendar
              disabledDays={{ before: new Date() }}
            />
            </div>
            <VerticalSpacer sixteenPx />
            <TextAreaField
              name="begrunnelse"
              label={intl.formatMessage({ id: 'FlyttReservasjonModal.Begrunn' })}
              validate={[required, maxLength1500, minLength3, hasValidText]}
              maxLength={1500}
            />
            <Hovedknapp
              className={styles.submitButton}
              mini
              htmlType="submit"
              disabled={/* !saksbehandler || */ (!values.begrunnelse || values.begrunnelse.length < 3)}
            >
              {intl.formatMessage({ id: 'FlyttReservasjonModal.Ok' })}
            </Hovedknapp>
            <Knapp
              className={styles.cancelButton}
              mini
              htmlType="reset"
              onClick={closeModal}
            >
              {intl.formatMessage({ id: 'FlyttReservasjonModal.Avbryt' })}
            </Knapp>
          </form>
        )}
      />
    </Modal>
  );
};

export default injectIntl(FlyttReservasjonModal);
