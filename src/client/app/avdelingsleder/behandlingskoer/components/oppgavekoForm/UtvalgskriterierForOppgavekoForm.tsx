import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Undertittel, Element, Normaltekst } from 'nav-frontend-typografi';

import { getValgtAvdelingEnhet } from 'app/duck';
import { Row, Column } from 'nav-frontend-grid';
import {
  required, minLength, maxLength, hasValidName,
} from 'utils/validation/validators';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import { Oppgaveko } from '../../oppgavekoTsType';
import oppgavekoPropType from '../../oppgavekoPropType';
import { getAntallOppgaverForOppgavekoResultat } from '../../duck';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';
import AndreKriterierVelger from './AndreKriterierVelger';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';
import SorteringVelger from './SorteringVelger';

import styles from './utvalgskriterierForOppgavekoForm.less';

const minLength3 = minLength(3);
const maxLength100 = maxLength(100);

const finnDagerSomTall = (antallDager) => {
  const nr = Number.parseInt(antallDager, 10);
  return Number.isNaN(nr) ? undefined : nr;
};

interface TsProps {
  intl: any;
  valgtOppgaveko: Oppgaveko;
  lagreOppgavekoNavn: (oppgaveko: {oppgavekoId: string; navn: string}, avdelingEnhet: string) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean, avdelingEnhet: string) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: string, avdelingEnhet: string) => void;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, skalInkludere: boolean, avdelingEnhet: string) => void;
  valgtAvdelingEnhet: string;
  antallOppgaver?: number;
  hentAntallOppgaverForOppgaveko: (oppgavekoId: string, avdelingEnhet: string) => Promise<string>;
}

/**
 * UtvalgskriterierForOppgavekoForm
 */
export class UtvalgskriterierForOppgavekoForm extends Component<TsProps> {
  static propTypes = {
    intl: intlShape.isRequired,
    valgtOppgaveko: oppgavekoPropType.isRequired,
    lagreOppgavekoNavn: PropTypes.func.isRequired,
    lagreOppgavekoBehandlingstype: PropTypes.func.isRequired,
    lagreOppgavekoFagsakYtelseType: PropTypes.func.isRequired,
    lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
    valgtAvdelingEnhet: PropTypes.string.isRequired,
    antallOppgaver: PropTypes.number,
    hentAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const {
      valgtOppgaveko, hentAntallOppgaverForOppgaveko, valgtAvdelingEnhet,
    } = this.props;
    hentAntallOppgaverForOppgaveko(valgtOppgaveko.oppgavekoId, valgtAvdelingEnhet);
  }

  componentDidUpdate = (prevProps: TsProps) => {
    const {
      valgtOppgaveko, hentAntallOppgaverForOppgaveko, valgtAvdelingEnhet,
    } = this.props;
    if (prevProps.valgtOppgaveko.oppgavekoId !== valgtOppgaveko.oppgavekoId) {
      hentAntallOppgaverForOppgaveko(valgtOppgaveko.oppgavekoId, valgtAvdelingEnhet);
    }
  }

  buildInitialValues = (intl: any) => {
    const {
      valgtOppgaveko,
    } = this.props;

    const behandlingTypes = valgtOppgaveko.behandlingTyper ? valgtOppgaveko.behandlingTyper.reduce((acc, bt) => ({ ...acc, [bt.kode]: true }), {}) : {};
    const fagsakYtelseType = valgtOppgaveko.fagsakYtelseTyper && valgtOppgaveko.fagsakYtelseTyper.length > 0
      ? valgtOppgaveko.fagsakYtelseTyper[0].kode : '';

    const andreKriterierTyper = valgtOppgaveko.andreKriterier
      ? valgtOppgaveko.andreKriterier.reduce((acc, ak) => ({ ...acc, [ak.andreKriterierType.kode]: true }), {}) : {};
    const andreKriterierInkluder = valgtOppgaveko.andreKriterier
      ? valgtOppgaveko.andreKriterier.reduce((acc, ak) => ({ ...acc, [`${ak.andreKriterierType.kode}_inkluder`]: ak.inkluder }), {}) : {};

    return {
      oppgavekoId: valgtOppgaveko.oppgavekoId,
      navn: valgtOppgaveko.navn ? valgtOppgaveko.navn : intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.NyListe' }),
      sortering: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.sorteringType.kode : undefined,
      fomDato: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.fomDato : undefined,
      tomDato: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.tomDato : undefined,
      fra: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.fra : undefined,
      til: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.til : undefined,
      erDynamiskPeriode: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.erDynamiskPeriode : undefined,
      fagsakYtelseType,
      ...andreKriterierTyper,
      ...andreKriterierInkluder,
      ...behandlingTypes,
    };
  }

