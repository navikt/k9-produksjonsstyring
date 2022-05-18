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
import KriterierType from "../../../../types/KriterierType";
import {Kriterie} from "avdelingsleder/behandlingskoer/oppgavekoTsType";

interface OwnProps {
  intl: any;
  valgtOppgavekoId: string;
  fomDato: string;
  tomDato: string;
  kriterier: Kriterie[];
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
  kriterier
}) => {
  const { startRequest: lagreOppgavekoSortering } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING);
  const { startRequest: lagreOppgavekoSorteringTidsintervallDato } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO);
  const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);
  const koKriterier = useKodeverk<KoSorteringType>(kodeverkTyper.KO_KRITERIER);

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const feilutbetaling = kriterier.find(kriterie => kriterie.kriterierType.kode === KriterierType.Feilutbetaling);

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

        </RadioGroupField>

        {koKriterier.map((koKriterie) => ((
            koKriterie.kode === KriterierType.Feilutbetaling && (
              <RadioOption
                key={koKriterie.kode}
                value={koKriterie.kode}
                actualValue={koKriterie.kode}
                label={getKodeverknavnFraKode(koKriterie.kode, kodeverkTyper.KO_KRITERIER, alleKodeverk)}
              >
                <BelopSorteringValg oppgaveKoId={valgtOppgavekoId} til={parseInt(feilutbetaling?.tom) || 0} fra={parseInt(feilutbetaling?.fom) || 0} />
              </RadioOption>
            )
          )
        ))}
      </div>
    </>
  );
};

export default injectIntl(SorteringVelger);
