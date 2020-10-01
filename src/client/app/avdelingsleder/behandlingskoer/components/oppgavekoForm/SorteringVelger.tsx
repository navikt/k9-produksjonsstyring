import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import {
  RadioGroupField, RadioOption,
} from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import { Kodeverk } from 'kodeverk/kodeverkTsType';
import useRestApiRunner from 'api/rest-api-hooks/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/global-data/useKodeverk';
import styles from './utvalgskriterierForOppgavekoForm.less';
import DatoSorteringValg from './DatoSorteringValg';

interface OwnProps {
  intl: any;
  valgtOppgavekoId: string;
  valgteBehandlingtyper: Kodeverk[];
  fomDato: string;
  tomDato: string;
}

/**
 * SorteringVelger
 */
const SorteringVelger: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  valgtOppgavekoId,
  valgteBehandlingtyper,
  fomDato,
  tomDato,
}) => {
  const { startRequest: lagreOppgavekoSortering } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING);
  const { startRequest: lagreOppgavekoSorteringTidsintervallDato } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO);
  const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);
  const { startRequest: hentOppgaveko } = useRestApiRunner(K9LosApiKeys.HENT_OPPGAVEKO);

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
            hentOppgaveko({ id: valgtOppgavekoId });
          })}
        >
          {koSorteringer.map((koSortering) => (
            (koSortering.feltkategori !== 'TILBAKEKREVING' || (valgteBehandlingtyper.length === 1 && valgteBehandlingtyper[0].kode === 'BT-009')) && (
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
            </RadioOption>
            )
          ))}
        </RadioGroupField>
      </div>
    </>
  );
};

export default injectIntl(SorteringVelger);
