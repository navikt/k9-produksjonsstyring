import React, { FunctionComponent } from 'react';

import { Form } from 'react-final-form';
import {
  injectIntl, FormattedMessage, WrappedComponentProps,
} from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import {
  required, minLength, maxLength, hasValidName,
} from 'utils/validation/validators';
import { InputField } from 'form/FinalFields';
import Image from 'sharedComponents/Image';
import SkjermetVelger from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/SkjermetVelger';
import SaksbehandlereForOppgavekoForm from 'avdelingsleder/behandlingskoer/components/saksbehandlerForm/SaksbehandlereForOppgavekoForm';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { Oppgaveko } from '../../oppgavekoTsType';
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
  valgtOppgaveko: Oppgaveko;
  hentAlleOppgavekoer: () => void;
  visModal: () => void;
}

/**
 * UtvalgskriterierForOppgavekoForm
 */
export const UtvalgskriterierForOppgavekoForm: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgaveko,
  hentAlleOppgavekoer,
  visModal,
}) => {
  const buildInitialValues = () => {
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
  };

  const { startRequest: lagreOppgavekoNavn } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_NAVN);

  const transformValues = (values: {id: string; navn: string}) => {
    lagreOppgavekoNavn({ id: values.id, navn: values.navn }).then(() => hentAlleOppgavekoer());
  };

  const {
    startRequest: hentSaksbehandlere, data: alleSaksbehandlere = [],
  } = useRestApiRunner<Saksbehandler[]>(K9LosApiKeys.SAKSBEHANDLERE);

  return (
    <div className={styles.form}>
      <Form
        onSubmit={() => undefined}
        initialValues={buildInitialValues()}
        render={({ values }) => (
          <>
            <AutoLagringVedBlur lagre={transformValues} fieldNames={['navn']} />
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
                  valgtOppgavekoId={valgtOppgaveko.id}
                />
                <SkjermetVelger valgtOppgaveko={valgtOppgaveko} />
                <BehandlingstypeVelger
                  valgtOppgavekoId={valgtOppgaveko.id}
                />
              </Column>
              <Column xs="8" className={styles.middle}>
                <Column className={styles.middleColumn}>
                  <Normaltekst className={styles.header}>
                    <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Kriterier" />
                  </Normaltekst>
                  <hr className={styles.line} />
                  <AndreKriterierVelger
                    valgtOppgavekoId={valgtOppgaveko.id}
                    values={values}
                  />
                  <SorteringVelger
                    valgtOppgavekoId={valgtOppgaveko.id}
                    valgteBehandlingtyper={valgtOppgaveko.behandlingTyper}
                    fomDato={values.fomDato}
                    tomDato={values.tomDato}
                  />
                </Column>
                <Column className={styles.saksbehandlere}>
                  <Column>
                    <Normaltekst className={styles.header}>
                      <FormattedMessage id="UtvalgskriterierForOppgavekoForm.Saksbehandlere" />
                    </Normaltekst>
                    <hr className={styles.line1} />
                    <SaksbehandlereForOppgavekoForm
                      valgtOppgaveko={valgtOppgaveko}
                      alleSaksbehandlere={alleSaksbehandlere}
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
};

export default injectIntl(UtvalgskriterierForOppgavekoForm);
