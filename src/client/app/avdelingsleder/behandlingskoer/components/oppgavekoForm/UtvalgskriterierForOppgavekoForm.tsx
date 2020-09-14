import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import {
  injectIntl, WrappedComponentProps, FormattedMessage, IntlShape,
} from 'react-intl';
import Panel from 'nav-frontend-paneler';
import { Undertittel, Element, Normaltekst } from 'nav-frontend-typografi';

import { Row, Column } from 'nav-frontend-grid';
import {
  required, minLength, maxLength, hasValidName,
} from 'utils/validation/validators';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { InputField } from 'form/FinalFields';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
import { getKodeverk } from 'kodeverk/duck';
import { bindActionCreators, Dispatch } from 'redux';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { Oppgaveko } from '../../oppgavekoTsType';
import {
  getAntallOppgaverForOppgavekoResultat,
  fetchOppgaveko,
  lagreOppgavekoSortering as lagreOppgavekoSorteringActionCreator,
  lagreOppgavekoSorteringTidsintervallDato as lagreOppgavekoSorteringTidsintervallDatoActionCreator, getOppgaveko,
} from '../../duck';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';
import AndreKriterierVelger from './AndreKriterierVelger';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';
import SorteringVelger from './SorteringVelger';

import styles from './utvalgskriterierForOppgavekoForm.less';

const minLength3 = minLength(3);
const maxLength100 = maxLength(100);

interface OwnProps {
  intl: any;
  alleKodeverk: {[key: string]: Kodeverk[]};
  gjeldendeKo: Oppgaveko;
  lagreOppgavekoNavn: (id: string, navn: string) => void;
  lagreOppgavekoBehandlingstype: (oppgavekoId: string, behandlingType: Kodeverk, isChecked: boolean) => void;
  lagreOppgavekoFagsakYtelseType: (oppgavekoId: string, fagsakYtelseType: Kodeverk) => void;
  lagreOppgavekoAndreKriterier: (id: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  lagreOppgavekoSkjermet: (id: string, isChecked: boolean) => void;
  antallOppgaver?: number;
  hentAntallOppgaverForOppgaveko: (oppgavekoId: string) => Promise<string>;
}

interface DispatchProps {
  fetchOppgaveko: (id: string) => Promise<string>;
  lagreOppgavekoSortering: (oppgavekoId: string, oppgavekoSorteringValg: KoSorteringType) => void;
  lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
}

/**
 * UtvalgskriterierForOppgavekoForm
 */
export class UtvalgskriterierForOppgavekoForm extends Component<OwnProps & DispatchProps & WrappedComponentProps> {
  componentDidMount = () => {
    const {
      gjeldendeKo, hentAntallOppgaverForOppgaveko, fetchOppgaveko: hentKo,
    } = this.props;
    hentAntallOppgaverForOppgaveko(gjeldendeKo.id);
  }

  componentDidUpdate = (prevProps: OwnProps) => {
    const {
      gjeldendeKo, hentAntallOppgaverForOppgaveko, fetchOppgaveko: hentKo,
    } = this.props;
    if (prevProps.gjeldendeKo.id !== gjeldendeKo.id) {
      hentAntallOppgaverForOppgaveko(gjeldendeKo.id);
    }
  }

