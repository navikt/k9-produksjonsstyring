import React, { FunctionComponent, useState } from 'react';
import { injectIntl, useIntl, WrappedComponentProps } from 'react-intl';

import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { ALLE_YTELSETYPER_VALGT, filtrereNyePerDato, UKE_2, UKE_4 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import HistorikkGrafForPunsj from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import GrafContainer from 'avdelingsleder/GrafContainer';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import AlleKodeverk from "kodeverk/alleKodeverkTsType";
import { useGlobalStateRestApiData } from "api/rest-api-hooks";
import { RestApiGlobalStatePathsKeys } from "api/k9LosApi";
import HistoriskData from '../../historiskDataTsType';
import HistorikkGraf from '../../HistorikkGraf';

interface OwnProps {
  beholdningPerDato?: HistoriskData[];
}

const id = 'beholdningForm';

/**
 * BeholdningHistorikkPanel.
 */
export const BeholdningHistorikkPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  beholdningPerDato,
}) => {
  const intl = useIntl();
  const behandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
  const [valgtYtelseType, setValgtYtelseType] = useState<string>(
    getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
  );

  const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
    getValueFromLocalStorage(`${id}-uker`) || UKE_2,
  );

  const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

  return (
    <GrafContainer
      valgtYtelseType={valgtYtelseType}
      antallUkerSomSkalVises={antallUkerSomSkalVises}
      setValgtYtelseType={setValgtYtelseType}
      setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
      tittel={intl.formatMessage({ id: 'BeholdningHistorikkPanel.Beholdning' })}
      id={id}
    >
      <>
        {valgtYtelseType === fagsakYtelseType.PUNSJ && (
          <HistorikkGrafForPunsj
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, beholdningPerDato, alleKodeverk)}
          />
        )}

        {valgtYtelseType !== fagsakYtelseType.PUNSJ && (
          <HistorikkGraf
            isFireUkerValgt={antallUkerSomSkalVises === UKE_4}
            behandlingTyper={behandlingTyper}
            historiskData={filtrereNyePerDato(valgtYtelseType, antallUkerSomSkalVises, beholdningPerDato, alleKodeverk)}
          />
        )}
      </>
    </GrafContainer>
  );
};

export default injectIntl(BeholdningHistorikkPanel);
