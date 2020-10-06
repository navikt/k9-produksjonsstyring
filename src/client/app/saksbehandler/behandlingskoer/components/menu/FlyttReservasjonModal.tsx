import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { injectIntl, WrappedComponentProps, FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import {
  hasValidText, maxLength, minLength, required,
} from 'utils/validation/validators';
import { TextAreaField, InputField } from 'form/FinalFields';
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
  saksbehandler?: Saksbehandler;
 hentAlleReservasjonerEllerOppgaver: (params: any, keepData: boolean) => void;
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
  const finnSaksbehandler = useCallback((brukerIdent) => startRequest(brukerIdent), []);

  const { startRequest: flyttOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.FLYTT_RESERVASJON);
  const flyttOppgaveReservasjonFn = useCallback(
    (brukerIdent: string, begrunnelse: string): Promise<any> => flyttOppgaveReservasjon({ oppgaveId, brukerIdent, begrunnelse })
      .then(() => hentAlleReservasjonerEllerOppgaver({}, true)),
    [],
  );

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
                    validate={[required]}
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
        onSubmit={(values) => flyttOppgaveReservasjonFn(saksbehandler ? saksbehandler.brukerIdent : '', values.begrunnelse)}
        render={({
          handleSubmit, values,
        }) => (
          <form onSubmit={handleSubmit}>
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
              disabled={!saksbehandler || (!values.begrunnelse || values.begrunnelse.length < 3)}
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
