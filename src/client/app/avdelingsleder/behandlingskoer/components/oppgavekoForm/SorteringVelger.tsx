import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {Normaltekst, Undertekst} from 'nav-frontend-typografi';
import {RadioGroupField, RadioOption,} from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import {K9LosApiKeys} from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import styles from './utvalgskriterierForOppgavekoForm.less';
import DatoSorteringValg from './DatoSorteringValg';
import {TextField} from '@navikt/ds-react';
import ArrowBox from "sharedComponents/ArrowBox";
import BelopSorteringValg from "avdelingsleder/behandlingskoer/components/oppgavekoForm/BelopSorteringValg";


interface OwnProps {
  intl: any;
  valgtOppgavekoId: string;
  fomDato: string;
  tomDato: string;
  hentOppgaveko:(id: string) => void;
}

/**
 * SorteringVelger
 */
const SorteringVelger: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  fomDato,
  tomDato,
  hentOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoSortering } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING);
  const { startRequest: lagreOppgavekoSorteringTidsintervallDato } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO);
  const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);



  return (
    <>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="SorteringVelger.Sortering" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      <div>
        <RadioGroupField
          name="sortering"
          direction="vertical"
          onChange={(sorteringType) => lagreOppgavekoSortering({ id: valgtOppgavekoId, oppgavekoSorteringValg: sorteringType }).then(() => {
            hentOppgaveko(valgtOppgavekoId);
          })}
        >
          {koSorteringer.map((koSortering) => (
            koSortering.kode !== 'FORSTONAD' && (
            <RadioOption
              key={koSortering.kode}
              value={koSortering.kode}
              label={koSortering.navn}
            >
              {(koSortering.felttype === 'DATO') && (
              <DatoSorteringValg
                intl={intl}
                valgtOppgavekoId={valgtOppgavekoId}
                hentOppgaveko={hentOppgaveko}
                lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
                fomDato={fomDato}
                tomDato={tomDato}
              />
              )}
              {//TODO legg in riktig felttype under og parse in til og fra når backend er klart
              }

              {(koSortering.felttype === 'DATO') && (<BelopSorteringValg til={0} fra={0} />)}
            </RadioOption>
            )

          ))}
        </RadioGroupField>
      </div>
    </>
  );
};

export default injectIntl(SorteringVelger);
