import React, { FunctionComponent, useMemo, useState, } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import behandlingType from 'kodeverk/behandlingType';
import { CheckboxField} from 'form/FinalFields';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import NavFrontendChevron from 'nav-frontend-chevron';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { getKodeverkFraKode, getKodeverknavnFraKode } from "utils/kodeverkUtils";
import punsjBehandlingstyper from '../../../../types/PunsjBehandlingstyper';
import styles from './utvalgskriterierForOppgavekoForm.less';

const behandlingstypeOrder = Object.values(behandlingType);

interface OwnProps {
    valgtOppgavekoId: string;
    hentOppgaveko:(id: string) => void;
    valgteBehandlingstyper: string[],
}

interface ValgtBehandlingstype{
  behandlingType: string;
  checked: boolean;
}
/**
 * BehandlingstypeVelger
 */
const BehandlingstypeVelger: FunctionComponent<OwnProps> = ({
  valgtOppgavekoId,
  hentOppgaveko,
  valgteBehandlingstyper,
}) => {
  const { startRequest: lagreOppgavekoBehandlingstype } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE);

  const alleBehandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  const behandlingTyper = behandlingstypeOrder.map((kode) => alleBehandlingTyper.find((bt) => bt.kode === kode));
  const behandlingTyperIkkePunsj = useMemo(() => behandlingTyper.filter((type) => !punsjBehandlingstyper.includes(type.kode)), []);
  const behandlingTyperPunsj = useMemo(() => behandlingTyper.filter((type) => punsjBehandlingstyper.includes(type.kode)), []);
  const [visPunsj, setVisPunsj] = useState<boolean>(valgteBehandlingstyper.some(((bt) => getKodeverkFraKode(bt, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn)));

  const sisteValgteBehandlingstyper: ValgtBehandlingstype[] = valgteBehandlingstyper.map((kode) => ({
    behandlingType: kode, checked: true,
  }));

  const oppdatereValgteBehandlingstyper = () => {
    lagreOppgavekoBehandlingstype({
      id: valgtOppgavekoId,
      behandlingsTyper: sisteValgteBehandlingstyper.filter((bt) => bt.checked)
        // TODO: Trenger ikke mappe dette når backend tar emot behandlingstyper som string
        .map(bt => ({
          behandlingType: {
            kode: bt.behandlingType,
            kodeverk: getKodeverkFraKode(bt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk),
            navn: getKodeverknavnFraKode(bt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)
          },
          checked: true
        }))
    }).then(() => {
      hentOppgaveko(valgtOppgavekoId);
    });
  };

  const oppdaterBehandlingstype = (behandlingstype: string, checked: boolean) => {
    const index = sisteValgteBehandlingstyper.findIndex((bt) => bt.behandlingType === behandlingstype);
    if (index !== -1) {
      sisteValgteBehandlingstyper[index].checked = checked;
    } else {
      sisteValgteBehandlingstyper.push({ behandlingType: behandlingstype, checked });
    }
  };

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
            onChange={(isChecked) => {
              oppdaterBehandlingstype(bt.kode, isChecked);
              oppdatereValgteBehandlingstyper();
            }}
            checked={sisteValgteBehandlingstyper.some((behandlingstype) => behandlingstype.behandlingType === bt.kode && behandlingstype.checked)}
          />
        </React.Fragment>
      ))}

      <button type="button" className={styles.punsjVal} onClick={() => setVisPunsj(!visPunsj)}>
        <NavFrontendChevron type={visPunsj ? 'ned' : 'høyre'} />
        <Normaltekst className={styles.punsjTekst}>Punsj</Normaltekst>
      </button>

      {visPunsj && (
        <div className={styles.punsjUndervalg}>
          {behandlingTyperPunsj.map((bt) => (
            <React.Fragment key={bt.kode}>
              <VerticalSpacer fourPx />
              <CheckboxField
                name={bt.kode}
                label={bt.navn}
                onChange={(isChecked) => {
                  oppdaterBehandlingstype(bt.kode, isChecked);
                  oppdatereValgteBehandlingstyper();
                }}
                checked={sisteValgteBehandlingstyper.some((behandlingstype) => behandlingstype.behandlingType === bt.kode && behandlingstype.checked)}
              />
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};
export default BehandlingstypeVelger;
