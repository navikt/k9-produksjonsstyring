import React, { FunctionComponent, useState } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { InputField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidEmailFormat } from 'utils/validation/validators';
import { Driftsmelding } from '../driftsmeldingTsType';
import styles from './leggTilDriftsmeldingForm.css';

/**
 * LeggTilDriftsmeldingForm
 */
interface OwnProps {
  hentAlleDriftsmeldinger: () => void;
}

export const LeggTilDriftsmeldingForm: FunctionComponent<OwnProps> = ({ hentAlleDriftsmeldinger }) => {
  const [leggerTilNyDriftsmelding, setLeggerTilNyDriftsmelding] = useState(false);

  const { startRequest: leggTilDriftsmelding } = useRestApiRunner<Driftsmelding>(K9LosApiKeys.LAGRE_DRIFTSMELDING);

  const addDriftsmelding = (melding: string, resetFormValues: () => void) => {
    setLeggerTilNyDriftsmelding(true);
    leggTilDriftsmelding({ driftsmelding: melding })
      .then(() => hentAlleDriftsmeldinger())
      .then(() => setLeggerTilNyDriftsmelding(false));
    resetFormValues();
  };

  return (
    <Form
      onSubmit={() => undefined}
      render={({ submitting, handleSubmit, form, values }) => (
        <div>
          <Element>
            <FormattedMessage id="LeggTilDriftsmeldingForm.LeggTil" />
          </Element>
          <VerticalSpacer eightPx />
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <InputField
                  name="melding"
                  className={styles.epost}
                  label={<FormattedMessage id="LeggTilDriftsmeldingForm.Melding" />}
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
                  disabled={submitting || leggerTilNyDriftsmelding}
                  tabIndex={0}
                  onClick={() => addDriftsmelding(values.melding, form.reset)}
                >
                  <FormattedMessage id="LeggTilDriftsmeldingForm.Legg_Til" />
                </Knapp>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </div>
      )}
    />
  );
};

export default injectIntl(LeggTilDriftsmeldingForm);
