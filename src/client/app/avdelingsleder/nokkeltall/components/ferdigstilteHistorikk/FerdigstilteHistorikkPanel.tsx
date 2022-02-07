import React, { FunctionComponent, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

import { ALLE_YTELSETYPER_VALGT, filtrereNyePerDato, UKE_2, UKE_4 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';

import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import HistorikkGraf from 'avdelingsleder/nokkeltall/HistorikkGraf';
import HistorikkGrafForPunsj from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import GrafBoks from 'avdelingsleder/GrafBoks';
import HistoriskData from '../../historiskDataTsType';

interface OwnProps {
  ferdigstiltePerDato?: HistoriskData[];
}

const id = 'ferdigstilteForm';
/**
 * FerdigstilteHistorikkPanel.
 */

export const FerdigstilteHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  ferdigstiltePerDato,
}) => {
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsetype`) || ALLE_YTELSETYPER_VALGT,
  );
  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );
  return (
    <GrafBoks
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'NyeHistorikkPanel.Nye' })}
      id={id}
    >
      <>
        {valgtYtelseType === fagsakYtelseType.PUNSJ && (
          <HistorikkGrafForPunsj
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, ferdigstiltePerDato)}
          />
        )}

        {valgtYtelseType !== fagsakYtelseType.PUNSJ && (
          <HistorikkGraf
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            behandlingTyper={behandlingTyper}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, ferdigstiltePerDato)}
          />
        )}
      </>
    </GrafBoks>
  );
};

export default injectIntl(FerdigstilteHistorikkPanel);
