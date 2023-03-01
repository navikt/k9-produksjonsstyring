import React, { FunctionComponent, ReactNode, useEffect } from 'react';
import moment from 'moment';
import { Form, FormSpy } from 'react-final-form';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import Image from 'sharedComponents/Image';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import { Oppgaveko } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SelectField } from 'form/FinalFields';
import gruppeHoverUrl from 'images/gruppe_hover.svg';
import gruppeUrl from 'images/gruppe.svg';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Hovedknapp } from 'nav-frontend-knapper';

import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import styles from './oppgavekoVelgerForm.css';
import { Saksbehandler } from '../saksbehandlerTsType';

interface OwnProps {
  oppgavekoer: Oppgaveko[];
  setValgtOppgavekoId: (id: string) => void;
  getValueFromLocalStorage: (key: string) => string;
  setValueInLocalStorage: (key: string, value: string) => void;
  removeValueFromLocalStorage: (key: string) => void;
  plukkNyOppgave: () => void;
  erRestApiKallLoading: boolean;
}

const getDefaultOppgaveko = (oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage) => {
  const lagretOppgavekoId = getValueFromLocalStorage('id');
  if (lagretOppgavekoId) {
    if (oppgavekoer.some(s => `${s.id}` === lagretOppgavekoId)) {
      return lagretOppgavekoId;
    }
    removeValueFromLocalStorage('id');
  }

  const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) =>
    oppgaveko1.navn.localeCompare(oppgaveko2.navn),
  );
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

const getValgtOppgaveko = (oppgavekoer: Oppgaveko[], oppgavekoId: string) =>
  oppgavekoer.find(s => oppgavekoId === `${s.id}`);

const getStonadstyper = (intl: IntlShape, alleKodeverk: AlleKodeverk, oppgaveko?: Oppgaveko) =>
  oppgaveko && oppgaveko.fagsakYtelseTyper.length > 0
    ? oppgaveko.fagsakYtelseTyper.map(type =>
        getKodeverknavnFraKode(type, kodeverkTyper.FAGSAK_YTELSE_TYPE, alleKodeverk),
      )
    : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];

const getBehandlingstyper = (intl: IntlShape, alleKodeverk: AlleKodeverk, oppgaveko?: Oppgaveko) =>
  oppgaveko && oppgaveko.behandlingTyper.length > 0
    ? oppgaveko.behandlingTyper.map(type => getKodeverknavnFraKode(type, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk))
    : [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];

const getAndreKriterier = (intl: IntlShape, oppgaveko?: Oppgaveko) => {
  if (oppgaveko && oppgaveko.andreKriterier.length > 0) {
    return oppgaveko.andreKriterier.map(ak =>
      ak.inkluder
        ? ak.andreKriterierType.navn
        : intl.formatMessage({ id: 'OppgavekoVelgerForm.Uten' }, { kriterie: ak.andreKriterierType.navn }),
    );
  }
  return [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];
};

const getSorteringsnavn = (intl: IntlShape, oppgaveko?: Oppgaveko) => {
  if (!oppgaveko || !oppgaveko.sortering) {
    return '';
  }
  const { sorteringType, fomDato, tomDato } = oppgaveko.sortering;
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
  }
  if (!values.tomDato) {
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
  plukkNyOppgave,
  erRestApiKallLoading,
}) => {
  const { data: saksbehandlere, startRequest: hentSaksbehandlere } = useRestApiRunner<Saksbehandler[]>(
    K9LosApiKeys.OPPGAVEKO_SAKSBEHANDLERE,
  );
  const { startRequest: fetchAntallOppgaver, data: antallOppgaver } = useRestApiRunner<number>(
    K9LosApiKeys.BEHANDLINGSKO_OPPGAVE_ANTALL,
  );
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  useEffect(() => {
    if (oppgavekoer.length > 0) {
      const defaultOppgavekoId = getDefaultOppgaveko(
        oppgavekoer,
        getValueFromLocalStorage,
        removeValueFromLocalStorage,
      );
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
        <Element className={styles.tooltipHeader}>
          <FormattedMessage id="OppgavekoVelgerForm.SaksbehandlerToolip" />
        </Element>
        {saksbehandlere
          .sort((n1, n2) => n1.epost.localeCompare(n2.epost))
          .map(s => (
            <li key={s.epost}>{s.navn ? s.navn : s.epost}</li>
          ))}
      </div>
    );
  };
  return (
    <div className={styles.oppgavevelgerform_container}>
      <Form
        onSubmit={() => undefined}
        initialValues={getInitialValues(oppgavekoer, getValueFromLocalStorage, removeValueFromLocalStorage)}
        render={({ values = {} }) => (
          <form>
            <FormSpy
              onChange={val => {
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
                    selectValues={oppgavekoer.map(oppgaveko => (
                      <option key={oppgaveko.id} value={`${oppgaveko.id}`}>
                        {oppgaveko.navn}
                      </option>
                    ))}
                    bredde="l"
                  />
                  <VerticalSpacer eightPx />
                  <Undertekst>
                    <FormattedMessage
                      id="OppgavekoVelgerForm.AntallOppgaver"
                      values={{ antall: antallOppgaver || 0 }}
                    />
                  </Undertekst>
                  <VerticalSpacer sixteenPx />
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
                        texts={getStonadstyper(intl, alleKodeverk, getValgtOppgaveko(oppgavekoer, values.id))}
                      />
                    </FlexColumn>
                    <FlexColumn className={styles.marginFilters}>
                      <LabelWithHeader
                        header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Behandlingstype' })}
                        texts={getBehandlingstyper(intl, alleKodeverk, getValgtOppgaveko(oppgavekoer, values.id))}
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
      <Hovedknapp
        className={styles.nyOppgaveBtn}
        spinner={erRestApiKallLoading}
        disabled={erRestApiKallLoading}
        onClick={() => plukkNyOppgave()}
      >
        {intl.formatMessage({ id: 'OppgavekoVelgerForm.PlukkNyOppgave' })}
      </Hovedknapp>
    </div>
  );
};

export default injectIntl(OppgavekoVelgerForm);
