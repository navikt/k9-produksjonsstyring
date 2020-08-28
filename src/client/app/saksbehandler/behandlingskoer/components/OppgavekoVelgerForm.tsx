import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Form, FormSpy } from 'react-final-form';
import {
  injectIntl, WrappedComponentProps, FormattedMessage, IntlShape,
} from 'react-intl';
import { bindActionCreators, Dispatch } from 'redux';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import Image from 'sharedComponents/Image';
import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SelectField } from 'form/FinalFields';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';
import { getOppgavekoensSaksbehandlere, fetchAntallOppgaverForBehandlingsko, fetchOppgavekoensSaksbehandlere } from '../duck';
import { Saksbehandler } from '../saksbehandlerTsType';

import styles from './oppgavekoVelgerForm.less';

interface OwnProps {
  oppgavekoer: Oppgaveko[];
  fetchOppgavekoOppgaver: (id: string) => void;
  fetchOppgavekoensSaksbehandlere: (id: string) => void;
  fetchAntallOppgaverForBehandlingsko: (id: string) => void;
  saksbehandlere?: Saksbehandler[];
}

const getDefaultOppgaveko = (oppgavekoer) => {
  const lagretOppgavekoId = getValueFromLocalStorage('id');
  if (lagretOppgavekoId) {
    if (oppgavekoer.some((s) => `${s.id}` === lagretOppgavekoId)) {
      return lagretOppgavekoId;
    }
    removeValueFromLocalStorage('id');
  }

  const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) => oppgaveko1.navn.localeCompare(oppgaveko2.navn));
  return sortertOppgavekoer.length > 0 ? sortertOppgavekoer[0].id : undefined;
};

const getInitialValues = (oppgavekoer) => {
  if (oppgavekoer.length === 0) {
    return {
      id: undefined,
    };
  }
  const defaultOppgaveko = getDefaultOppgaveko(oppgavekoer);
  return {
    id: defaultOppgaveko ? `${defaultOppgaveko}` : undefined,
  };
};

const getValgtOppgaveko = (oppgavekoer: Oppgaveko[], oppgavekoId: string) => oppgavekoer.find((s) => oppgavekoId === `${s.id}`);

