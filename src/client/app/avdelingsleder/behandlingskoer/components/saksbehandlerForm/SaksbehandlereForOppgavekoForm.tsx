import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField } from 'form/FinalFields';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import { Oppgaveko } from '../../oppgavekoTsType';

import styles from './saksbehandlereForOppgavekoForm.less';

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  alleSaksbehandlere: Saksbehandler[];
}

/**
 * SaksbehandlereForOppgavekoForm
 */
const SaksbehandlereForOppgavekoForm: FunctionComponent<OwnProps> = ({ valgtOppgaveko, alleSaksbehandlere }) => {
  const buildInitialValues = () => {
    const identer = valgtOppgaveko.saksbehandlere ? valgtOppgaveko.saksbehandlere.reduce((acc, sb) => (
      { ...acc, [sb.epost.replace(/\./g, '')]: true }), {}) : {};
    return {
      ...identer,
    };
  };

  const pos = Math.ceil(alleSaksbehandlere.length / 2);
  const alleSaksbehandlereVenstreListe = alleSaksbehandlere.slice(0, pos);
  const alleSaksbehandlereHoyreListe = alleSaksbehandlere.slice(pos);

  const { startRequest: knyttSaksbehandlerTilOppgaveko } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);

  return (
    <Form
      onSubmit={() => undefined}
      initialValues={buildInitialValues()}
      render={() => (
        <div className={styles.panel}>
          <VerticalSpacer sixteenPx />
          {alleSaksbehandlere.length === 0 && (
          <FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
          )}
          {alleSaksbehandlere.length > 0 && (
            <Row>
              <Column xs="4">
                {alleSaksbehandlereVenstreListe.map((s) => (
                  <div className={styles.checkBox}>
                    <CheckboxField
                      key={s.epost}
                      name={s.epost.replace(/\./g, '')}
                      label={s.navn ? s.navn : s.epost}
                      onChange={(isChecked) => knyttSaksbehandlerTilOppgaveko({ id: valgtOppgaveko.id, epost: s.epost, checked: isChecked }).then(() => {
                        hentOppgaveko({ id: valgtOppgaveko.id });
                      })}
                    />
                  </div>
                ))}
              </Column>
              <Column xs="8" className={styles.hoyre}>
                {alleSaksbehandlereHoyreListe.map((s) => (
                  <div className={styles.checkBox}>
                    <CheckboxField
                      key={s.epost}
                      name={s.epost.replace(/\./g, '')}
                      label={s.navn ? s.navn : s.epost}
                      onChange={(isChecked) => knyttSaksbehandlerTilOppgaveko({ id: valgtOppgaveko.id, epost: s.epost, checked: isChecked }).then(() => {
                        hentOppgaveko({ id: valgtOppgaveko.id });
                      })}
                    />
                  </div>
                ))}
              </Column>
            </Row>
          )}
        </div>
      )}
    />
  );
};

export default SaksbehandlereForOppgavekoForm;
