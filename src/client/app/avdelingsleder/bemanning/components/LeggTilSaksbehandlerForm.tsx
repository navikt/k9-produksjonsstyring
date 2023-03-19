import React, { FunctionComponent, useState } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { InputField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidEmailFormat } from 'utils/validation/validators';
import { Saksbehandler } from '../saksbehandlerTsType';
import styles from './leggTilSaksbehandlerForm.css';

interface OwnProps {
  saksbehandlere: Saksbehandler[];
  hentAlleSaksbehandlere: () => void;
  lukkForm: () => void;
}

/**
 * LeggTilSaksbehandlerForm
 */
export const LeggTilSaksbehandlerForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  saksbehandlere,
  lukkForm,
  hentAlleSaksbehandlere,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [leggerTilNySaksbehandler, setLeggerTilNySaksbehandler] = useState(false);

  const { startRequest: leggTilSaksbehandler, resetRequestData: resetSaksbehandlerSok } =
    useRestApiRunner<Saksbehandler>(K9LosApiKeys.SAKSBEHANDLER_SOK);

  const resetSok = (resetFormValues: () => void) => {
    resetSaksbehandlerSok();
    resetFormValues();
    setShowWarning(false);
  };

  const addSaksbehandler = (epost: string, resetFormValues: () => void) => {
    setLeggerTilNySaksbehandler(true);
    if (saksbehandlere.some(s => s.epost.toLowerCase() === epost.toLowerCase())) {
      setShowWarning(true);
      setLeggerTilNySaksbehandler(false);
    } else {
      leggTilSaksbehandler({ epost })
        .then(() => {
          resetSok(resetFormValues);
          setLeggerTilNySaksbehandler(false);
          lukkForm();
        })
        .then(() => hentAlleSaksbehandlere());
    }
  };

  const formatText = () => <FormattedMessage id="LeggTilSaksbehandlerForm.FinnesAllerede" />;

  return (
    <Form
      onSubmit={() => undefined}
      render={({ submitting, handleSubmit, form, values }) => (
        <div>
          <Element>
            <FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
          </Element>
          <VerticalSpacer eightPx />
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <InputField
                  name="epost"
                  className={styles.epost}
                  label="Epost"
                  bredde="L"
                  validate={[hasValidEmailFormat]}
                />
              </FlexColumn>
              <FlexColumn>
                <Knapp
                  mini
                  htmlType="submit"
                  className={styles.button}
                  spinner={submitting}
                  disabled={submitting || leggerTilNySaksbehandler}
                  tabIndex={0}
                  onClick={() => addSaksbehandler(values.epost, form.reset)}
                >
                  <FormattedMessage id="LeggTilSaksbehandlerForm.Sok" />
                </Knapp>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          {showWarning && (
            <>
              <Normaltekst>{formatText()}</Normaltekst>
              <FlexColumn>
                <Knapp mini htmlType="button" tabIndex={0} onClick={() => resetSok(form.reset)}>
                  <FormattedMessage id="LeggTilSaksbehandlerForm.Nullstill" />
                </Knapp>
              </FlexColumn>
            </>
          )}
        </div>
      )}
    />
  );
};

export default injectIntl(LeggTilSaksbehandlerForm);