const getStonadstyper = (intl: IntlShape, oppgaveko?: Oppgaveko) => (oppgaveko && oppgaveko.fagsakYtelseTyper.length > 0
  ? oppgaveko.fagsakYtelseTyper.map((type) => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getBehandlingstyper = (oppgaveko?: Oppgaveko, intl: IntlShape) => (oppgaveko && oppgaveko.behandlingTyper.length > 0
  ? oppgaveko.behandlingTyper.map((type) => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getAndreKriterier = (oppgaveko?: Oppgaveko, intl: IntlShape) => (oppgaveko && oppgaveko.andreKriterier.length > 0
  ? oppgaveko.andreKriterier.map((ak) => ak.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getSorteringsnavn = (oppgaveko?: Oppgaveko, intl: IntlShape) => {
  if (!oppgaveko || !oppgaveko.sortering) {
    return '';
  }

  const {
    sorteringType, fomDato, tomDato,
  } = oppgaveko.sortering;
  let values = {
    br: <br />,
    fomDato: undefined,
    tomDato: undefined,
    navn: undefined,
  };

  if (!fomDato && !tomDato) {
    return sorteringType.navn;
  }
  values = {
    navn: sorteringType.navn,
    fomDato: fomDato ? moment(fomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
    tomDato: tomDato ? moment(tomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
    br: <br />,
  };

  if (!values.fomDato) {
    return intl.formatMessage({ id: 'OppgavekoVelgerForm.SorteringsinfoTom' }, values) as string;
  } if (!values.tomDato) {
    return intl.formatMessage({ id: 'OppgavekoVelgerForm.SorteringsinfoFom' }, values) as string;
  }
  return intl.formatMessage({ id: 'OppgavekoVelgerForm.Sorteringsinfo' }, values) as string;
};

/**
 * OppgavekoVelgerForm
 *
 */
export class OppgavekoVelgerForm extends Component<OwnProps & WrappedComponentProps> {
  static defaultProps = {
    saksbehandlere: [],
  };

  componentDidMount = () => {
    const {
      oppgavekoer, fetchOppgavekoOppgaver, fetchOppgavekoensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    if (oppgavekoer.length > 0) {
      const defaultOppgavekoId = getDefaultOppgaveko(oppgavekoer);
      if (defaultOppgavekoId) {
        fetchOppgavekoOppgaver(defaultOppgavekoId);
        fetchSaksbehandlere(defaultOppgavekoId);
        fetchAntallOppgaver(defaultOppgavekoId);
      }
    }
  }

  createTooltip = (): ReactNode | undefined => {
    const {
      saksbehandlere,
    } = this.props;
    if (!saksbehandlere || saksbehandlere.length === 0) {
      return undefined;
    }

    return (
      <div>
        <Element><FormattedMessage id="OppgavekoVelgerForm.SaksbehandlerToolip" /></Element>
        {saksbehandlere.sort((n1, n2) => n1.epost.localeCompare(n2.epost)).map((s) => (<Normaltekst key={s.epost}>{s.navn ? s.navn : s.epost}</Normaltekst>))}
      </div>
    );
  }

  render = () => {
    const {
      intl, oppgavekoer, fetchOppgavekoOppgaver, fetchOppgavekoensSaksbehandlere: fetchSaksbehandlere, fetchAntallOppgaverForBehandlingsko: fetchAntallOppgaver,
    } = this.props;
    return (
      <Form
        onSubmit={() => undefined}
        initialValues={getInitialValues(oppgavekoer)}
        render={({ values = {} }) => (
          <form>
            <Element><FormattedMessage id="OppgavekoVelgerForm.Utvalgskriterier" /></Element>
            <VerticalSpacer eightPx />
            <FormSpy
              onChange={(val) => {
                if (val && val.values.id && val.dirtyFields.id) {
                  setValueInLocalStorage('id', val.values.id);
                  const { id } = val.values;
                  fetchOppgavekoOppgaver(id);
                  fetchSaksbehandlere(id);
                  fetchAntallOppgaver(id);
                }
              }}
              subscription={{ values: true, dirtyFields: true }}
            />
            <FlexContainer>
              <FlexRow>
                <FlexColumn className={styles.navnInput}>
                  <SelectField
                    name="id"
                    label={intl.formatMessage({ id: 'OppgavekoVelgerForm.Oppgaveko' })}
                    selectValues={oppgavekoer
                      .map((oppgaveko) => (<option key={oppgaveko.id} value={`${oppgaveko.id}`}>{oppgaveko.navn}</option>))}
                    bredde="l"
                  />
                </FlexColumn>
                {values.id && (
                  <>
                    <FlexColumn>
                      <div className={styles.saksbehandlerIkon} />
                      <Image
                        alt={intl.formatMessage({ id: 'OppgavekoVelgerForm.Saksbehandlere' })}
                        src={gruppeUrl}
                        srcHover={gruppeHoverUrl}
                        tooltip={this.createTooltip()}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Stonadstype' })}
                        texts={getStonadstyper(intl, getValgtOppgaveko(oppgavekoer, values.id))}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Behandlingstype' })}
                        texts={getBehandlingstyper(getValgtOppgaveko(oppgavekoer, values.id), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.AndreKriterier' })}
                        texts={getAndreKriterier(getValgtOppgaveko(oppgavekoer, values.id), intl)}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Sortering' })}
                        texts={[getSorteringsnavn(getValgtOppgaveko(oppgavekoer, values.id), intl)]}
                      />
                    </FlexColumn>
                  </>
                )}
              </FlexRow>
            </FlexContainer>
          </form>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  saksbehandlere: getOppgavekoensSaksbehandlere(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchOppgavekoensSaksbehandlere,
    fetchAntallOppgaverForBehandlingsko,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OppgavekoVelgerForm));
