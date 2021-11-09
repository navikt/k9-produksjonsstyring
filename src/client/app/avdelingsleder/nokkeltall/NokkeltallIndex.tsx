import React, { FunctionComponent } from 'react';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { K9LosApiKeys } from 'api/k9LosApi';
import AlleOppgaver from 'avdelingsleder/nokkeltall/components/fordelingAvBehandlingstype/alleOppgaverTsType';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import IBehandlingerSomGarAvVentType
  from 'avdelingsleder/nokkeltall/components/behandlingerGårAvVent/behandlingerSomGårAvVentType';
import NokkeltallPanel from './components/NokkeltallPanel';

const EMPTY_ARRAY = [];

/**
 * NokkeltallIndex
 */

const NokkeltallIndex: FunctionComponent = (
) => {
  const {
    data: alleOppgaver = EMPTY_ARRAY,
  } = useRestApi<AlleOppgaver[]>(K9LosApiKeys.HENT_OPPGAVER);
  const {
    data: ferdigstiltePerDato = EMPTY_ARRAY,
  } = useRestApi<HistoriskData[]>(K9LosApiKeys.HENT_FERDIGSTILTE_HISTORIKK);
  const {
    data: nyePerDato = EMPTY_ARRAY,
  } = useRestApi<HistoriskData[]>(K9LosApiKeys.HENT_NYE_HISTORIKK);
  const {
    data: beholdningPerDato = EMPTY_ARRAY,
  } = useRestApi<HistoriskData[]>(K9LosApiKeys.HENT_OPPGAVER_PER_DATO);
  const {
    data: behandlingerSomGårAvVent = EMPTY_ARRAY,
  } = useRestApi<IBehandlingerSomGarAvVentType[]>(K9LosApiKeys.HENT_BEHANDLINGER_SOM_GÅR_AV_VENT);

  return (
    <NokkeltallPanel
      alleOppgaver={alleOppgaver}
      ferdigstiltePerDato={ferdigstiltePerDato}
      behandlingerSomGårAvVent={behandlingerSomGårAvVent}
      beholdningPerDato={beholdningPerDato}
      nyePerDato={nyePerDato}
    />
  );
};

export default NokkeltallIndex;
