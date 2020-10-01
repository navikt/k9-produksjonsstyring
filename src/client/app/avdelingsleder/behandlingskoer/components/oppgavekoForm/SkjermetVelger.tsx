import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { RadioGroupField, RadioOption } from 'form/FinalFields';

import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import styles from './utvalgskriterierForOppgavekoForm.less';

interface OwnProps {
    valgtOppgaveko: Oppgaveko;
}

export const SkjermetVelger: FunctionComponent<OwnProps> = ({
  valgtOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoSkjermet } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SKJERMET);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);

  return (
    <div className={styles.skjermet}>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="SkjermetVelger.Skjermet" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <RadioGroupField
        direction="vertical"
        name="skjermet"
        onChange={(isChecked) => lagreOppgavekoSkjermet({ id: valgtOppgaveko.id, skjermet: isChecked }).then(() => {
          hentOppgaveko({ id: valgtOppgaveko.id });
        })}
      >
        <RadioOption
          label="Ja"
          value
        />
        <RadioOption
          label="Nei"
          value={false}
        />
      </RadioGroupField>
    </div>
  );
};

export default SkjermetVelger;
