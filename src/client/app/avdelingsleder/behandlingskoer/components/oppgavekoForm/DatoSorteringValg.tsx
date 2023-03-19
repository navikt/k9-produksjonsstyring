import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import moment from 'moment';
import { Undertekst } from 'nav-frontend-typografi';
import { DatepickerField } from 'form/FinalFields';
import ArrowBox from 'sharedComponents/ArrowBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import { hasValidDate } from 'utils/validation/validators';
import styles from './sorteringVelger.css';

const getLagreDatoFn =
  (lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, annenDato, erFomDato, hentKo) => e => {
    let dato = e.target.value;
    if (dato) {
      dato = moment(dato, DDMMYYYY_DATE_FORMAT, true);
    }
    if (!dato || dato.isValid()) {
      const d = dato ? dato.format(ISO_DATE_FORMAT) : dato;

      const params = erFomDato
        ? {
            id: valgtOppgavekoId,
            fomDato: d,
            tomDato: annenDato,
          }
        : {
            id: valgtOppgavekoId,
            fomDato: annenDato,
            tomDato: d,
          };

      return lagreOppgavekoSorteringTidsintervallDato(params).then(() => {
        hentKo(valgtOppgavekoId);
      });
    }
    return undefined;
  };
interface OwnProps {
  valgtOppgavekoId: string;
  lagreOppgavekoSorteringTidsintervallDato: (params: { id: string; fomDato: string; tomDato: string }) => void;
  hentOppgaveko: (id: string) => void;
  fomDato: string;
  tomDato: string;
}

export const DatoSorteringValg: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  valgtOppgavekoId,
  lagreOppgavekoSorteringTidsintervallDato,
  fomDato,
  tomDato,
  hentOppgaveko,
}) => (
  <div className={styles.arrowBoxContainer}>
    <ArrowBox>
      <Undertekst>
        <FormattedMessage id="SorteringVelger.FiltrerPaTidsintervall" />
      </Undertekst>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <DatepickerField
              name="fomDato"
              label={{ id: 'SorteringVelger.Fom' }}
              onBlurValidation
              validate={[hasValidDate]}
              onBlur={getLagreDatoFn(
                lagreOppgavekoSorteringTidsintervallDato,
                valgtOppgavekoId,
                tomDato,
                true,
                hentOppgaveko,
              )}
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
              onBlur={getLagreDatoFn(
                lagreOppgavekoSorteringTidsintervallDato,
                valgtOppgavekoId,
                fomDato,
                false,
                hentOppgaveko,
              )}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
    </ArrowBox>
  </div>
);

export default DatoSorteringValg;
