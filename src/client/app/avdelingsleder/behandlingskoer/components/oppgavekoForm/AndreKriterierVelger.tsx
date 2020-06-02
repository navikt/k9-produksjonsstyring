import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';

import styles from './andreKriterierVelger.less';

interface OwnProps {
  alleKodeverk: {[key: string]: Kodeverk[]};
  valgtOppgavekoId: string;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, skalInkludere: boolean) => void;
  values: any;
}

/**
 * AndreKriterierVelger
 */
const AndreKriterierVelger: FunctionComponent<OwnProps> = ({
  alleKodeverk,
  valgtOppgavekoId,
  lagreOppgavekoAndreKriterier,
  values,
}) => (
  <>
    <Undertekst>
      <FormattedMessage id="AndreKriterierVelger.AndreKriterier" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {alleKodeverk[kodeverkTyper.ANDRE_KRITERIER_TYPE].map((akt) => (
      <Fragment key={akt.kode}>
        <VerticalSpacer fourPx />
        <CheckboxField
          key={akt.kode}
          name={akt.kode}
          label={akt.navn}
          onChange={(isChecked) => lagreOppgavekoAndreKriterier(valgtOppgavekoId, akt, isChecked, true)}
        />
        {values[akt.kode] && (
        <>
          <VerticalSpacer sixteenPx />
          <div className={styles.arrowbox}>
            <ArrowBox alignOffset={30}>
              <RadioGroupField
                name={`${akt.kode}_inkluder`}
                onChange={(skalInkludere) => lagreOppgavekoAndreKriterier(valgtOppgavekoId, akt, true, skalInkludere)}
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
  </>
);

export default AndreKriterierVelger;
