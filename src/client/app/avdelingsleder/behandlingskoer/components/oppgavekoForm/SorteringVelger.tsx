import React, {FunctionComponent, useState} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {Normaltekst} from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import {K9LosApiKeys, RestApiGlobalStatePathsKeys} from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import {useGlobalStateRestApiData} from "api/rest-api-hooks";
import {getKodeverknavnFraKode} from "utils/kodeverkUtils";
import DatoSorteringValg from './DatoSorteringValg';
import BelopSorteringValg from "avdelingsleder/behandlingskoer/components/oppgavekoForm/BelopSorteringValg";
import styles from './utvalgskriterierForOppgavekoForm.less';
import KriterierType from "../../../../types/KriterierType";
import {Kriterie} from "avdelingsleder/behandlingskoer/oppgavekoTsType";
import {Checkbox} from "@navikt/ds-react";
import KoSortering from "kodeverk/KoSortering";

interface OwnProps {
  intl: any;
  valgtOppgavekoId: string;
  fomDato: string;
  tomDato: string;
  kriterier: Kriterie[];
  hentOppgaveko: (id: string) => void;
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
  const filtreringPåBelop = kriterier.find(kriterie => kriterie.kriterierType.kode === KriterierType.Feilutbetaling);
  const filtreringPåDato = fomDato && tomDato;

  let valgtFilter = [];

  if (filtreringPåBelop?.inkluder) {
    valgtFilter.push(KriterierType.Feilutbetaling);
  } else if (filtreringPåDato) {
    valgtFilter.push(KoSortering.OPPRETT_BEHANDLING);
  }

  const [valgtFiltrering, setValgtFiltrering] = useState<string[]>(valgtFilter);

  const {startRequest: lagreOppgavekoSorteringTidsintervallDato} = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO);
  const {startRequest: lagreOppgavekoSorteringBelop} = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);

  const lagreFilteringBelopp = (fraBelop: number, tilBelop: number) => lagreOppgavekoSorteringBelop({
    id: valgtOppgavekoId,
    kriterierType: KriterierType.Feilutbetaling,
    inkluder: valgtFiltrering.includes(KriterierType.Feilutbetaling),
    fom: fraBelop,
    tom: tilBelop,
  }).then(() => {
    hentOppgaveko(valgtOppgavekoId)
  });

  const fjerneFiltreringsbelop = () => lagreOppgavekoSorteringBelop({
    id: valgtOppgavekoId,
    kriterierType: KriterierType.Feilutbetaling,
    inkluder: false,
    fom: 0,
    tom: 0,
  }).then(() => {
    hentOppgaveko(valgtOppgavekoId)
  });

  const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);
  const koKriterier = useKodeverk<KoSorteringType>(kodeverkTyper.KO_KRITERIER);

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const leggTilEllerFjerneFiltrering = (kode: string, checked: boolean) => {
    const tmpValgtFiltrering = [...valgtFiltrering];
    if (checked && !valgtFiltrering.includes(kode)) {
      tmpValgtFiltrering.push(kode);
    } else {
      const indexSomSkalFjernes = tmpValgtFiltrering.indexOf(kode);
      tmpValgtFiltrering.splice(indexSomSkalFjernes, 1);
    }
    setValgtFiltrering(tmpValgtFiltrering);
  }

  return (
    <>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="FiltreringsVelger.Filtrering"/>
      </Normaltekst>
      <VerticalSpacer eightPx/>
      <div>
        {koSorteringer.map((koSortering) => (
          koSortering.kode !== 'FORSTONAD' && (
            <Checkbox
              key={koSortering.kode}
              value={koSortering.kode}
              checked={true}
              onChange={(e) => leggTilEllerFjerneFiltrering(e.target.value, e.target.checked)}
            >
              {(koSortering.felttype === 'DATO') && (<>
                  {getKodeverknavnFraKode(koSortering.kode, kodeverkTyper.KO_SORTERING, alleKodeverk)}
                  <DatoSorteringValg
                    intl={intl}
                    valgtOppgavekoId={valgtOppgavekoId}
                    hentOppgaveko={hentOppgaveko}
                    lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
                    fomDato={fomDato}
                    tomDato={tomDato}
                  />
                </>
              )}
            </Checkbox>
          )
          ))}

        {/* Måten er under er måten som vi skal gå videre med kriterier i framtiden. TODO er att få utvidet backend, legge in mer på måten under og byta ut react final form som bruker over med formik. */}
        
        {koKriterier.map((koKriterie) => ((
            koKriterie.kode === KriterierType.Feilutbetaling && (
              <Checkbox
                key={koKriterie.kode}
                value={koKriterie.kode}
                checked={valgtFiltrering.includes(koKriterie.kode)}
                onChange={(e) => {
                    leggTilEllerFjerneFiltrering(e.target.value, e.target.checked);
                    if (!e.target.checked) {
                      fjerneFiltreringsbelop()
                    }
                  }
                }
              >
                {getKodeverknavnFraKode(koKriterie.kode, kodeverkTyper.KO_KRITERIER, alleKodeverk)}
                {koKriterie.felttype === 'BELOP' && valgtFiltrering.includes(koKriterie.kode) && <BelopSorteringValg
                  til={parseInt(filtreringPåBelop?.tom) || 0}
                  fra={parseInt(filtreringPåBelop?.fom) || 0}
                  lagreFilteringBelopp={lagreFilteringBelopp}
                />}
              </Checkbox>
            )
          )
        ))}
      </div>
    </>
  );
};

export default injectIntl(SorteringVelger);
