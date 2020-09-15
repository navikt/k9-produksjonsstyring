import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import {
  injectIntl, WrappedComponentProps, FormattedMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Knapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { hasValidEmailFormat } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Driftsmelding } from '../driftsmeldingTsType';
import { getDriftsmeldinger } from '../duck';

import styles from './leggTilDriftsmeldingForm.less';

interface OwnProps {
    intl: any;
    leggTilDriftsmelding: (melding: string) => Promise<string>;
    driftsmeldinger: Driftsmelding[];
}

interface StateTsProps {
    leggerTilNyDriftsmelding: boolean;
}

/**
 * LeggTilDriftsmeldingForm
 */
export class LeggTilDriftsmeldingForm extends Component<OwnProps & WrappedComponentProps, StateTsProps> {
    nodes: ReactNode[];

    constructor(props: OwnProps) {
      super(props);

      this.state = {
        leggerTilNyDriftsmelding: false,
      };
      this.nodes = [];
    }

    leggTilDriftsmelding = (melding: string) => {
      const {
        leggTilDriftsmelding,
      } = this.props;
      this.setState((prevState) => ({ ...prevState, leggerTilNyDriftsmelding: true }));
      leggTilDriftsmelding(melding).then(() => {
        this.setState((prevState) => ({ ...prevState, leggerTilNyDriftsmelding: false }));
      });
    }

    render = () => {
      const {
        intl,
      } = this.props;
      const {
        leggerTilNyDriftsmelding,
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
                      onClick={() => this.leggTilDriftsmelding(values.melding)}
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
    }
}

const mapStateToProps = (state) => ({
  driftsmeldinger: getDriftsmeldinger(state),
});

export default connect(mapStateToProps)(injectIntl(LeggTilDriftsmeldingForm));
