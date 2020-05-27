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
import { Checkbox } from 'nav-frontend-skjema';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
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
  lagreOppgavekoNavn: (id: string, navn: string) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: Kodeverk) => void;
  lagreOppgavekoAndreKriterier: (id: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  antallOppgaver?: number;
  hentAntallOppgaverForOppgaveko: (oppgavekoId: string) => Promise<string>;
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
    antallOppgaver: PropTypes.number,
    hentAntallOppgaverForOppgaveko: PropTypes.func.isRequired,
    lagreOppgavekoSkjermet: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    const {
      valgtOppgaveko, hentAntallOppgaverForOppgaveko,
    } = this.props;
    hentAntallOppgaverForOppgaveko(valgtOppgaveko.id);
  }

  componentDidUpdate = (prevProps: TsProps) => {
    const {
      valgtOppgaveko, hentAntallOppgaverForOppgaveko,
    } = this.props;
    if (prevProps.valgtOppgaveko.id !== valgtOppgaveko.id) {
      hentAntallOppgaverForOppgaveko(valgtOppgaveko.id);
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
      id: valgtOppgaveko.id,
      navn: valgtOppgaveko.navn ? valgtOppgaveko.navn : intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.NyListe' }),
      sortering: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.sorteringType.kode : undefined,
      fomDato: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.fomDato : undefined,
      tomDato: valgtOppgaveko.sortering ? valgtOppgaveko.sortering.tomDato : undefined,
      skjermet: valgtOppgaveko.skjermet,
      fagsakYtelseType,
      ...andreKriterierTyper,
      ...andreKriterierInkluder,
      ...behandlingTypes,
    };
  }

  tranformValues = (values: {id: string; navn: string}) => {
    const {
      lagreOppgavekoNavn,
    } = this.props;
    lagreOppgavekoNavn(values.id, values.navn);
  }

  render = () => {
    const {
      intl, lagreOppgavekoBehandlingstype, lagreOppgavekoFagsakYtelseType, valgtOppgaveko, antallOppgaver,
      lagreOppgavekoAndreKriterier, lagreOppgavekoSkjermet,
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
              <SkjermetVelger valgtOppgavekoId={valgtOppgaveko.id} lagreSkjermet={lagreOppgavekoSkjermet} />
              <Column xs="6" className={styles.stonadstypeRadios}>
                <FagsakYtelseTypeVelger
                  lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
                  valgtOppgavekoId={valgtOppgaveko.id}
                  valgtFagsakYtelseType={values ? values.fagsakYtelseType : ''}
                />
              </Column>
            </Row>
            <Row>
              <Column xs="3">
                <BehandlingstypeVelger
                  lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
                  valgtOppgavekoId={valgtOppgaveko.id}
                />
              </Column>
              <Column xs="4">
                <AndreKriterierVelger
                  lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
                  valgtOppgavekoId={valgtOppgaveko.id}
                  values={values}
                />
              </Column>
              <Column xs="4">
                <SorteringVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  valgteBehandlingtyper={valgtOppgaveko.behandlingTyper}
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
  antallOppgaver: getAntallOppgaverForOppgavekoResultat(state),
});

export default connect(mapStateToProps)(injectIntl(UtvalgskriterierForOppgavekoForm));
