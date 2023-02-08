import React, { FunctionComponent } from 'react';

import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApi } from 'api/rest-api-hooks';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
import SaksbehandlereForOppgavekoForm from 'avdelingsleder/behandlingskoer/components/saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { InputField } from 'form/FinalFields';
import { Normaltekst } from 'nav-frontend-typografi';
import { Form } from 'react-final-form';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import Image from 'sharedComponents/Image';
import { hasValidName, maxLength, minLength, required } from 'utils/validation/validators';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { Oppgaveko } from '../../oppgavekoTsType';
import AndreKriterierVelger from './AndreKriterierVelger';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import BehandlingstypeVelger from './BehandlingstypeVelger';
import FagsakYtelseTypeVelger from './FagsakYtelseTypeVelger';
import SorteringVelger from './SorteringVelger';

import binIcon from '../../../../../images/bin-1.svg';
import MerknadVelger from './MerknadVelger';
import OppgaveKoKriterieVelger from './OppgaveKøKriterieVelger';
import styles from './utvalgskriterierForOppgavekoForm.less';

const minLength3 = minLength(3);
const maxLength100 = maxLength(100);

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  hentAlleOppgavekoer: () => void;
  visModal: () => void;
  hentKo: (id: string) => void;
}

const buildInitialValues = (intl: IntlShape, ko: Oppgaveko) => {
  const behandlingTypes = ko.behandlingTyper
    ? ko.behandlingTyper.reduce((acc, bt) => ({ ...acc, [bt]: true }), {})
    : {};
  const fagsakYtelseTyper = ko.fagsakYtelseTyper && ko.fagsakYtelseTyper.length > 0 ? ko.fagsakYtelseTyper : [];

  const andreKriterierTyper = ko.andreKriterier
    ? ko.andreKriterier.reduce((acc, ak) => ({ ...acc, [ak.andreKriterierType]: true }), {})
    : {};
  const andreKriterierInkluder = ko.andreKriterier
    ? ko.andreKriterier.reduce((acc, ak) => ({ ...acc, [`${ak.andreKriterierType}_inkluder`]: ak.inkluder }), {})
    : {};
  const køKriterierInkluder = ko.kriterier
    ? ko.kriterier.reduce(
        (acc, køKriterie) => ({ ...acc, [`${køKriterie.kriterierType.kode}_inkluder`]: køKriterie.inkluder }),
        {},
      )
    : {};

  return {
    id: ko.id,
    navn: ko.navn ? ko.navn : intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.NyListe' }),
    sortering: ko.sortering ? ko.sortering.sorteringType.kode : undefined,
    fomDato: ko.sortering ? ko.sortering.fomDato : undefined,
    tomDato: ko.sortering ? ko.sortering.tomDato : undefined,
    kriterier: ko.kriterier,
    skjermet: ko.skjermet,
    fagsakYtelseTyper,
    behandlingTypes,
    ...andreKriterierTyper,
    ...andreKriterierInkluder,
    ...køKriterierInkluder,
  };
};

/**
 * UtvalgskriterierForOppgavekoForm
 */
export const UtvalgskriterierForOppgavekoForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgaveko,
  hentAlleOppgavekoer,
  hentKo,
  visModal,
}) => {
  const { startRequest: lagreOppgavekoNavn } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_NAVN);

  const transformValues = (values: { id: string; navn: string }) => {
    lagreOppgavekoNavn({ id: values.id, navn: values.navn })
      .then(() => hentAlleOppgavekoer())
      .then(() => hentKo(values.id));
  };

  const { data: alleSaksbehandlere = [] } = useRestApi<Saksbehandler[]>(K9LosApiKeys.SAKSBEHANDLERE);

  return (
    <div className={styles.form}>
      <Form
        onSubmit={() => undefined}
        initialValues={buildInitialValues(intl, valgtOppgaveko)}
        render={({ values }) => (
          <>
            <AutoLagringVedBlur lagre={transformValues} fieldNames={['navn']} />
            <div className={styles.container}>
              <div>
                <Normaltekst className={styles.header}>
                  <FormattedMessage id="UtvalgskriterierForOppgavekoForm.OmKoen" />
                </Normaltekst>
                <hr className={styles.line} />
                <Normaltekst className={styles.label}>
                  {intl.formatMessage({ id: 'UtvalgskriterierForOppgavekoForm.Navn' })}
                </Normaltekst>
                <InputField
                  className={styles.navn}
                  name="navn"
                  validate={[required, minLength3, maxLength100, hasValidName]}
                  onBlurValidation
                  bredde="M"
                />
                <FagsakYtelseTypeVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  fagsakYtelseTyper={values.fagsakYtelseTyper}
                  hentOppgaveko={hentKo}
                />
                <SkjermetVelger valgtOppgaveko={valgtOppgaveko} hentOppgaveko={hentKo} />
                <BehandlingstypeVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  hentOppgaveko={hentKo}
                  valgteBehandlingstyper={valgtOppgaveko.behandlingTyper}
                />
              </div>
              <div>
                <Normaltekst className={styles.header}>
                  <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Kriterier" />
                </Normaltekst>
                <hr className={styles.line} />
                <AndreKriterierVelger valgtOppgavekoId={valgtOppgaveko.id} values={values} hentOppgaveko={hentKo} />
                <OppgaveKoKriterieVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  values={values}
                  hentOppgaveko={hentKo}
                  kodeverkType={kodeverkTyper.NYE_KRAV}
                  endepunkt={K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER}
                />
                <OppgaveKoKriterieVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  values={values}
                  hentOppgaveko={hentKo}
                  kodeverkType={kodeverkTyper.SOKNADSDATA_ENDRET}
                  endepunkt={K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER}
                />

                <MerknadVelger valgtOppgavekoId={valgtOppgaveko.id} values={values} hentOppgaveko={hentKo} />
                <SorteringVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                  fomDato={values.fomDato}
                  tomDato={values.tomDato}
                  kriterier={values.kriterier}
                  hentOppgaveko={hentKo}
                />
              </div>
              <div className={styles.saksbehandler}>
                <Normaltekst className={styles.header}>
                  <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Saksbehandlere" />
                </Normaltekst>
                <hr className={styles.line1} />
                <SaksbehandlereForOppgavekoForm
                  valgtOppgaveko={valgtOppgaveko}
                  alleSaksbehandlere={alleSaksbehandlere}
                  hentOppgaveko={hentKo}
                />
              </div>
              <div>
                <div className={styles.slettContainer}>
                  <Image src={binIcon} />
                  <div
                    id="slett"
                    role="button"
                    className={styles.slett}
                    onClick={visModal}
                    onKeyDown={visModal}
                    tabIndex={0}
                  >
                    Slett kø
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default injectIntl(UtvalgskriterierForOppgavekoForm);
