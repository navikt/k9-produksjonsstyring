import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  injectIntl, intlShape, FormattedMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import { hasValidEmailFormat } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Saksbehandler } from '../saksbehandlerTsType';
import saksbehandlerPropType from '../saksbehandlerPropType';
import { getSaksbehandler, getSaksbehandlere, getSaksbehandlerSokFinished } from '../duck';

import styles from './leggTilSaksbehandlerForm.less';

interface TsProps {
  intl: any;
  leggTilSaksbehandler: (brukerIdent: string) => Promise<string>;
  resetSaksbehandlerSok: () => void;
  saksbehandler?: Saksbehandler;
  erSokFerdig: boolean;
  saksbehandlere: Saksbehandler[];
}

interface StateTsProps {
  leggerTilNySaksbehandler: boolean;
    erLagtTilAllerede: boolean;
    showWarning: boolean;
}

/**
 * LeggTilSaksbehandlerForm
 */
export class LeggTilSaksbehandlerForm extends Component<TsProps, StateTsProps> {
  nodes: ReactNode[];

  static propTypes = {
    intl: intlShape.isRequired,
    leggTilSaksbehandler: PropTypes.func.isRequired,
    resetSaksbehandlerSok: PropTypes.func.isRequired,
    saksbehandler: saksbehandlerPropType,
    erSokFerdig: PropTypes.bool.isRequired,
    saksbehandlere: PropTypes.arrayOf(saksbehandlerPropType),
  };

  static defaultProps = {
    saksbehandler: undefined,
  }

  constructor(props: TsProps) {
    super(props);

    this.state = {
      leggerTilNySaksbehandler: false,
      erLagtTilAllerede: false,
      showWarning: false,
    };
    this.nodes = [];
  }

  leggTilSaksbehandler = (epost: string, resetFormValues: () => void) => {
    const {
      leggTilSaksbehandler, saksbehandlere, saksbehandler,
    } = this.props;
      this.setState(prevState => ({ ...prevState, leggerTilNySaksbehandler: true }));
      if (saksbehandlere.some(s => s.epost.toLowerCase() === epost.toLowerCase())) {
        this.setState(prevState => ({ ...prevState, showWarning: true }));
        this.setState(prevState => ({ ...prevState, leggerTilNySaksbehandler: false }));
      } else {
      leggTilSaksbehandler(epost).then(() => {
        this.resetSaksbehandlerSok(resetFormValues);
        this.setState(prevState => ({ ...prevState, leggerTilNySaksbehandler: false }));
      });
      }
  }

  resetSaksbehandlerSok = (resetFormValues: () => void) => {
    const {
      resetSaksbehandlerSok,
    } = this.props;
    resetSaksbehandlerSok();
    resetFormValues();
    this.setState(prevState => ({ ...prevState, showWarning: false }));
  }

  formatText = () => {
    const {
      intl,
    } = this.props;
    return ` (${intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesAllerede' })})`;
  }

  render = () => {
    const {
      intl, erSokFerdig,
    } = this.props;
    const {
      leggerTilNySaksbehandler,
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
              <FormattedMessage id="LeggTilSaksbehandlerForm.LeggTil" />
            </Element>
            <VerticalSpacer eightPx />
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <InputField
                    name="epost"
                    className={styles.epost}
                    label={intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.Epost' })}
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
                    onClick={() => this.leggTilSaksbehandler(values.epost, form.reset)}
                  >
                    <FormattedMessage id="LeggTilSaksbehandlerForm.Sok" />
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
                  onClick={() => this.resetSaksbehandlerSok(form.reset)}
                >
                  <FormattedMessage id="LeggTilSaksbehandlerForm.Nullstill" />
                </Knapp>
              </FlexColumn>
            </>
            )
            }
          </div>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  saksbehandlere: getSaksbehandlere(state),
  saksbehandler: getSaksbehandler(state),
  erSokFerdig: getSaksbehandlerSokFinished(state),
});

export default connect(mapStateToProps)(injectIntl(LeggTilSaksbehandlerForm));
