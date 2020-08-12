import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
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
import { getSaksbehandler, getSaksbehandlere, getSaksbehandlerSokFinished } from 'avdelingsleder/saksbehandlere/duck';
import { Driftsmelding } from '../driftsmeldingTsType';
import { getDriftsmeldinger } from '../duck';

import styles from './leggTilDriftsmeldingForm.less';

interface OwnProps {
    intl: any;
    leggTilDriftsmelding: (melding: string) => Promise<string>;
    resetDriftsmeldingSok: () => void;
    driftsmelding?: Driftsmelding;
    erSokFerdig: boolean;
    driftsmeldinger: Driftsmelding[];
}

interface StateTsProps {
    leggerTilNyDriftsmelding: boolean;
    erLagtTilAllerede: boolean;
    showWarning: boolean;
}

/**
 * LeggTilDriftsmeldingForm
 */
export class LeggTilDriftsmeldingForm extends Component<OwnProps & WrappedComponentProps, StateTsProps> {
    nodes: ReactNode[];

    static defaultProps = {
      driftsmelding: undefined,
    }

    constructor(props: OwnProps) {
      super(props);

      this.state = {
        leggerTilNyDriftsmelding: false,
        erLagtTilAllerede: false,
        showWarning: false,
      };
      this.nodes = [];
    }

    leggTilDriftsmelding = (melding: string, resetFormValues: () => void) => {
      const {
        leggTilDriftsmelding, driftsmeldinger, driftsmelding,
      } = this.props;
      this.setState((prevState) => ({ ...prevState, leggerTilNyDriftsmelding: true }));

      leggTilDriftsmelding(melding).then(() => {
        this.resetDriftsmeldingSok(resetFormValues);
        this.setState((prevState) => ({ ...prevState, leggerTilNyDriftsmelding: false }));
      });
    }

    resetDriftsmeldingSok = (resetFormValues: () => void) => {
      const {
        resetDriftsmeldingSok,
      } = this.props;
      resetDriftsmeldingSok();
      resetFormValues();
      this.setState((prevState) => ({ ...prevState, showWarning: false }));
    }

    formatText = () => {
      const {
        intl,
      } = this.props;
      return ` (${intl.formatMessage({ id: 'LeggTilDriftsmeldingForm.FinnesAllerede' })})`;
    }

    render = () => {
      const {
        intl, erSokFerdig,
      } = this.props;
      const {
        leggerTilNyDriftsmelding,
        showWarning,
      } = this.state;

      return (
        <Form
          onSubmit={() => undefined}
          render={({
            submitting, handleSubmit, form, values,
          }) => (
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
                      label={intl.formatMessage({ id: 'LeggTilDriftsmeldingForm.Melding' })}
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
                      onClick={() => this.leggTilDriftsmelding(values.melding, form.reset)}
                    >
                      <FormattedMessage id="LeggTilDriftsmeldingForm.Legg_Til" />
                    </Knapp>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
              {showWarning && (
                <>
                  <Normaltekst>
                    {this.formatText()}
                  </Normaltekst>
                  <FlexColumn>
                    <Knapp
                      mini
                      htmlType="button"
                      tabIndex={0}
                      onClick={() => this.resetDriftsmeldingSok(form.reset)}
                    >
                      <FormattedMessage id="LeggTilDriftsmeldingForm.Nullstill" />
                    </Knapp>
                  </FlexColumn>
                </>
              )}
            </div>
          )}
        />
      );
    }
}

const mapStateToProps = (state) => ({
  driftsmeldinger: getDriftsmeldinger(state),
});

export default connect(mapStateToProps)(injectIntl(LeggTilDriftsmeldingForm));
