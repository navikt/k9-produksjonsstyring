import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';

import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import useKodeverk from 'api/rest-api-hooks/global-data/useKodeverk';
import { K9LosApiKeys } from 'api/k9LosApi';
import styles from './andreKriterierVelger.less';

interface OwnProps {
  valgtOppgavekoId: string;
  values: any;
}

/**
 * AndreKriterierVelger
 */
const AndreKriterierVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  values,
}) => {
  const andreKriterierTyper = useKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE);
  const { startRequest: lagreOppgavekoAndreKriterier } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);

  return (
    <div className={styles.container}>
      {andreKriterierTyper.map((akt) => (
        <Fragment key={akt.kode}>
          <VerticalSpacer fourPx />
          <CheckboxField
            key={akt.kode}
            name={akt.kode}
            label={akt.navn}
            onChange={(isChecked) => lagreOppgavekoAndreKriterier({
              id: valgtOppgavekoId, andreKriterierType: akt, checked: isChecked, inkluder: true,
            }).then(() => {
              hentOppgaveko({ id: valgtOppgavekoId });
            })}
          />
          {values[akt.kode] && (
          <>
            <VerticalSpacer sixteenPx />
            <div className={styles.arrowbox}>
              <ArrowBox alignOffset={30}>
                <RadioGroupField
                  name={`${akt.kode}_inkluder`}
                  onChange={(skalInkludere) => lagreOppgavekoAndreKriterier({
                    id: valgtOppgavekoId, andreKriterierType: akt, checked: true, inkluder: skalInkludere,
                  }).then(() => {
                    hentOppgaveko({ id: valgtOppgavekoId });
                  })}
                >
                  <RadioOption
                    value
                    label={<FormattedMessage id="AndreKriterierVelger.TaMed" />}
                  />
                  <RadioOption
                    value={false}
                    label={<FormattedMessage id="AndreKriterierVelger.Fjern" />}
                  />
                </RadioGroupField>
              </ArrowBox>
            </div>
          </>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default AndreKriterierVelger;
