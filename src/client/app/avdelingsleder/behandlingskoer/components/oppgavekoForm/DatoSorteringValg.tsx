import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidDate } from 'utils/validation/validators';
import { Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import React, { FunctionComponent } from 'react';
import {
  DatepickerField,
} from 'form/FinalFields';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import moment from 'moment';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import styles from './sorteringVelger.less';

const finnDato = (antallDager) => moment().add(antallDager, 'd').format();
const getLagreDatoFn = (lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, annenDato, erFomDato) => (e) => {
  let dato = e.target.value;
  if (dato) {
    dato = moment(dato, DDMMYYYY_DATE_FORMAT, true);
  }
  if (!dato || dato.isValid()) {
    const d = dato ? dato.format(ISO_DATE_FORMAT) : dato;
    return erFomDato
      ? lagreOppgavekoSorteringTidsintervallDato(valgtOppgavekoId, d, annenDato)
      : lagreOppgavekoSorteringTidsintervallDato(valgtOppgavekoId, annenDato, d);
  }
  return undefined;
};
interface OwnProps {
    valgtOppgavekoId: string;
    lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string) => void;
    fomDato: string;
    tomDato: string;
}

export const DatoSorteringValg: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  lagreOppgavekoSorteringTidsintervallDato,
  fomDato,
  tomDato,
}) => (
  <ArrowBox>
    <Undertekst>
      <FormattedMessage id="SorteringVelger.FiltrerPaTidsintervall" />
    </Undertekst>
    <>
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.kalender}>
            <DatepickerField
              name="fomDato"
              label={{ id: 'SorteringVelger.Fom' }}
              onBlurValidation
              validate={[hasValidDate]}
              onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, tomDato, true)}
            />
          </FlexColumn>
          <FlexColumn>
            <Undertekst className={styles.dager}>
              <FormattedMessage id="SorteringVelger.Bindestrek" />
            </Undertekst>
          </FlexColumn>
          <FlexColumn className={styles.tomDato}>
            <DatepickerField
              name="tomDato"
              label={{ id: 'SorteringVelger.Tom' }}
              onBlurValidation
              validate={[hasValidDate]}
              onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, fomDato, false)}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </>
    <VerticalSpacer eightPx />
  </ArrowBox>
);

export default DatoSorteringValg;
