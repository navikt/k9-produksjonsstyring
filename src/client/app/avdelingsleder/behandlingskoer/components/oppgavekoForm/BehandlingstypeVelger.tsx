import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField } from 'form/FinalFields';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { RenderCheckboxField } from 'form/finalFields/CheckboxField';
import { Checkbox as NavCheckbox } from 'nav-frontend-skjema';
import styles from './utvalgskriterierForOppgavekoForm.less';

const behandlingstypeOrder = Object.values(behandlingType);

interface OwnProps {
    valgtOppgavekoId: string;
    hentOppgaveko:(id: string) => void;
}

/**
 * BehandlingstypeVelger
 */
const BehandlingstypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  hentOppgaveko,
}) => {
  const { startRequest: lagreOppgavekoBehandlingstype } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE);
  const punsjBehandlingstyper = [
    'PAPIRSØKNAD',
    'PAPIRETTERSENDELSE',
    'PAPIRINNTEKTSOPPLYSNINGER',
    'DIGITAL_ETTERSENDELSE',
    'INNLOGGET_CHAT',
    'SKRIV_TIL_OSS_SPØRMSÅL',
    'SKRIV_TIL_OSS_SVAR',
    'SAMTALEREFERAT',
    'UKJENT'];

  const alleBehandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);

  const behandlingTyper = behandlingstypeOrder.map((kode) => alleBehandlingTyper.find((bt) => bt.kode === kode));
  const behandlingTyperIkkePunsj = useMemo(() => behandlingTyper.filter((type) => !punsjBehandlingstyper.includes(type.kode)), []);
  const behandlingTyperPunsj = useMemo(() => behandlingTyper.filter((type) => punsjBehandlingstyper.includes(type.kode)), []);
  const [visPunsj, setVisPunsj] = useState<boolean>(false);

  return (
    <>
      <Normaltekst className={styles.label}>
        <FormattedMessage id="BehandlingstypeVelger.Behandlingstype" />
      </Normaltekst>
      <VerticalSpacer eightPx />
      {behandlingTyperIkkePunsj.map((bt) => (
        <React.Fragment key={bt.kode}>
          <VerticalSpacer fourPx />
          <CheckboxField
            name={bt.kode}
            label={bt.navn}
            onChange={(isChecked) => lagreOppgavekoBehandlingstype({ id: valgtOppgavekoId, behandlingType: bt, checked: isChecked }).then(() => {
              hentOppgaveko(valgtOppgavekoId);
            })}
          />
        </React.Fragment>
      ))}

      <VerticalSpacer fourPx />
      <NavCheckbox
        className={styles.punsjOverskrift}
        onChange={(isChecked) => setVisPunsj(isChecked.target.checked)}
        checked={visPunsj}
        label="Punsj"
      />

      {visPunsj && (
        <div className={styles.punsjUndervalg}>
          {behandlingTyperPunsj.map((bt) => (
            <React.Fragment key={bt.kode}>
              <VerticalSpacer fourPx />
              <CheckboxField
                name={bt.kode}
                label={bt.navn}
                onChange={(isChecked) => lagreOppgavekoBehandlingstype({
                  id: valgtOppgavekoId,
                  behandlingType: bt,
                  checked: isChecked,
                }).then(() => {
                  hentOppgaveko(valgtOppgavekoId);
                })}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};
export default BehandlingstypeVelger;