  tranformValues = (values: {oppgavekoId: string; navn: string}) => {
    const {
      lagreOppgavekoNavn, valgtAvdelingEnhet,
    } = this.props;
    lagreOppgavekoNavn({ oppgavekoId: values.oppgavekoId, navn: values.navn }, valgtAvdelingEnhet);
  }

  render = () => {
    const {
      intl, lagreOppgavekoBehandlingstype, lagreOppgavekoFagsakYtelseType, valgtOppgaveko, valgtAvdelingEnhet, antallOppgaver,
      lagreOppgavekoAndreKriterier,
    } = this.props;

    return (
      <Form
        onSubmit={() => undefined}
        initialValues={this.buildInitialValues(intl)}
        render={({ values }) => (
          <Panel className={styles.panel}>
            <AutoLagringVedBlur lagre={this.tranformValues} fieldNames={['navn']} />
            <Element>
              <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Utvalgskriterier" />
            </Element>
            <VerticalSpacer eightPx />
            <Row>
              <Column xs="9">
                <InputField
                  name="navn"
                  label={intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.Navn' })}
                  validate={[required, minLength3, maxLength100, hasValidName]}
                  onBlurValidation
                  bredde="L"
                  autoFocus
                />
              </Column>
              <Column xs="3">
                <div className={styles.grayBox}>
                  <Normaltekst><FormattedMessage id="UtvalgskriterierForOppgavekoForm.AntallSaker" /></Normaltekst>
                  <Undertittel>{antallOppgaver || '0'}</Undertittel>
                </div>
              </Column>
            </Row>
            <Row>
              <Column xs="6" className={styles.stonadstypeRadios}>
                <FagsakYtelseTypeVelger
                  lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
                  valgtOppgavekoId={valgtOppgaveko.oppgavekoId}
                  valgtAvdelingEnhet={valgtAvdelingEnhet}
                  valgtFagsakYtelseType={values ? values.fagsakYtelseType : ''}
                />
              </Column>
            </Row>
            <Row>
              <Column xs="3">
                <BehandlingstypeVelger
                  lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
                  valgtOppgavekoId={valgtOppgaveko.oppgavekoId}
                  valgtAvdelingEnhet={valgtAvdelingEnhet}
                />
              </Column>
              <Column xs="4">
                <AndreKriterierVelger
                  lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
                  valgtOppgavekoId={valgtOppgaveko.oppgavekoId}
                  valgtAvdelingEnhet={valgtAvdelingEnhet}
                  values={values}
                />
              </Column>
              <Column xs="4">
                <SorteringVelger
                  valgtOppgavekoId={valgtOppgaveko.oppgavekoId}
                  valgteBehandlingtyper={valgtOppgaveko.behandlingTyper}
                  valgtAvdelingEnhet={valgtAvdelingEnhet}
                  erDynamiskPeriode={values.erDynamiskPeriode}
                  fra={finnDagerSomTall(values.fra)}
                  til={finnDagerSomTall(values.til)}
                  fomDato={values.fomDato}
                  tomDato={values.tomDato}
                />
              </Column>
            </Row>
          </Panel>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  valgtAvdelingEnhet: getValgtAvdelingEnhet(state),
  antallOppgaver: getAntallOppgaverForOppgavekoResultat(state),
});

export default connect(mapStateToProps)(injectIntl(UtvalgskriterierForOppgavekoForm));
