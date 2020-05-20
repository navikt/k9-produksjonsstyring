import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { getKodeverk } from 'kodeverk/duck';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';
import styles from './andreKriterierVelger.less';

interface TsProps {
  valgtOppgavekoId: string;
  lagreOppgavekoAndreKriterier: (oppgavekoId: string, andreKriterierType: Kodeverk, isChecked: boolean, inkluder: boolean) => void;
  andreKriterierTyper: Kodeverk[];
  values: any;
}

/**
 * AndreKriterierVelger
 */
export const AndreKriterierVelger = ({
  valgtOppgavekoId,
  lagreOppgavekoAndreKriterier,
  andreKriterierTyper,
    values,
}: TsProps) => (
  <>
    <Undertekst>
      <FormattedMessage id="AndreKriterierVelger.AndreKriterier" />
    </Undertekst>
    <VerticalSpacer eightPx />
    {andreKriterierTyper.map(akt => (
      <Fragment key={akt.kode}>
        <CheckboxField
          key={akt.kode}
          name={akt.kode}
          label={akt.navn}
          onChange={isChecked => lagreOppgavekoAndreKriterier(valgtOppgavekoId, akt, isChecked, true)}
        />
        {values[akt.kode] && (
          <div className={styles.arrowbox}>
            <ArrowBox alignOffset={30}>
              <RadioGroupField
                name={`${akt.kode}_inkluder`}
                onChange={skalInkludere => lagreOppgavekoAndreKriterier(valgtOppgavekoId, akt, true, skalInkludere)}
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
        )}
      </Fragment>
    ))
    }
  </>
);

AndreKriterierVelger.propTypes = {
  valgtOppgavekoId: PropTypes.string.isRequired,
  lagreOppgavekoAndreKriterier: PropTypes.func.isRequired,
  andreKriterierTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
};

const mapStateToProps = state => ({
  andreKriterierTyper: getKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE)(state),
});

export default connect(mapStateToProps)(AndreKriterierVelger);