  buildInitialValues = (intl: IntlShape) => {
    const {
      gjeldendeKo,
    } = this.props;

    const behandlingTypes = gjeldendeKo.behandlingTyper ? gjeldendeKo.behandlingTyper.reduce((acc, bt) => ({ ...acc, [bt.kode]: true }), {}) : {};
    const fagsakYtelseType = gjeldendeKo.fagsakYtelseTyper && gjeldendeKo.fagsakYtelseTyper.length > 0
      ? gjeldendeKo.fagsakYtelseTyper[0].kode : '';

    const andreKriterierTyper = gjeldendeKo.andreKriterier
      ? gjeldendeKo.andreKriterier.reduce((acc, ak) => ({ ...acc, [ak.andreKriterierType.kode]: true }), {}) : {};
    const andreKriterierInkluder = gjeldendeKo.andreKriterier
      ? gjeldendeKo.andreKriterier.reduce((acc, ak) => ({ ...acc, [`${ak.andreKriterierType.kode}_inkluder`]: ak.inkluder }), {}) : {};

    return {
      id: gjeldendeKo.id,
      navn: gjeldendeKo.navn ? gjeldendeKo.navn : intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.NyListe' }),
      sortering: gjeldendeKo.sortering ? gjeldendeKo.sortering.sorteringType.kode : undefined,
      fomDato: gjeldendeKo.sortering ? gjeldendeKo.sortering.fomDato : undefined,
      tomDato: gjeldendeKo.sortering ? gjeldendeKo.sortering.tomDato : undefined,
      skjermet: gjeldendeKo.skjermet,
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

  render = (): ReactNode => {
    const {
      intl, lagreOppgavekoBehandlingstype, lagreOppgavekoFagsakYtelseType, gjeldendeKo, antallOppgaver,
      lagreOppgavekoAndreKriterier, lagreOppgavekoSkjermet, alleKodeverk, lagreOppgavekoSortering,
      lagreOppgavekoSorteringTidsintervallDato,
    } = this.props;

    return (
      <div className={styles.form}>
        <Form
          onSubmit={() => undefined}
          initialValues={this.buildInitialValues(intl)}
          render={({ values }) => (
            <>
              <AutoLagringVedBlur lagre={this.tranformValues} fieldNames={['navn']} />
              <Row>
                <Column xs="9">
                  <InputField
                    name="navn"
                    label={intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.Navn' })}
                    validate={[required, minLength3, maxLength100, hasValidName]}
                    onBlurValidation
                    bredde="L"
                  />
                </Column>
                <Column className={styles.antall}>
                  <div className={styles.grayBox}>
                    <Normaltekst><FormattedMessage id="UtvalgskriterierForOppgavekoForm.AntallSaker" /></Normaltekst>
                    <Undertittel>{antallOppgaver || '0'}</Undertittel>
                  </div>
                </Column>
              </Row>
              <Row>
                <SkjermetVelger valgtOppgavekoId={gjeldendeKo.id} lagreSkjermet={lagreOppgavekoSkjermet} />
                <Column xs="12" className={styles.stonadstypeRadios}>
                  <FagsakYtelseTypeVelger
                    lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
                    valgtOppgavekoId={gjeldendeKo.id}
                    alleKodeverk={alleKodeverk}
                  />
                </Column>
              </Row>
              <Row>
                <Column xs="6">
                  <BehandlingstypeVelger
                    lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
                    valgtOppgavekoId={gjeldendeKo.id}
                    alleKodeverk={alleKodeverk}
                  />
                </Column>
                <Column className={styles.kriterier}>
                  <AndreKriterierVelger
                    lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
                    valgtOppgavekoId={gjeldendeKo.id}
                    values={values}
                    alleKodeverk={alleKodeverk}
                  />
                </Column>
                <Column className={styles.sortering}>
                  <SorteringVelger
                    valgtOppgavekoId={gjeldendeKo.id}
                    valgteBehandlingtyper={gjeldendeKo.behandlingTyper}
                    fomDato={values.fomDato}
                    tomDato={values.tomDato}
                    alleKodeverk={alleKodeverk as {[key: string]: KoSorteringType[]}}
                    lagreOppgavekoSortering={lagreOppgavekoSortering}
                    lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
                  />
                </Column>
              </Row>

            </>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  antallOppgaver: getAntallOppgaverForOppgavekoResultat(state),
  alleKodeverk: getKodeverk(state),
  gjeldendeKo: getOppgaveko(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    lagreOppgavekoSortering: lagreOppgavekoSorteringActionCreator,
    lagreOppgavekoSorteringTidsintervallDato: lagreOppgavekoSorteringTidsintervallDatoActionCreator,
    fetchOppgaveko,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(UtvalgskriterierForOppgavekoForm));
