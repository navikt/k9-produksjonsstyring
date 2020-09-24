import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import {
  injectIntl, FormattedMessage, IntlShape,
} from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import {
  required, minLength, maxLength, hasValidName,
} from 'utils/validation/validators';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { InputField } from 'form/FinalFields';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
import { getKodeverk } from 'kodeverk/duck';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { SaksbehandlereForOppgavekoForm } from 'avdelingsleder/behandlingskoer/components/saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import Image from 'sharedComponents/Image';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { Oppgaveko } from '../../oppgavekoTsType';
import {
  getAntallOppgaverForOppgavekoResultat,
  getOppgaveko,
} from '../../duck';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';
import AndreKriterierVelger from './AndreKriterierVelger';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';
import SorteringVelger from './SorteringVelger';

import styles from './utvalgskriterierForOppgavekoForm.less';
import binIcon from '../../../../../images/bin-1.svg';

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
  knyttSaksbehandlerTilOppgaveko: (id: string, epost: string, isChecked: boolean) => void;
  visModal: () => void;
  saksbehandlere: Saksbehandler[];
}

interface DispatchProps {
  fetchOppgaveko: (id: string) => Promise<string>;
  lagreOppgavekoSortering: (oppgavekoId: string, oppgavekoSorteringValg: KoSorteringType) => void;
  lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
}

interface StateTsProps {
  visSlettModal: boolean;
}

/**
 * UtvalgskriterierForOppgavekoForm
 */
export class UtvalgskriterierForOppgavekoForm extends Component<OwnProps & DispatchProps & StateTsProps> {
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
      intl, lagreOppgavekoBehandlingstype, lagreOppgavekoFagsakYtelseType, gjeldendeKo,
      lagreOppgavekoAndreKriterier, lagreOppgavekoSkjermet, alleKodeverk, lagreOppgavekoSortering,
      lagreOppgavekoSorteringTidsintervallDato, knyttSaksbehandlerTilOppgaveko, visModal, saksbehandlere,
    } = this.props;

    return (
      <div className={styles.form}>
        <Form
          onSubmit={() => undefined}
          initialValues={this.buildInitialValues(intl)}
          render={({ values }) => (
            <>
              <AutoLagringVedBlur lagre={this.tranformValues} fieldNames={['navn']} />
              <Row className={styles.row}>
                <Column xs="4" className={styles.leftColumn}>
                  <Normaltekst className={styles.header}>
                    <FormattedMessage id="UtvalgskriterierForOppgavekoForm.OmKoen" />
                  </Normaltekst>
                  <hr className={styles.line} />
                  <Normaltekst className={styles.label}>{intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.Navn' })}</Normaltekst>
                  <InputField
                    className={styles.navn}
                    name="navn"
                    validate={[required, minLength3, maxLength100, hasValidName]}
                    onBlurValidation
                    bredde="M"
                  />
                  <FagsakYtelseTypeVelger
                    lagreOppgavekoFagsakYtelseType={lagreOppgavekoFagsakYtelseType}
                    valgtOppgavekoId={gjeldendeKo.id}
                    alleKodeverk={alleKodeverk}
                  />
                  <SkjermetVelger valgtOppgaveko={gjeldendeKo} lagreSkjermet={lagreOppgavekoSkjermet} />
                  <BehandlingstypeVelger
                    lagreOppgavekoBehandlingstype={lagreOppgavekoBehandlingstype}
                    valgtOppgavekoId={gjeldendeKo.id}
                    alleKodeverk={alleKodeverk}
                  />
                </Column>
                <Column xs="7" className={styles.middle}>
                  <Column className={styles.middleColumn}>
                    <Normaltekst className={styles.header}>
                      <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Kriterier" />
                    </Normaltekst>
                    <hr className={styles.line} />
                    <AndreKriterierVelger
                      lagreOppgavekoAndreKriterier={lagreOppgavekoAndreKriterier}
                      valgtOppgavekoId={gjeldendeKo.id}
                      values={values}
                      alleKodeverk={alleKodeverk}
                    />
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
                  <Column className={styles.saksbehandlere}>
                    <Column>
                      <Normaltekst className={styles.header}>
                        <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Saksbehandlere" />
                      </Normaltekst>
                      <hr className={styles.line1} />
                      <SaksbehandlereForOppgavekoForm
                        valgtOppgaveko={gjeldendeKo}
                        alleSaksbehandlere={saksbehandlere}
                        knyttSaksbehandlerTilOppgaveko={knyttSaksbehandlerTilOppgaveko}
                      />
                    </Column>
                    <Column>
                      <div className={styles.slettContainer}>
                        <Image src={binIcon} />
                        <div
                          id="slett"
                          className={styles.slett}
                          role="button"
                          onClick={visModal}
                          onKeyDown={visModal}
                          tabIndex={0}
                        >
                          Slett kø
                        </div>
                      </div>
                    </Column>
                  </Column>
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

export default connect(mapStateToProps)(injectIntl(UtvalgskriterierForOppgavekoForm));
