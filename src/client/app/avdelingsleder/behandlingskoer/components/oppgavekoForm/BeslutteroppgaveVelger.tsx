import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { RadioGroupField, RadioOption } from 'form/FinalFields';

import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import styles from './beslutteroppgaveVelger.less';

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  hentOppgaveko: (id: string) => void;
}

export const BeslutteroppgaveVelger: FunctionComponent<OwnProps> = ({ valgtOppgaveko, hentOppgaveko }) => {
  const { startRequest: lagreBeslutteroppgave } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SKJERMET); // endre endepunkt

  return (
    <div className={styles.container}>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="BeslutteroppgaveVelger.Beslutteroppgave" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <RadioGroupField
        direction="vertical"
        name="beslutteroppgave"
        onChange={isChecked =>
          // sette riktige verdier
          lagreBeslutteroppgave({ id: valgtOppgaveko.id, skjermet: isChecked }).then(() => {
            hentOppgaveko(valgtOppgaveko.id);
          })
        }
      >
        <RadioOption label="Ja" value />
        <RadioOption label="Nei" value={false} />
      </RadioGroupField>
    </div>
  );
};

export default BeslutteroppgaveVelger;
