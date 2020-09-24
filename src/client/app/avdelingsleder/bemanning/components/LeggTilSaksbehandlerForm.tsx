import React, { FunctionComponent, useState } from 'react';
import {
  injectIntl, WrappedComponentProps, FormattedMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { hasValidEmailFormat } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Saksbehandler } from '../saksbehandlerTsType';

import styles from './leggTilSaksbehandlerForm.less';

interface OwnProps {
  leggTilSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandlerSok: () => void;
  saksbehandlere: Saksbehandler[];
  lukkForm: () => void;
}

/**
 * LeggTilSaksbehandlerForm
 */
export const LeggTilSaksbehandlerForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  resetSaksbehandlerSok,
  saksbehandlere,
  leggTilSaksbehandler, lukkForm,
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [leggerTilNySaksbehandler, setLeggerTilNySaksbehandler] = useState(false);

  const resetSok = (resetFormValues: () => void) => {
    resetSaksbehandlerSok();
    resetFormValues();
    setShowWarning(false);
  };

  const addSaksbehandler = (epost: string, resetFormValues: () => void) => {
    setLeggerTilNySaksbehandler(true);
    if (saksbehandlere.some((s) => s.epost.toLowerCase() === epost.toLowerCase())) {
      setShowWarning(true);
      setLeggerTilNySaksbehandler(false);
    } else {
      leggTilSaksbehandler(epost).then(() => {
        resetSok(resetFormValues);
        setLeggerTilNySaksbehandler(false);
        lukkForm();
      });
    }
  };

  const formatText = () => <FormattedMessage id="LeggTilSaksbehandlerForm.FinnesAllerede" />;

  return (
    <Form
      onSubmit={() => undefined}
      render={({
        submitting, handleSubmit, form, values,
      }) => (
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
              <Normaltekst>
                {formatText()}
              </Normaltekst>
              <FlexColumn>
                <Knapp
                  mini
                  htmlType="button"
                  tabIndex={0}
                  onClick={() => resetSok(form.reset)}
                >
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
