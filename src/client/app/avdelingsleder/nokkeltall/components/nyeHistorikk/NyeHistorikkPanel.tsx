import React, { FunctionComponent, useState } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { ALLE_YTELSETYPER_VALGT, filtrereNyePerDato, UKE_2, UKE_4 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';
import HistorikkGrafForPunsj from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import GrafBoks from 'avdelingsleder/GrafBoks';
import HistoriskData from '../../historiskDataTsType';

interface OwnProps {
  nyePerDato?: HistoriskData[];
}

export const NyeHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ intl, nyePerDato }) => {
  const id = 'nyeBehandlinger';
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );
  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  return (
    <GrafBoks
      valgtYtelseType={valgtYtelseType}
      antallUkerSomSkalVises={antallUkerSomSkalVises}
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'NyeHistorikkPanel.Nye' })}
      id={id}
    >
      <>
        {valgtYtelseType === fagsakYtelseType.PUNSJ && (
          <HistorikkGrafForPunsj
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, nyePerDato)}
          />
        )}

        {valgtYtelseType !== fagsakYtelseType.PUNSJ && (
          <HistorikkGraf
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            behandlingTyper={behandlingTyper}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, nyePerDato)}
          />
        )}
      </>
    </GrafBoks>
  );
};

export default injectIntl(NyeHistorikkPanel);
