import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {Normaltekst} from 'nav-frontend-typografi';
import {RadioGroupField, RadioOption,} from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { getKodeverknavnFraKode } from "utils/kodeverkUtils";
import DatoSorteringValg from './DatoSorteringValg';
import BelopSorteringValg from "avdelingsleder/behandlingskoer/components/oppgavekoForm/BelopSorteringValg";
import styles from './utvalgskriterierForOppgavekoForm.less';

interface OwnProps {
  intl: any;
  valgtOppgavekoId: string;
  fomDato: string;
  tomDato: string;
  fomBelop: number;
  tomBelop: number;
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
  fomBelop,
  tomBelop,
  hentOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoSortering } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING);
  const { startRequest: lagreOppgavekoSorteringTidsintervallDato } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO);
  const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);
  const koKriterier = useKodeverk<KoSorteringType>(kodeverkTyper.KO_KRITERIER);

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  return (
    <>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="FiltreringsVelger.Filtrering" />
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
              label={getKodeverknavnFraKode(koSortering.kode, kodeverkTyper.KO_SORTERING, alleKodeverk)}
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
            </RadioOption>
            )

          ))}

          {koKriterier.map((koKriterie) => ((
              <RadioOption
                key={koKriterie.kode}
                value={koKriterie.kode}
                label={getKodeverknavnFraKode(koKriterie.kode, kodeverkTyper.KO_KRITERIER, alleKodeverk)}
              >
                {(koKriterie.felttype === 'BELOP') && (
                  <BelopSorteringValg oppgaveKoId={valgtOppgavekoId} til={tomBelop} fra={fomBelop} />
                )}
              </RadioOption>
            )
          ))}
        </RadioGroupField>
      </div>
    </>
  );
};

export default injectIntl(SorteringVelger);
