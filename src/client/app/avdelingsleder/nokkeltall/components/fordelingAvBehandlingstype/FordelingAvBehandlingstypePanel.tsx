import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import { ALLE_YTELSETYPER_VALGT, sjekkOmOppgaveSkalLeggesTil } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import FordelingAvBehandlingstypeGraf from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/FordelingAvBehandlingstypeGraf';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import GrafBoks from 'avdelingsleder/GrafBoks';
interface OwnProps {
  alleOppgaver?: AlleOppgaver[];
}

const id = 'fordelingAvBehandlingstype';

/**
 * FordelingAvBehandlingstypePanel.
 */
export const FordelingAvBehandlingstypePanel: FunctionComponent<OwnProps> = ({ alleOppgaver }) => {
  const intl = useIntl();
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  return (
    <GrafBoks
      valgtYtelseType={valgtYtelseType}
      setValgtYtelseType={setValgtYtelseType}
      tittel={intl.formatMessage({ id: 'FordelingAvBehandlingstypePanel.Fordeling' })}
      id={id}
    >
      <FordelingAvBehandlingstypeGraf
        behandlingTyper={behandlingTyper}
        alleOppgaver={alleOppgaver ? alleOppgaver.filter(ofa => sjekkOmOppgaveSkalLeggesTil(valgtYtelseType, ofa)) : []}
        erPunsjValgt={valgtYtelseType === fagsakYtelseType.PUNSJ}
      />
    </GrafBoks>
  );
};

export default FordelingAvBehandlingstypePanel;
