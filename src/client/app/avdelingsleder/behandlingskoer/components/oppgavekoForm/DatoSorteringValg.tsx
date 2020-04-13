
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidDate, hasValidPosOrNegInteger } from 'utils/validation/validators';
import { Undertekst } from 'nav-frontend-typografi';
import DateLabel from 'sharedComponents/DateLabel';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import {
    InputField, CheckboxField, DatepickerField,
} from 'form/FinalFields';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import moment from 'moment';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ArrowBox from 'sharedComponents/ArrowBox';
import AutoLagringVedBlur from './AutoLagringVedBlur';
import styles from './sorteringVelger.less';

const finnDato = antallDager => moment().add(antallDager, 'd').format();
const getLagreDatoFn = (lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, valgtAvdelingEnhet, annenDato, erFomDato) => (e) => {
    let dato = e.target.value;
    if (dato) {
        dato = moment(dato, DDMMYYYY_DATE_FORMAT, true);
    }
    if (!dato || dato.isValid()) {
        const d = dato ? dato.format(ISO_DATE_FORMAT) : dato;
        return erFomDato
            ? lagreOppgavekoSorteringTidsintervallDato(valgtOppgavekoId, d, annenDato, valgtAvdelingEnhet)
            : lagreOppgavekoSorteringTidsintervallDato(valgtOppgavekoId, annenDato, d, valgtAvdelingEnhet);
    }
    return undefined;
};
interface TsProps {
    intl: any;
    valgtOppgavekoId: string;
    lagreOppgavekoSorteringErDynamiskPeriode: (oppgavekoId: string, avdelingEnhet: string) => void;
    lagreOppgavekoSorteringTidsintervallDato: (oppgavekoId: string, fomDato: string, tomDato: string, avdelingEnhet: string) => void;
    lagreOppgavekoSorteringTidsintervallDager: (oppgavekoId: string, fomDagr: number, tomDagr: number, avdelingEnhet: string) => void;
    valgtAvdelingEnhet: string;
    erDynamiskPeriode: boolean;
    fra: number;
    til: number;
    fomDato: string;
    tomDato: string;
}

export const DatoSorteringValg = ({
          intl,
          valgtOppgavekoId,
          lagreOppgavekoSorteringErDynamiskPeriode,
          valgtAvdelingEnhet,
          erDynamiskPeriode,
          lagreOppgavekoSorteringTidsintervallDato,
          lagreOppgavekoSorteringTidsintervallDager,
          fra,
          til,
          fomDato,
          tomDato,
      }: TsProps) => (

        <ArrowBox>
          <Undertekst>
            <FormattedMessage id="SorteringVelger.FiltrerPaTidsintervall" />
          </Undertekst>

          {erDynamiskPeriode && (
          <>
            <AutoLagringVedBlur
              lagre={values => lagreOppgavekoSorteringTidsintervallDager(valgtOppgavekoId, values.fra, values.til, valgtAvdelingEnhet)}
              fieldNames={['fra', 'til']}
            />
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <InputField
                    name="fra"
                    className={styles.dato}
                    label={intl.formatMessage({ id: 'SorteringVelger.Fom' })}
                    validate={[hasValidPosOrNegInteger]}
                    onBlurValidation
                    bredde="XS"
                  />
                  {(fra || fra === 0) && (
                  <Undertekst>
                    <DateLabel dateString={finnDato(fra)} />
                  </Undertekst>
                            )}
                </FlexColumn>
                <FlexColumn>
                  <Undertekst className={styles.dager}>
                    <FormattedMessage id="SorteringVelger.DagerMedBindestrek" />
                  </Undertekst>
                </FlexColumn>
                <FlexColumn>
                  <InputField
                    name="til"
                    className={styles.dato}
                    label={intl.formatMessage({ id: 'SorteringVelger.Tom' })}
                    validate={[hasValidPosOrNegInteger]}
                    onBlurValidation
                    bredde="XS"
                  />
                  {(til || til === 0) && (
                  <Undertekst>
                    <DateLabel dateString={finnDato(til)} />
                  </Undertekst>
                            )}
                </FlexColumn>
                <FlexColumn>
                  <Undertekst className={styles.dagerMedBindestrek}>
                    <FormattedMessage id="SorteringVelger.Dager" />
                  </Undertekst>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          </>
        )}
          {!erDynamiskPeriode && (
          <>
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <DatepickerField
                    name="fomDato"
                    label={{ id: 'SorteringVelger.Fom' }}
                    onBlurValidation
                    validate={[hasValidDate]}
                    onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, valgtAvdelingEnhet, tomDato, true)}
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
                    onBlur={getLagreDatoFn(lagreOppgavekoSorteringTidsintervallDato, valgtOppgavekoId, valgtAvdelingEnhet, fomDato, false)}
                  />
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          </>
        )}
          <CheckboxField
            name="erDynamiskPeriode"
            label={intl.formatMessage({ id: 'SorteringVelger.DynamiskPeriode' })}
            onChange={() => lagreOppgavekoSorteringErDynamiskPeriode(valgtOppgavekoId, valgtAvdelingEnhet)}
          />
          <VerticalSpacer eightPx />
        </ArrowBox>
);

export default DatoSorteringValg;
