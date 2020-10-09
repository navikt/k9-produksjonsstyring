import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import moment from 'moment';
import { Form, FormSpy } from 'react-final-form';
import {
  injectIntl, WrappedComponentProps, FormattedMessage, IntlShape,
} from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import Image from 'sharedComponents/Image';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SelectField } from 'form/FinalFields';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Saksbehandler } from '../saksbehandlerTsType';

import styles from './oppgavekoVelgerForm.less';

interface OwnProps {
  oppgavekoer: Oppgaveko[];
  saksbehandlere?: Saksbehandler[];
  setValgtOppgavekoId: (id: string) => void;
  fetchAntallOppgaver: (data: {id: string}) => void;
  getValueFromLocalStorage: (key: string) => string;
  setValueInLocalStorage: (key: string, value: string) => void;
  removeValueFromLocalStorage: (key: string) => void;
}

const getDefaultOppgaveko = (oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage) => {
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

const getInitialValues = (oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage) => {
  if (oppgavekoer.length === 0) {
    return {
      id: undefined,
    };
  }
  const defaultOppgaveko = getDefaultOppgaveko(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage);
  return {
    id: defaultOppgaveko ? `${defaultOppgaveko}` : undefined,
  };
};

const getValgtOppgaveko = (oppgavekoer: Oppgaveko[], oppgavekoId: string) => oppgavekoer.find((s) => oppgavekoId === `${s.id}`);

const getStonadstyper = (intl: IntlShape, oppgaveko?: Oppgaveko) => (oppgaveko && oppgaveko.fagsakYtelseTyper.length > 0
  ? oppgaveko.fagsakYtelseTyper.map((type) => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getBehandlingstyper = (intl: IntlShape, oppgaveko?: Oppgaveko) => (oppgaveko && oppgaveko.behandlingTyper.length > 0
  ? oppgaveko.behandlingTyper.map((type) => type.navn) : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })]);

const getAndreKriterier = (intl: IntlShape, oppgaveko?: Oppgaveko) => {
  if (oppgaveko && oppgaveko.andreKriterier.length > 0) {
    return oppgaveko.andreKriterier.map((ak) => (ak.inkluder ? ak.andreKriterierType.navn
      : intl.formatMessage({ id: 'OppgavekoVelgerForm.Uten' }, { kriterie: ak.andreKriterierType.navn })));
  }
  return [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];
};

const getSorteringsnavn = (intl: IntlShape, oppgaveko?: Oppgaveko) => {
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
export const OppgavekoVelgerForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  oppgavekoer,
  setValgtOppgavekoId,
  getValueFromLocalStorage,
  setValueInLocalStorage,
  removeValueFromLocalStorage,
  fetchAntallOppgaver,
}) => {
  const { data: saksbehandlere, startRequest: hentSaksbehandlere } = useRestApiRunner<Saksbehandler[]>(K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE);

  useEffect(() => {
    if (oppgavekoer.length > 0) {
      const defaultOppgavekoId = getDefaultOppgaveko(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage);
      if (defaultOppgavekoId) {
        setValgtOppgavekoId(defaultOppgavekoId);
        hentSaksbehandlere({ id: defaultOppgavekoId });
        fetchAntallOppgaver({ id: defaultOppgavekoId });
      }
    }
  }, []);

  const createTooltip = (): ReactNode | undefined => {
    if (!saksbehandlere || saksbehandlere.length === 0) {
      return undefined;
    }

    return (
      <div>
        <Element><FormattedMessage id="OppgavekoVelgerForm.SaksbehandlerToolip" /></Element>
        {saksbehandlere.sort((n1, n2) => n1.epost.localeCompare(n2.epost)).map((s) => (<Normaltekst key={s.epost}>{s.navn ? s.navn : s.epost}</Normaltekst>))}
      </div>
    );
  };
  return (
    <Form
      onSubmit={() => undefined}
      initialValues={getInitialValues(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage)}
      render={({ values = {} }) => (
        <form>
          <Element><FormattedMessage id="OppgavekoVelgerForm.Utvalgskriterier" /></Element>
          <VerticalSpacer eightPx />
          <FormSpy
            onChange={(val) => {
              if (val && val.values.id && val.dirtyFields.id) {
                setValueInLocalStorage('id', val.values.id);
                const { id } = val.values;
                setValgtOppgavekoId(id);
                hentSaksbehandlere({ id });
                fetchAntallOppgaver({ id });
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
                    tooltip={createTooltip()}
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
                    texts={getBehandlingstyper(intl, getValgtOppgaveko(oppgavekoer, values.id))}
                  />
                </FlexColumn>
                <FlexColumn className={styles.marginFilters}>
                  <LabelWithHeader
                    header={intl.formatMessage({ id: 'OppgavekoVelgerForm.AndreKriterier' })}
                    texts={getAndreKriterier(intl, getValgtOppgaveko(oppgavekoer, values.id))}
                  />
                </FlexColumn>
                <FlexColumn className={styles.marginFilters}>
                  <LabelWithHeader
                    header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Sortering' })}
                    texts={[getSorteringsnavn(intl, getValgtOppgaveko(oppgavekoer, values.id))]}
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
};

export default injectIntl(OppgavekoVelgerForm);
