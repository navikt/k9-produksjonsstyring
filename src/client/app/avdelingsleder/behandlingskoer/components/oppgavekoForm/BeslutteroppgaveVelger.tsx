import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { RadioGroupField, RadioOption } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import andreKriterierType from 'kodeverk/andreKriterierType';
import styles from './beslutteroppgaveVelger.less';

interface OwnProps {
  valgtOppgaveko: Oppgaveko;
  hentOppgaveko: (id: string) => void;
}

export const BeslutteroppgaveVelger: FunctionComponent<OwnProps> = ({ valgtOppgaveko, hentOppgaveko }) => {
  const { startRequest: lagreOppgavekoAndreKriterier } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER);

  const handleOnChange = (isChecked: boolean) => {
    lagreOppgavekoAndreKriterier({
      id: valgtOppgaveko.id,
      andreKriterierType: andreKriterierType.TIL_BESLUTTER,
      checked: isChecked,
      inkluder: true,
    }).then(() => {
      hentOppgaveko(valgtOppgaveko.id);
    });
  };

  return (
    <div className={styles.container}>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="BeslutteroppgaveVelger.Beslutteroppgave" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <RadioGroupField direction="vertical" name="beslutteroppgave" onChange={handleOnChange}>
        <RadioOption label="Ja" value />
        <RadioOption label="Nei" value={false} />
      </RadioGroupField>
    </div>
  );
};

export default BeslutteroppgaveVelger;
