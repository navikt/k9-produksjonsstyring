import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import GrafContainer from 'avdelingsleder/GrafContainer';
import FordelingAvBehandlingstypeGraf from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/FordelingAvBehandlingstypeGraf';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import { ALLE_YTELSETYPER_VALGT, sjekkOmOppgaveSkalLeggesTil } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';

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
    <GrafContainer
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
    </GrafContainer>
  );
};

export default FordelingAvBehandlingstypePanel;
