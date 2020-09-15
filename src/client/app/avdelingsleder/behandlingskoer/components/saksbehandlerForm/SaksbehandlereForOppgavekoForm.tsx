
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import { Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField } from 'form/FinalFields';
import { getSaksbehandlere } from 'avdelingsleder/saksbehandlere/duck';
import { Saksbehandler } from 'avdelingsleder/saksbehandlere/saksbehandlerTsType';
import saksbehandlerPropType from 'avdelingsleder/saksbehandlere/saksbehandlerPropType';
import { getOppgaveko } from 'avdelingsleder/behandlingskoer/duck';
import { Oppgaveko } from '../../oppgavekoTsType';
import oppgavekoPropType from '../../oppgavekoPropType';

import styles from './saksbehandlereForOppgavekoForm.less';

interface TsProps {
  valgtOppgaveko: Oppgaveko;
  alleSaksbehandlere: Saksbehandler[];
  knyttSaksbehandlerTilOppgaveko: (oppgavekoId: string, epost: string, isChecked: boolean) => void;
}

/**
 * SaksbehandlereForOppgavekoForm
 */
export class SaksbehandlereForOppgavekoForm extends Component<TsProps> {
  static propTypes = {
    valgtOppgaveko: oppgavekoPropType.isRequired,
    alleSaksbehandlere: PropTypes.arrayOf(saksbehandlerPropType),
    knyttSaksbehandlerTilOppgaveko: PropTypes.func.isRequired,
  };

  static defaultProps = {
    alleSaksbehandlere: [],
  }

  buildInitialValues = () => {
    const {
      valgtOppgaveko,
    } = this.props;
    const identer = valgtOppgaveko.saksbehandlere ? valgtOppgaveko.saksbehandlere.reduce((acc, sb) => (
      { ...acc, [sb.epost.replace(/\./g, '')]: true }), {}) : {};
    return {
      ...identer,
    };
  }

  render = () => {
    const {
      alleSaksbehandlere, knyttSaksbehandlerTilOppgaveko, valgtOppgaveko,
    } = this.props;

    const pos = Math.ceil(alleSaksbehandlere.length / 2);
    const alleSaksbehandlereVenstreListe = alleSaksbehandlere.slice(0, pos);
    const alleSaksbehandlereHoyreListe = alleSaksbehandlere.slice(pos);

    return (
      <Form
        onSubmit={() => undefined}
        initialValues={this.buildInitialValues()}
        render={() => (
          <Panel className={styles.panel}>
            <Element>
              <FormattedMessage id="SaksbehandlereForOppgavekoForm.Saksbehandlere" />
            </Element>
            <VerticalSpacer sixteenPx />
            {alleSaksbehandlere.length === 0 && (
              <FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
            )}
            {alleSaksbehandlere.length > 0 && (
            <Row>
              <Column xs="6">
                {alleSaksbehandlereVenstreListe.map((s) => (
                  <CheckboxField
                    key={s.epost}
                    name={s.epost.replace(/\./g, '')}
                    label={s.epost}
                    onChange={(isChecked) => knyttSaksbehandlerTilOppgaveko(valgtOppgaveko.id, s.epost, isChecked)}
                  />
                ))}
              </Column>
              <Column xs="6">
                {alleSaksbehandlereHoyreListe.map((s) => (
                  <CheckboxField
                    key={s.epost}
                    name={s.epost.replace(/\./g, '')}
                    label={s.epost}
                    onChange={(isChecked) => knyttSaksbehandlerTilOppgaveko(valgtOppgaveko.id, s.epost, isChecked)}
                  />
                ))}
              </Column>
            </Row>
            )}
          </Panel>
        )}
      />
    );
  }
}

const sortSaksbehandlere = createSelector([getSaksbehandlere], (saksbehandlere) => (saksbehandlere && saksbehandlere instanceof Array
  ? saksbehandlere.sort((saksbehandler1, saksbehandler2) => saksbehandler1.epost.localeCompare(saksbehandler2.epost))
  : saksbehandlere));

const mapStateToProps = (state) => ({
  alleSaksbehandlere: sortSaksbehandlere(state),
  valgtOppgaveko: getOppgaveko(state),
});

export default connect(mapStateToProps)(SaksbehandlereForOppgavekoForm);
