import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';

import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import { Oppgaveko } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import styles from './skjermetVelger.less';

interface TsProps {
    valgtOppgaveko: Oppgaveko;
    lagreSkjermet: (oppgavekoId: string, skjermet: boolean) => void;
}

export const SkjermetVelger = ({
  lagreSkjermet, valgtOppgaveko,
}: TsProps) => (
  <div className={styles.skjermet}>
    <Undertekst>
      <FormattedMessage id="SkjermetVelger.Skjermet" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <CheckboxField
      label="Ja"
      onChange={(isChecked) => lagreSkjermet(valgtOppgaveko.id, isChecked)}
      name="skjermet"
    />
  </div>
);

export default SkjermetVelger;
