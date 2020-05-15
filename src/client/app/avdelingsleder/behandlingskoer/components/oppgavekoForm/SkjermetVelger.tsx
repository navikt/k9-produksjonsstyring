import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField } from 'form/FinalFields';

import styles from './skjermetVelger.less';


interface TsProps {
    valgtOppgavekoId: string;
    lagreSkjermet: (oppgavekoId: string, skjermet: boolean) => void;
}

export const SkjermetVelger = ({
 lagreSkjermet, valgtOppgavekoId,
}: TsProps) => (
  <div className={styles.skjermet}>
    <Undertekst>
      <FormattedMessage id="SkjermetVelger.Skjermet" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <CheckboxField
      label="Ja"
      onChange={isChecked => lagreSkjermet(valgtOppgavekoId, isChecked)}
      name="skjermet"
    />
  </div>
);

export default SkjermetVelger;
