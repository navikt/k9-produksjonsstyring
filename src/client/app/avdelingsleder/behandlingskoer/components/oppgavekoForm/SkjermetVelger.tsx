import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { RadioGroupField, RadioOption } from 'form/FinalFields';

import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import styles from './utvalgskriterierForOppgavekoForm.less';

interface TsProps {
    valgtOppgaveko: Oppgaveko;
    lagreSkjermet: (oppgavekoId: string, skjermet: boolean) => void;
}

export const SkjermetVelger = ({
  lagreSkjermet, valgtOppgaveko,
}: TsProps) => (
  <div className={styles.skjermet}>
    <Normaltekst className={styles.label}>
      <FormattedMessage id="SkjermetVelger.Skjermet" />
    </Normaltekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      direction="vertical"
      name="skjermet"
      onChange={(isChecked) => lagreSkjermet(valgtOppgaveko.id, isChecked)}
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

export default SkjermetVelger;
